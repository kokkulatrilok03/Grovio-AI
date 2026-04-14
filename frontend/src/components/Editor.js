import React from "react";

const Editor = ({ title, content, onTitleChange, onContentChange }) => (
  <section className="panel editor-panel">
    <h2>Editor</h2>
    <input
      className="title-input"
      type="text"
      placeholder="Note title"
      value={title}
      onChange={(event) => onTitleChange(event.target.value)}
    />
    <textarea
      className="content-input"
      placeholder="Write markdown content..."
      value={content}
      onChange={(event) => onContentChange(event.target.value)}
    />
  </section>
);

export default Editor;
