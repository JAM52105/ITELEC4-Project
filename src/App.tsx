import UserCard from "./components/UserCard";
import CourseCard from "./components/CourseCard";
import SubmissionBadge from "./components/SubmissionBadge";
import { Role } from "./types/index";
import type { User, Course, Submission } from "./types/index";

const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: Role.Student,
  isActive: true,
  score: 94,
};

const course: Course = {
  code: "ITELECT4",
  title: "IT Elective 4",
  units: 3,
  semester: "1st Semester 2026-2027",
};

const submission: Submission = {
  id: 1,
  studentId: student.id,
  courseCode: course.code,
  repoUrl: "https://github.com/example/assignment",
  submittedAt: new Date(),
  score: 90,
};

function App() {
  const handleSelect = (user: User) => {
    console.log("Selected user:", user);
  };

  return (
    <div>
      <h1>ITELEC4 React Demo</h1>
      <UserCard user={student} onSelect={handleSelect} />
      <CourseCard course={course} />
      <SubmissionBadge submission={submission}>
        <p>On time!</p>
      </SubmissionBadge>
    </div>
  );
}

export default App;
