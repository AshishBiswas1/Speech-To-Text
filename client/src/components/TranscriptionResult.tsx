import React from "react";

export default function TranscriptionResult({ text }) {
  return (
    <section className="result-container" aria-live="polite">
      <h2>Transcription Result</h2>
      <p>{text}</p>
    </section>
  );
}
