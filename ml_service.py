import numpy as np
from typing import Dict
import base64
from PIL import Image
import io

class PPEDetector:
    def __init__(self):
        # PPE classes
        self.ppe_classes = ["helmet", "safety_vest", "boots", "goggles", "mask", "gloves"]
        
        # Required PPE for coal mines
        self.required_ppe = ["helmet", "safety_vest", "boots"]
        
        print("PPE Detector initialized (Mock mode)")
    
    def preprocess_image(self, image_data: str):
        """Convert base64 image to numpy array"""
        try:
            # Remove header if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB
            image = image.convert('RGB')
            
            # Convert to numpy array
            image_np = np.array(image)
            
            return image_np
            
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def detect_ppe(self, image_data: str) -> Dict:
        """
        Detect PPE in the image
        REPLACE THIS WITH YOUR ACTUAL ML MODEL
        """
        try:
            # Preprocess image
            image = self.preprocess_image(image_data)
            
            if image is None:
                return {"error": "Failed to process image"}
            
            # MOCK DETECTION - REPLACE WITH YOUR MODEL
            import random
            
            # Mock detection results
            mock_detections = {
                "helmet": random.random() > 0.3,
                "safety_vest": random.random() > 0.4,
                "boots": random.random() > 0.5,
                "goggles": random.random() > 0.6,
                "mask": random.random() > 0.7,
                "gloves": random.random() > 0.8
            }
            
            # Process results
            missing_ppe = []
            detected_ppe = []
            confidence_scores = {}
            
            for ppe_item, is_detected in mock_detections.items():
                if is_detected:
                    detected_ppe.append(ppe_item)
                    confidence_scores[ppe_item] = round(random.random(), 2)
                elif ppe_item in self.required_ppe:
                    missing_ppe.append(ppe_item)
            
            # Check compliance
            is_compliant = all(item in detected_ppe for item in self.required_ppe)
            compliance_score = (len(detected_ppe) / len(self.required_ppe)) * 100
            
            return {
                "detected_ppe": detected_ppe,
                "missing_ppe": missing_ppe,
                "is_compliant": is_compliant,
                "compliance_score": round(compliance_score, 2),
                "confidence_scores": confidence_scores,
                "required_ppe": self.required_ppe
            }
            
        except Exception as e:
            return {"error": str(e)}

# Create global detector instance
detector = PPEDetector()