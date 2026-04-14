import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import NotesList from "./components/NotesList";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://markdown-notes-backend-4jok.onrender.com"
});

const App = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await api.get("/notes");
        setNotes(response.data);
        if (response.data.length > 0) {
          const firstNote = response.data[0];
          setActiveNoteId(firstNote.id);
          setTitle(firstNote.title || "");
          setContent(firstNote.content || "");
        }
      } catch (error) {
        console.error("Failed to load notes", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        if (activeNoteId === null) {
          if (!title.trim() && !content.trim()) {
            return;
          }
          setIsSaving(true);
          const response = await api.post("/notes", { title, content });
          setNotes((prevNotes) => [response.data, ...prevNotes]);
          setActiveNoteId(response.data.id);
          return;
        }

        if (!activeNote) {
          return;
        }

        if (activeNote.title === title && activeNote.content === content) {
          return;
        }

        setIsSaving(true);
        const response = await api.put(`/notes/${activeNoteId}`, { title, content });
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === activeNoteId ? response.data : note))
        );
      } catch (error) {
        console.error("Failed to save note", error);
      } finally {
        setIsSaving(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [activeNoteId, activeNote, title, content, isLoading]);

  const handleSelectNote = (note) => {
    setActiveNoteId(note.id);
    setTitle(note.title || "");
    setContent(note.content || "");
  };

  const handleCreateNew = () => {
    setActiveNoteId(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prevNotes) => {
        const filteredNotes = prevNotes.filter((note) => note.id !== id);
        if (id === activeNoteId) {
          if (filteredNotes.length > 0) {
            const nextNote = filteredNotes[0];
            setActiveNoteId(nextNote.id);
            setTitle(nextNote.title || "");
            setContent(nextNote.content || "");
          } else {
            setActiveNoteId(null);
            setTitle("");
            setContent("");
          }
        }
        return filteredNotes;
      });
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  return (
    <div className="app-container">
      <NotesList
        notes={notes}
        activeNoteId={activeNoteId}
        onSelect={handleSelectNote}
        onCreateNew={handleCreateNew}
        onDelete={handleDelete}
      />
      <main className="workspace">
        <Editor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
        <Preview content={content} />
      </main>
      <div className="save-indicator">{isSaving ? "Saving..." : "Saved"}</div>
    </div>
  );
};

export default App;
