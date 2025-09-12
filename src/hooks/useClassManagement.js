import { useState, useEffect } from "react";

// Simple class management hook
export const useClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading class data
    const timer = setTimeout(() => {
      const mockClasses = [
        {
          id: 1,
          name: "Mathematics Grade 5",
          subject: "Mathematics",
          grade: 5,
          studentCount: 24,
          schedule: "Mon, Wed, Fri 10:00 AM",
          progress: 78,
        },
        {
          id: 2,
          name: "Science Grade 4",
          subject: "Science",
          grade: 4,
          studentCount: 18,
          schedule: "Tue, Thu 2:00 PM",
          progress: 65,
        },
        {
          id: 3,
          name: "Reading Comprehension",
          subject: "English",
          grade: 3,
          studentCount: 15,
          schedule: "Daily 9:00 AM",
          progress: 82,
        },
      ];

      const mockStudents = [
        {
          id: 1,
          name: "Sarah Johnson",
          grade: 5,
          classId: 1,
          progress: 85,
          lastActive: new Date(Date.now() - 1000 * 60 * 30),
          status: "active",
        },
        {
          id: 2,
          name: "Tom Wilson",
          grade: 4,
          classId: 2,
          progress: 72,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: "active",
        },
        {
          id: 3,
          name: "Emma Davis",
          grade: 3,
          classId: 3,
          progress: 91,
          lastActive: new Date(Date.now() - 1000 * 60 * 15),
          status: "active",
        },
      ];

      setClasses(mockClasses);
      setStudents(mockStudents);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getStudentsByClass = (classId) => {
    return students.filter((student) => student.classId === classId);
  };

  const getClassById = (classId) => {
    return classes.find((cls) => cls.id === classId);
  };

  const updateStudentProgress = (studentId, progress) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, progress } : student)),
    );
  };

  const addClass = (newClass) => {
    const classWithId = {
      id: Date.now(),
      studentCount: 0,
      progress: 0,
      ...newClass,
    };
    setClasses((prev) => [...prev, classWithId]);
  };

  const addStudent = (newStudent) => {
    const studentWithId = {
      id: Date.now(),
      progress: 0,
      lastActive: new Date(),
      status: "active",
      ...newStudent,
    };
    setStudents((prev) => [...prev, studentWithId]);

    // Update class student count
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === newStudent.classId ? { ...cls, studentCount: cls.studentCount + 1 } : cls,
      ),
    );
  };

  return {
    classes,
    students,
    loading,
    getStudentsByClass,
    getClassById,
    updateStudentProgress,
    addClass,
    addStudent,
  };
};

export default useClassManagement;
