import React, { useState } from "react";
import AudioUploader from "./components/AudioUploader";
import TranscriptionResult from "./components/TranscriptionResult";
import Loader from "./components/Loader";
import Notification from "./components/Notification";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [audioName, setAudioName] = useState("");

  const handleUpload = async (audioFile: File) => {
    setLoading(true);
    setError("");
    setTranscript("");
    setAudioName(audioFile.name);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error!");
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTranscript("");
    setError("");
    setAudioName("");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Speech to Text Transcription</h1>
        <AudioUploader onUpload={handleUpload} />
        {audioName && (
          <div className="audio-file-info">
            <span>{audioName}</span>
            <button
              className="reset-btn"
              onClick={handleReset}
              aria-label="Remove uploaded audio"
            >
              ✕
            </button>
          </div>
        )}
        {loading && <Loader />}
        {error && <Notification type="error" message={error} />}
        {transcript && !loading && <TranscriptionResult text={transcript} />}
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Speech to Text App
      </footer>
    </div>
  );
}
