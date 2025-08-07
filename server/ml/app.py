from flask import Flask, request, jsonify
import joblib
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)

# Directly use your MongoDB URI (Replace with your actual URI)
MONGO_URI = "mongodb+srv://anshikanickey123:anshika@cluster0.klg3u.mongodb.net/complaint_system?retryWrites=true&w=majority"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["complaint_system"]  # Database name
complaints_collection = db["complaints"]  # Collection name

# Load ML Model & Preprocessors
model = joblib.load("ml/model.pkl")
vectorizer = joblib.load("ml/vectorizer.pkl")
label_encoder = joblib.load("ml/label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "")

        # Transform text using vectorizer
        transformed_text = vectorizer.transform([text])

        # Predict category (returns an int)
        predicted_category_index = model.predict(transformed_text)[0]

        # Convert int32 to category name using label encoder
        predicted_category = label_encoder.inverse_transform([predicted_category_index])[0]

        # Save prediction to MongoDB
        complaint_data = {
            "text": text,
            "category": predicted_category
        }
        complaints_collection.insert_one(complaint_data)

        return jsonify({
            "category": predicted_category,
            "message": "Complaint saved successfully!"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
