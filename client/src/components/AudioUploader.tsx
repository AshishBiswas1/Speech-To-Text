import React, { useRef, useState } from "react";
import type { JSX } from "react";
import type { ChangeEvent, KeyboardEvent, DragEvent } from "react";

interface AudioUploaderProps {
  onUpload: (file: File) => void;
}

export default function AudioUploader({
  onUpload,
}: AudioUploaderProps): JSX.Element {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) onUpload(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) onUpload(file);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      fileInput.current?.click();
    }
  };

  return (
    <div
      className={`upload-container ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={0}
      aria-label="Drag and drop audio file or click to upload"
      onClick={() => fileInput.current?.click()}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={fileInput}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <p>Drag & drop an audio file here, or click to select a file</p>
      <button className="upload-btn" type="button">
        Upload Audio
      </button>
    </div>
  );
}
