import React, { useState } from "react";

export default function PromptCard({ prompt, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const tagList = (prompt.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="prompt-card">
      <div className="prompt-card-header">
        <h3>{prompt.title}</h3>
        <div className="prompt-card-actions">
          <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          <button onClick={() => onEdit(prompt)}>Edit</button>
          <button className="danger" onClick={() => onDelete(prompt.id)}>
            Delete
          </button>
        </div>
      </div>
      <p className="prompt-content">{prompt.content}</p>
      {tagList.length > 0 && (
        <div className="tag-list">
          {tagList.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
