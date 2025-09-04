import React from "react";

type Props = {};

export default function CurriculumBuilder(_props: Props) {
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
        <button>Auto-generate Module</button>
      </div>
    </div>
  );
}
