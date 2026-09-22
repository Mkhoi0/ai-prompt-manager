import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import PromptCard from "../components/PromptCard.jsx";
import PromptForm from "../components/PromptForm.jsx";

export default function Dashboard() {
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null = not editing, {} = new, {...} = existing
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  async function loadPrompts(searchTerm = "") {
    try {
      const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
      const data = await api.getPrompts(query);
      setPrompts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadPrompts();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  }

  async function handleSave(data) {
    try {
      if (editing?.id) {
        await api.updatePrompt(editing.id, data);
      } else {
        await api.createPrompt(data);
      }
      setEditing(null);
      loadPrompts(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this prompt?")) return;
    try {
      await api.deletePrompt(id);
      loadPrompts(search);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadPrompts(search);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AI Prompt Manager</h1>
        <div className="header-right">
          <span className="user-email">{email}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            placeholder="Search prompts by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <button className="primary" onClick={() => setEditing({})}>
          + New prompt
        </button>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing.id ? "Edit prompt" : "New prompt"}</h2>
            <PromptForm
              initial={editing.id ? editing : null}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      <div className="prompt-grid">
        {prompts.length === 0 && <p className="empty-state">No prompts yet. Add your first one!</p>}
        {prompts.map((p) => (
          <PromptCard key={p.id} prompt={p} onEdit={setEditing} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
