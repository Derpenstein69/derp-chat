import React from "react";

export function EmbeddedSurvey(): JSX.Element {
  return (
    <div className="embedded-survey">
      <iframe
        src="https://example.com/survey"
        title="Embedded Survey"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
