#!/usr/bin/env python3
"""
Video Analysis Script (Latest Python Compatible)
- Uses OpenCV for video handling
- Uses YOLOv8 (ultralytics) for person detection
- Uses MediaPipe for face, hand, and pose analysis
- Compatible with Python 3.13+
"""

import cv2
import numpy as np
import json
import sys
import base64
import tempfile
import os
from ultralytics import YOLO
import mediapipe as mp
from typing import Dict, Any

def analyze_video(video_path: str, scenario: str, duration: float) -> Dict[str, Any]:
    # Initialize models
    yolo_model = YOLO('yolov8n.pt')
    mp_face = mp.solutions.face_mesh
    mp_hands = mp.solutions.hands
    mp_pose = mp.solutions.pose
    face_mesh = mp_face.FaceMesh(static_image_mode=False, max_num_faces=2)
    hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2)
    pose = mp_pose.Pose(static_image_mode=False)

    # Open video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"status": "error", "message": "Could not open video file."}
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    sample_frames = min(50, max(10, total_frames // 10))
    results_data = []
    person_detected = False
    for i in range(sample_frames):
        frame_idx = int(i * total_frames / sample_frames)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            continue
        # YOLOv8 person detection
        yolo_results = yolo_model(frame, verbose=False)
        person_count = sum(1 for box in yolo_results[0].boxes if int(box.cls[0]) == 0)
        if person_count == 1:
            person_detected = True
            # MediaPipe analysis
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_results = face_mesh.process(rgb_frame)
            hand_results = hands.process(rgb_frame)
            pose_results = pose.process(rgb_frame)
            num_faces = len(face_results.multi_face_landmarks) if face_results.multi_face_landmarks else 0
            num_hands = len(hand_results.multi_hand_landmarks) if hand_results.multi_hand_landmarks else 0
            pose_detected = pose_results.pose_landmarks is not None
            results_data.append({
                'face_detected': num_faces > 0,
                'hands_detected': num_hands > 0,
                'pose_detected': pose_detected
            })
        else:
            results_data.append({'face_detected': False, 'hands_detected': False, 'pose_detected': False})
    cap.release()
    if not person_detected:
        return {"status": "error", "message": "No person detected in the video."}
    # Aggregate results
    face_score = int(100 * sum(1 for r in results_data if r['face_detected']) / len(results_data))
    hand_score = int(100 * sum(1 for r in results_data if r['hands_detected']) / len(results_data))
    pose_score = int(100 * sum(1 for r in results_data if r['pose_detected']) / len(results_data))
    overall_score = int(np.mean([face_score, hand_score, pose_score]))
    feedback = []
    if face_score > 80:
        feedback.append("Excellent face visibility and eye contact.")
    elif face_score > 50:
        feedback.append("Face detected in most frames. Try to keep your face visible.")
    else:
        feedback.append("Face rarely detected. Please face the camera.")
    if hand_score > 50:
        feedback.append("Good use of hand gestures.")
    else:
        feedback.append("Try to use your hands more for expressive communication.")
    if pose_score > 70:
        feedback.append("Confident posture detected.")
    else:
        feedback.append("Work on maintaining a confident posture.")
    return {
        "status": "success",
        "message": "Analysis completed successfully.",
        "overallScore": overall_score,
        "faceScore": face_score,
        "handScore": hand_score,
        "poseScore": pose_score,
        "feedback": feedback,
        "framesAnalyzed": len(results_data)
    }

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python video_analysis_latest.py <video_path> <scenario> <duration>"}))
        sys.exit(1)
    video_path = sys.argv[1]
    scenario = sys.argv[2]
    duration = float(sys.argv[3])
    # Handle base64 encoded video data
    if video_path.startswith('data:video') or len(video_path) > 1000:
        try:
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                video_data = base64.b64decode(video_path)
                temp_file.write(video_data)
                temp_file_path = temp_file.name
            video_path = temp_file_path
        except Exception as e:
            print(json.dumps({"error": f"Failed to decode video data: {str(e)}"}))
            sys.exit(1)
    try:
        result = analyze_video(video_path, scenario, duration)
        if video_path != sys.argv[1]:
            os.unlink(video_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Analysis failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main() 
