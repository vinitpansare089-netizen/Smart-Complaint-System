import gradio as gr
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import torch
import random
from collections import deque

# --------------------------
# Load Model & Setup Memory
# --------------------------

model_name = "j-hartmann/emotion-english-distilroberta-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

emotion_memory = deque(maxlen=10)

# Empathy replies
empathy_replies = {
    "sadness": [
        "I’m sorry you’re feeling low. Want to talk about it?",
        "It’s okay to feel down sometimes — I’m here for you.",
        "That sounds tough. Take a deep breath, you’re not alone."
    ],
    "joy": [
        "That’s amazing! Keep smiling!",
        "Love that energy — what made your day so good?",
        "That’s great news! You deserve it."
    ],
    "anger": [
        "I can sense that frustration. Want to share what happened?",
        "Anger can be hard — maybe we can calm things down together.",
        "That sounds rough. I’m here to listen."
    ],
    "fear": [
        "That sounds scary, but you’ll get through it.",
        "It’s normal to feel afraid — you’re not alone.",
        "Facing fear takes courage — you’ve got this."
    ],
    "love": [
        "That’s heartwarming! Love brings so much light.",
        "That’s beautiful — what makes it so special?",
        "Love always finds a way to shine."
    ],
    "surprise": [
        "Wow, that must’ve caught you off guard!",
        "That’s unexpected! How did you react?",
        "Life really surprises us sometimes!"
    ],
    "disgust": [
        "That must’ve been unpleasant.",
        "I get that — some things are just gross.",
        "That sounds uncomfortable to deal with."
    ]
}


# --------------------------
# Core Functions
# --------------------------

def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits[0].cpu().numpy()
    probabilities = softmax(logits)

    labels = [model.config.id2label[i] for i in range(len(probabilities))]
    results = dict(zip(labels, probabilities))

    top_emotion = max(results, key=results.get)
    confidence = round(float(results[top_emotion]), 3)

    emotion_memory.append(top_emotion)

    return top_emotion, confidence, results


def generate_reply(emotion):
    if emotion in empathy_replies:
        return random.choice(empathy_replies[emotion])
    return "I’m here to listen."


# --------------------------
# Gradio Interface Function
# --------------------------

def analyze_text(text):
    if not text.strip():
        return "Please type something.", "", "", ""

    emotion, confidence, all_scores = predict_emotion(text)
    reply = generate_reply(emotion)

    # convert probability dict to text
    probs_text = "\n".join([f"{label}: {round(score, 3)}" for label, score in all_scores.items()])

    # memory summary
    memory_msg = ""
    if len(emotion_memory) > 3:
        most_common = max(set(emotion_memory), key=emotion_memory.count)
        memory_msg = f"You've often felt **{most_common}** recently."

    return (
        f"**Emotion:** {emotion} ({confidence})",
        reply,
        memory_msg,
        probs_text
    )


# --------------------------
# Gradio App Layout
# --------------------------

app = gr.Interface(
    fn=analyze_text,
    inputs=gr.Textbox(lines=3, placeholder="Type your feelings here..."),
    outputs=[
        gr.Markdown(label="Detected Emotion"),
        gr.Markdown(label="Empathetic Reply"),
        gr.Markdown(label="Emotion Memory Insight"),
        gr.Textbox(label="Emotion Probabilities")
    ],
    title="Trinovous TextIQ — Emotion Analyzer",
    description="A lightweight AI that understands emotions and replies empathetically."
)

# --------------------------
# Run App
# --------------------------
if __name__ == "__main__":
    app.launch()
