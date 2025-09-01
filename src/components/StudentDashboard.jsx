import React from 'react';
import StudyMaterials from './StudyMaterials';
import AssignmentSubmission from './AssignmentSubmission';
import LiveSessions from './LiveSessions';
import QnAForum from './QnAForum';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard p-6">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <StudyMaterials />
      <AssignmentSubmission />
      <LiveSessions />
      <QnAForum />
    </div>
  );
};

export default StudentDashboard;
