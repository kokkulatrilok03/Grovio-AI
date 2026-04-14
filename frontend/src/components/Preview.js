import React from "react";
import ReactMarkdown from "react-markdown";

const Preview = ({ content }) => (
  <section className="panel preview-panel">
    <h2>Preview</h2>
    <div className="markdown-body">
      <ReactMarkdown>{content || "Start typing markdown to preview..."}</ReactMarkdown>
    </div>
  </section>
);

export default Preview;
