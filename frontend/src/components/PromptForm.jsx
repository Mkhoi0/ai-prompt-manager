import React, { useState, useEffect } from "react";

export default function PromptForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [tags, setTags] = useState(initial?.tags || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setTags(initial?.tags || "");
  }, [initial]);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ title, content, tags });
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label>
        Prompt content
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>

      <label>
        Tags (comma-separated)
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. coding, marketing, brainstorm"
        />
      </label>

      <div className="form-actions">
        <button type="submit">{initial ? "Save changes" : "Add prompt"}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
