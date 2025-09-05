import * as React from "react";

type _Props = {};

export default function CurriculumBuilder() {
  // Minimal interactive stub for the curriculum builder UI.
  return (
    <div>
      <h2>Curriculum Builder</h2>
      <div>
        <label>
          Subject
          <select>
            <option>Life Skills</option>
            <option>Employment Skills</option>
            <option>Digital Literacy</option>
          </select>
        </label>
      </div>
      <div>
        <button type="button">Auto-generate Module</button>
      </div>
    </div>
  );
}
