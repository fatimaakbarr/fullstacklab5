// studentUtils.js - reusable helpers for the student portal (Task 2)

// Named export: constant
export const DEPARTMENT_NAME = "Computer Science";

// Named export: rest parameter
export function calculateTotal(...marks) {
  return marks.reduce((runningSum, mark) => runningSum + mark, 0);
}

// Named export: arrow function
export const calculateAverage = (...marks) =>
  calculateTotal(...marks) / marks.length;

// Named export: grade scale 80-100 A, 70-79 B, 60-69 C, 50-59 D, below 50 F
export function getGrade(marks) {
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "F";
}

// Named export: arrow function + ternary
export const getStatus = (marks) => (marks >= 50 ? "Pass" : "Fail");

// Default export: template literal
export default function formatStudentResult(name, rollNumber, total) {
  return `${name} - ${rollNumber} - Total: ${total}`;
}