import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

model = joblib.load(BASE_DIR / "scam_model.pkl")
vectorizer = joblib.load(BASE_DIR / "tfidf_vectorizer.pkl")


def analyze_message(text: str):
    message_vector = vectorizer.transform([text])

    prediction = model.predict(message_vector)[0]
    probabilities = model.predict_proba(message_vector)[0]

    confidence = float(max(probabilities)) * 100

    if prediction == 1:
        result = "SCAM"
    else:
        result = "SAFE"

    return {
        "prediction": result,
        "confidence": round(confidence, 2),
        "message": text
    }