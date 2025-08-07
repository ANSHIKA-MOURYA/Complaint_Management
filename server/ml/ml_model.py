import pickle
import numpy as np

# Load trained model and preprocessing objects
with open("model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

with open("label_encoder.pkl", "rb") as label_encoder_file:
    label_encoder = pickle.load(label_encoder_file)

def predict_complaint(complaint_text):
    """Predicts the category of a given complaint."""
    transformed_text = vectorizer.transform([complaint_text])
    prediction = model.predict(transformed_text)
    predicted_label = label_encoder.inverse_transform(prediction)[0]
    return predicted_label
