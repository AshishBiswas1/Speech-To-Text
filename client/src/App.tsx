import { useState } from "react";
import AudioUploader from "./components/AudioUploader";
import TranscriptionResult from "./components/TranscriptionResult";
import Loader from "./components/Loader";
import Notification from "./components/Notification";
import "./App.css";

export default function App() {
  // State for multiple transcripts: array of objects {file, transcript}
  const [transcripts, setTranscripts] = useState<
    Array<{ file: string; transcript: string }>
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioNames, setAudioNames] = useState<string[]>([]);

  // Handle multiple files upload
  const handleUpload = async (audioFiles: FileList | File[]) => {
    setLoading(true);
    setError("");
    setTranscripts([]);
    setAudioNames(Array.from(audioFiles).map((file) => file.name));

    try {
      const formData = new FormData();
      Array.from(audioFiles).forEach((file) => {
        formData.append("audio", file);
      });

      const response = await fetch("/api/transcribe/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error!");
      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.data)) {
        setTranscripts(data.data); // Array of { file, transcript }
      } else {
        setError("No transcription received");
      }
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTranscripts([]);
    setError("");
    setAudioNames([]);
  };

  return (
    <div className="app-container">
      <div className="left-panel card">
        <h1 className="title">Speech to Text Transcription</h1>
        <AudioUploader onUpload={handleUpload} />

        {audioNames.length > 0 && (
          <div className="audio-file-info">
            <span>Uploaded files: {audioNames.join(", ")}</span>
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
      </div>

      <div className="right-panel">
        {transcripts.length > 0 && !loading ? (
          transcripts.map(({ file, transcript }) => (
            <div key={file} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#ff7800", marginBottom: "0.5rem" }}>
                {file}
              </h3>
              <TranscriptionResult text={transcript} />
            </div>
          ))
        ) : (
          <p className="placeholder-text">Transcription will appear here</p>
        )}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Speech to Text App
      </footer>
    </div>
  );
}
