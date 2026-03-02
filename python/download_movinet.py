import kagglehub
import os

def download_movinet():
    print("Downloading MoViNet a0-base-kinetics-600-classification...")
    path = kagglehub.model_download("google/movinet/tensorFlow2/a0-base-kinetics-600-classification")
    print("Path to model files:", path)
    return path

if __name__ == "__main__":
    model_path = download_movinet()
    print("\nFiles in model path:")
    for root, dirs, files in os.walk(model_path):
        for f in files:
            print(f"- {os.path.join(root, f)}")
