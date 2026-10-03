// lab05.js - loaded with type="module"
import formatStudentResult, {
  DEPARTMENT_NAME,
  calculateTotal,
  calculateAverage as computeAverage, // aliased import (Task 2, step 2)
  getGrade,
  getStatus,
} from "./studentUtils.js";
import { renderCard, appendLine, clearOutput } from "./ui.js";

/* =====================================================================
   TASK 1 - University Course Enrollment Manager
   ===================================================================== */

const coreCourses = ["Operating Systems", "Computer Architecture", "Discrete Mathematics"];
const electiveCourses = ["Machine Learning", "Mobile App Development", "Cyber Security"];
const enrolledStudent = {
  name: "Zainab",
  rollNumber: "BSCS-045",
  department: "Computer Science",
  semester: 6,
};
const cgpaHistory = [3.8, 3.25, 2.9, 3.5, 3.1];

// 1. Merge with spread
const allCourses = [...coreCourses, ...electiveCourses];

// 2. Copy with spread, add to the copy only
const coursesWithExtra = [...allCourses, "DevOps Basics"];

// 3. Updated object with spread
const promotedStudent = { ...enrolledStudent, semester: 7, cgpa: 3.45 };

// 4. Rest parameter
function enrollStudent(name, ...courses) {
  return `${name} enrolled in ${courses.length} course(s): ${courses.join(", ")}`;
}

// 5. Arrow function + rest parameter
const calculateAverageCGPA = (...cgpas) =>
  (cgpas.reduce((sum, value) => sum + value, 0) / cgpas.length).toFixed(2);

// 6. Math.max with spread
const highestCGPA = Math.max(...cgpaHistory);

// 7. Default parameter
function getStudentInfo(name, department = "Computer Science") {
  return `${name} - Department: ${department}`;
}

// 8 + 9. Template literals inside a Bootstrap card
renderCard("task1-output", "Course Enrollment Summary", [
  `Core Courses: ${coreCourses.join(", ")}`,
  `Elective Courses: ${electiveCourses.join(", ")}`,
  `All Courses (${allCourses.length}): ${allCourses.join(", ")}`,
  `Copy after adding a course (${coursesWithExtra.length}): ${coursesWithExtra.join(", ")}`,
  `Original still has ${allCourses.length} courses`,
  `Original Student: ${enrolledStudent.name}, Semester ${enrolledStudent.semester}`,
  `Updated Student: ${promotedStudent.name}, Semester ${promotedStudent.semester}, CGPA ${promotedStudent.cgpa}`,
  enrollStudent(enrolledStudent.name, "Operating Systems", "Machine Learning", "Cyber Security"),
  `Average CGPA: ${calculateAverageCGPA(...cgpaHistory)}`,
  `Highest CGPA: ${highestCGPA}`,
  `${getStudentInfo(enrolledStudent.name)} (default)`,
  getStudentInfo("Bilal", "Software Engineering"),
]);

/* =====================================================================
   TASK 2 - Student Utility Module (imports at the top of this file)
   ===================================================================== */

const studentRecords = [
  { name: "Hira", rollNumber: "BSCS-023", assignment: 28, midterm: 26, finalExam: 28 },
  { name: "Bilal", rollNumber: "BSCS-002", assignment: 20, midterm: 22, finalExam: 25 },
  { name: "Mahnoor", rollNumber: "BSCS-014", assignment: 15, midterm: 13, finalExam: 20 },
  { name: "Usman", rollNumber: "BSCS-031", assignment: 24, midterm: 25, finalExam: 26 },
];

document.getElementById("department-name").textContent = `Department: ${DEPARTMENT_NAME}`;

// forEach + object destructuring in the callback parameter
studentRecords.forEach(({ name, rollNumber, assignment, midterm, finalExam }) => {
  const total = calculateTotal(assignment, midterm, finalExam);
  const average = computeAverage(assignment, midterm, finalExam).toFixed(2);
  const grade = getGrade(total);
  const status = getStatus(total);

  renderCard(
    "task2-output",
    formatStudentResult(name, rollNumber, total),
    [`Average: ${average}`, `Grade: ${grade}`, `Status: ${status}`],
    status === "Pass" ? "border-success" : "border-danger"
  );
});

/* =====================================================================
   TASK 3 - Online Examination Workflow (callbacks)
   ===================================================================== */

const EXAM_OUTPUT = "task3-output";

// Part B version: error-first callback callback(error, data)
function verifyStudent(roll, callback) {
  setTimeout(() => {
    if (!roll || roll.trim() === "") {
      callback("Roll number is required", null);
      return;
    }
    callback(null, `Student ${roll} verified`);
  }, 1000);
}

function loadExamPaper(callback) {
  setTimeout(() => callback("Exam paper loaded"), 1500);
}

function submitAnswers(callback) {
  setTimeout(() => callback("Answers submitted"), 2000);
}

function generateResult(callback) {
  setTimeout(() => callback("Result generated: 82 marks"), 1000);
}

function setExamButtonsDisabled(isDisabled) {
  document.getElementById("run-valid").disabled = isDisabled;
  document.getElementById("run-empty").disabled = isDisabled;
}

function runExamWorkflow(rollNumber) {
  clearOutput(EXAM_OUTPUT);
  setExamButtonsDisabled(true); // stop overlapping runs mixing their output

  const startTime = Date.now();
  const elapsed = () => `(after ${((Date.now() - startTime) / 1000).toFixed(1)} seconds)`;

  // Printed immediately, before any setTimeout fires -> proves async behaviour
  appendLine(EXAM_OUTPUT, "Exam workflow started...");

  // Why "callback hell": every step lives INSIDE the previous step's callback,
  // so each new step pushes the code one level deeper (the "pyramid of doom"),
  // making it hard to read, handle errors in, and maintain.
  verifyStudent(rollNumber, (error, verifiedMessage) => {
    if (error) {
      appendLine(EXAM_OUTPUT, `Error: ${error}`, "text-danger fw-bold");
      setExamButtonsDisabled(false);
      return; // remaining steps never run
    }
    appendLine(EXAM_OUTPUT, `Step 1: ${verifiedMessage} ${elapsed()}`);

    loadExamPaper((paperMessage) => {
      appendLine(EXAM_OUTPUT, `Step 2: ${paperMessage} ${elapsed()}`);

      submitAnswers((submitMessage) => {
        appendLine(EXAM_OUTPUT, `Step 3: ${submitMessage} ${elapsed()}`);

        generateResult((resultMessage) => {
          appendLine(EXAM_OUTPUT, `Step 4: ${resultMessage} ${elapsed()}`);
          appendLine(EXAM_OUTPUT, "Exam completed successfully!", "text-success fw-bold");
          setExamButtonsDisabled(false);
        });
      });
    });
  });
}

document.getElementById("run-valid").addEventListener("click", () => runExamWorkflow("BSCS-001"));
document.getElementById("run-empty").addEventListener("click", () => runExamWorkflow(""));

/* =====================================================================
   TASK 4 - University Result Portal (promises, async/await, Promise.all)
   ===================================================================== */

const resultDatabase = [
  { name: "Zainab", rollNumber: "BSCS-001", department: "Computer Science", semester: 6, assignment: 27, midterm: 26, finalExam: 29 },
  { name: "Bilal", rollNumber: "BSCS-002", department: "Computer Science", semester: 6, assignment: 20, midterm: 22, finalExam: 25 },
  { name: "Hira", rollNumber: "BSCS-023", department: "Computer Science", semester: 5, assignment: 28, midterm: 26, finalExam: 28 },
  { name: "Mahnoor", rollNumber: "BSCS-014", department: "Computer Science", semester: 4, assignment: 15, midterm: 13, finalExam: 20 },
  { name: "Usman", rollNumber: "BSCS-031", department: "Computer Science", semester: 6, assignment: 24, midterm: 25, finalExam: 26 },
];

// Promise: resolves with the student after 1s, or rejects
function findStudent(rollNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = resultDatabase.find((record) => record.rollNumber === rollNumber);
      if (match) {
        resolve(match);
      } else {
        reject("Student not found");
      }
    }, 1000);
  });
}

// Promise: resolves with { total, average, grade, status } after 1s
function calculateResult(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { assignment, midterm, finalExam } = student; // destructuring
      const marks = [assignment, midterm, finalExam];

      if (marks.some((mark) => typeof mark !== "number" || Number.isNaN(mark))) {
        reject("Invalid marks");
        return;
      }

      const total = calculateTotal(...marks); // spread into rest parameter
      resolve({
        total,
        average: total / marks.length,
        grade: getGrade(total),
        status: getStatus(total), // arrow function + ternary from the module
      });
    }, 1000);
  });
}

function renderStudentResult(targetId, student, result) {
  const { name, rollNumber, department, semester } = student;
  const { total, average, grade, status } = result;

  renderCard(
    targetId,
    `Student: ${name}`,
    [
      `Roll No: ${rollNumber}`,
      `Department: ${department}`,
      `Semester: ${semester}`,
      `Total: ${total}`,
      `Average: ${average.toFixed(2)}`,
      `Grade: ${grade}`,
      `Status: ${status}`,
    ],
    status === "Pass" ? "border-success" : "border-danger"
  );
}

// ---- Part A: promise chain with then / catch / finally ----
const CHAIN_OUTPUT = "task4-chain-output";

function searchWithChain(rollNumber) {
  clearOutput(CHAIN_OUTPUT);
  appendLine(CHAIN_OUTPUT, "Searching...");

  return findStudent(rollNumber)
    .then((student) =>
      calculateResult(student).then((result) =>
        renderStudentResult(CHAIN_OUTPUT, student, result)
      )
    )
    .catch((error) => appendLine(CHAIN_OUTPUT, `Error: ${error}`, "text-danger fw-bold"))
    .finally(() => appendLine(CHAIN_OUTPUT, "Search completed"));
}

// ---- Part B: async/await version ----
const PORTAL_OUTPUT = "task4-output";

async function showResult(rollNumber) {
  clearOutput(PORTAL_OUTPUT);
  appendLine(PORTAL_OUTPUT, "Searching...");

  try {
    const student = await findStudent(rollNumber);
    const result = await calculateResult(student);
    renderStudentResult(PORTAL_OUTPUT, student, result);
  } catch (error) {
    appendLine(PORTAL_OUTPUT, `Error: ${error}`, "text-danger fw-bold");
  } finally {
    appendLine(PORTAL_OUTPUT, "Search completed");
  }
}

// ---- Part D: Promise.all + map ----
async function loadAllResults() {
  clearOutput(PORTAL_OUTPUT);
  appendLine(PORTAL_OUTPUT, "Loading all results...");

  try {
    // All five calculations start together, so this takes ~1s, not ~5s
    const allResults = await Promise.all(
      resultDatabase.map((record) => calculateResult(record))
    );

    clearOutput(PORTAL_OUTPUT);

    allResults.forEach((result, index) => {
      const { name, rollNumber } = resultDatabase[index];
      const { grade, status } = result;
      renderCard(
        PORTAL_OUTPUT,
        `Student: ${name}`,
        [`Roll No: ${rollNumber} | Grade: ${grade} | Status: ${status}`],
        status === "Pass" ? "border-success" : "border-danger"
      );
    });

    const passedCount = allResults.filter(({ status }) => status === "Pass").length;
    const failedCount = allResults.length - passedCount;

    renderCard(PORTAL_OUTPUT, "Final Statistics", [
      `Total Students: ${allResults.length}`,
      `Passed Students: ${passedCount}`,
      `Failed Students: ${failedCount}`,
    ]);
  } catch (error) {
    appendLine(PORTAL_OUTPUT, `Error: ${error}`, "text-danger fw-bold");
  }
}

// ---- Part C: search form + buttons ----
const searchButton = document.getElementById("search-btn");
const loadAllButton = document.getElementById("load-all-btn");
const rollInput = document.getElementById("roll-input");
const chainButton = document.getElementById("chain-btn");

function setPortalButtonsDisabled(isDisabled) {
  searchButton.disabled = isDisabled;
  loadAllButton.disabled = isDisabled;
}

searchButton.addEventListener("click", async () => {
  setPortalButtonsDisabled(true);
  await showResult(rollInput.value.trim().toUpperCase());
  setPortalButtonsDisabled(false);
});

loadAllButton.addEventListener("click", async () => {
  setPortalButtonsDisabled(true);
  await loadAllResults();
  setPortalButtonsDisabled(false);
});

chainButton.addEventListener("click", () => {
  chainButton.disabled = true;
  searchWithChain("BSCS-001").finally(() => {
    chainButton.disabled = false;
  });
});