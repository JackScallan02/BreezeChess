import boto3
import os
from pathlib import Path
from botocore.exceptions import ClientError
import sys

# --- Configuration ---
BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "breezechess-bucket")
ENDPOINT_URL = os.environ.get("AWS_ENDPOINT", "http://localhost:4566")
REGION_NAME = os.environ.get("AWS_REGION", "us-east-1")
ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID", "test")
SECRET_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "test")
ASSETS_DIR = Path("/assets/chess_pieces")

# --- S3 Client ---
s3_client = boto3.client(
    "s3",
    region_name=REGION_NAME,
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)

# --- Create Bucket ---
try:
    s3_client.head_bucket(Bucket=BUCKET_NAME)
    print(f"Bucket '{BUCKET_NAME}' already exists.")
except ClientError:
    s3_client.create_bucket(Bucket=BUCKET_NAME)
    print(f"Bucket '{BUCKET_NAME}' created.")

# --- Upload Files ---
if not ASSETS_DIR.exists():
    print(f"Assets directory does not exist: {ASSETS_DIR}")
    exit(1)

for set_dir in ASSETS_DIR.iterdir():
    if not set_dir.is_dir():
        continue

    for color in ['b', 'w']:
        color_dir = set_dir / color
        if not color_dir.exists():
            continue

        for file_path in color_dir.glob("*.png"):
            key = f"chess_piece/{set_dir.name}/{color}/{file_path.name}"
            try:
                with open(file_path, "rb") as f:
                    s3_client.put_object(
                        Bucket=BUCKET_NAME,
                        Key=key,
                        Body=f,
                        ContentType="image/png"
                    )
                
            except Exception as e:
                print(f"❌ Failed to upload {key}: {e}")
        print(f"Uploaded: {key} to S3")

print("All chess pieces uploaded to S3.")
