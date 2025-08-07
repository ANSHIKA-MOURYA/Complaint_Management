import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the trained sentiment model
model = joblib.load("ml_model/sentiment_model.pkl")

# Priority Mapping
priority_mapping = {
    "negative": "High",
    "neutral": "Medium",
    "positive": "Low"
}

@app.route("/analyze_sentiment", methods=["POST"])
def analyze_sentiment():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    sentiment = model.predict([text])[0]
    priority = priority_mapping.get(sentiment, "Medium")

    return jsonify({"sentiment": sentiment, "priority": priority})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
