import React from "react";

const NotesList = ({ notes, activeNoteId, onSelect, onCreateNew, onDelete }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <h2>Notes</h2>
      <button className="primary-btn" onClick={onCreateNew} type="button">
        New
      </button>
    </div>
    <div className="notes-scroll">
      {notes.length === 0 ? (
        <p className="empty-text">No notes yet</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`note-item ${activeNoteId === note.id ? "active" : ""}`}
            onClick={() => onSelect(note)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSelect(note);
              }
            }}
          >
            <div className="note-title">{note.title || "Untitled"}</div>
            <button
              className="danger-btn"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  </aside>
);

export default NotesList;
