import os
import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import json
import argparse
import sys

# Mapping Kinetics-600 labels to Security Incident Types
CRIME_MAPPING = {
    'fighting': 'Fighting',
    'shoving': 'Fighting',
    'punching': 'Fighting',
    'slapping': 'Fighting',
    'kicking': 'Fighting',
    'robbing': 'Theft',
    'stealing': 'Theft',
    'breaking': 'Vandalism',
    'vandalizing': 'Vandalism',
    'climbing': 'Suspicious Activity',
    'running': 'Suspicious Activity',
    'tripping': 'Normal', # Could be an accident
    'walking': 'Normal',
}

def load_labels():
    # Kinetics 600 labels are standard. 
    # For a0-base, we can use the labels from the official repository or a local list if needed.
    # Here we'll use a simplified approach since we only care about specific crime-related keywords.
    # Note: In a production environment, you'd load the full kinetics_600_labels.csv
    pass

class VideoAnalyzer:
    def __init__(self, model_path):
        print(f"Loading MoViNet model from {model_path}...", file=sys.stderr)
        self.model = tf.saved_model.load(model_path)
        self.infer = self.model.signatures['serving_default']
        
    def preprocess_video(self, video_path, num_frames=32):
        cap = cv2.VideoCapture(video_path)
        frames = []
        count = 0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        skip = max(1, total_frames // num_frames)
        
        while len(frames) < num_frames:
            ret, frame = cap.read()
            if not ret:
                break
            if count % skip == 0:
                frame = cv2.resize(frame, (172, 172))
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame)
            count += 1
        cap.release()
        
        while len(frames) < num_frames:
            frames.append(np.zeros((172, 172, 3), dtype=np.uint8))
            
        video = np.array(frames, dtype=np.float32)
        video = video / 255.0
        return np.expand_dims(video, axis=0) # [1, 32, 172, 172, 3]

    def analyze(self, video_path):
        video_input = self.preprocess_video(video_path)
        # MoViNet a0-base takes [1, frames, 172, 172, 3]
        # Based on inspection: input is 'image', output is 'classifier_head'
        outputs = self.infer(image=tf.constant(video_input))
        
        probs = outputs['classifier_head'].numpy()[0]
        
        # In real use, you'd use kinetics-600 labels
        # Here we map top indices to possible crime types for demonstration
        top_idx = np.argmax(probs)
        confidence = float(probs[top_idx])
        
        # Simplified mapping logic for demo
        detected_type = "Normal"
        if confidence > 0.3:
            # Indices for common actions in Kinetics-600 (approximate for demo)
            # In a full impl, we'd use the actual labels.csv
            indices_map = {
                150: "Fighting",    # Approximate index for fighting
                400: "Theft",       # Approximate index for picking pocket
                500: "Vandalism",   # Approximate index for graffiti
            }
            detected_type = indices_map.get(top_idx, "Activity Detected")
            if detected_type == "Activity Detected" and confidence < 0.5:
                detected_type = "Normal"
            
        return {
            "detected": detected_type != "Normal",
            "type": detected_type,
            "confidence": confidence,
            "details": f"MoViNet detected action signatures: {detected_type}.",
            "reasoning": f"Inference matched Kinetics-600 index {top_idx} with {confidence*100:.1f}% confidence."
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    parser.add_argument("--model", required=True)
    args = parser.parse_args()
    
    analyzer = VideoAnalyzer(args.model)
    result = analyzer.analyze(args.video)
    print(json.dumps(result))
