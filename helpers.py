# Utility functions
import json
from datetime import datetime

def format_datetime(dt: datetime) -> str:
    """Format datetime to string"""
    return dt.isoformat() if dt else None

def save_json(data, filename: str):
    """Save data to JSON file"""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

def load_json(filename: str):
    """Load data from JSON file"""
    with open(filename, 'r') as f:
        return json.load(f)