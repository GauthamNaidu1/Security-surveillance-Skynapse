import kagglehub
import os

def download_datasets():
    print("Downloading securityincident...")
    path1 = kagglehub.dataset_download("mikrokosmos1/securityincident")
    print("Path to securityincident:", path1)
    
    print("\nDownloading crimedata...")
    path2 = kagglehub.dataset_download("mikrokosmos1/crimedata")
    print("Path to crimedata:", path2)
    
    return path1, path2

if __name__ == "__main__":
    p1, p2 = download_datasets()
    
    print("\nFiles in path1:")
    for f in os.listdir(p1):
        print(f"- {f}")
        
    print("\nFiles in path2:")
    for f in os.listdir(p2):
        print(f"- {f}")
