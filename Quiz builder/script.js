let users = JSON.parse(localStorage.getItem("users")) || [];
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let results = JSON.parse(localStorage.getItem("results")) || [];

let questions = [],
  currentQuiz = null,
  currentQuestion = 0;
let obtainedMarks = 0,
  selected = "",
  timerInterval,
  timeLeft = 0;
let currentStudent = null;

function get(id) {
  return document.getElementById(id);
}

function show(id) {
  document.querySelectorAll(".box").forEach((x) => x.classList.add("hide"));
  get(id).classList.remove("hide");
}

function signup() {
  let id = get("studentId").value.trim();
  let name = get("studentName").value.trim();
  let u = get("signUser").value.trim();
  let p = get("signPass").value.trim();

  if (!id || !name || !u || !p) return alert("Fill all details");
  if (users.some((x) => x.studentId === id))
    return alert("Student ID already exists");
  if (users.some((x) => x.username === u))
    return alert("Username already exists");

  users.push({ studentId: id, name: name, username: u, password: p });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  show("studentLoginPage");
}

function login() {
  let u = get("loginUser").value.trim();
  let p = get("loginPass").value.trim();

  if (u === "admin" && p === "admin123") {
    show("adminPage");
    showHistory();
  } else {
    alert("Invalid admin login. Use Student Login for students.");
  }
}

function studentLogin() {
  let u = get("studentLoginUser").value.trim();
  let p = get("studentLoginPass").value.trim();

  if (u === "student" && p === "student123") {
    currentStudent = {
      studentId: "STUDENT",
      name: "Student",
      username: "student",
    };
  } else {
    currentStudent = users.find((x) => x.username === u && x.password === p);

    if (!currentStudent) return alert("Invalid student username or password");
  }

  localStorage.setItem("currentUser", u);
  show("userPage");

  get("writeId").value = currentStudent.studentId;
  get("writeName").value = currentStudent.name;

  loadUserPage();
}

function changeType() {
  let t = get("type").value;

  get("mcqFields").classList.toggle("hide", t !== "mcq");
  get("tfFields").classList.toggle("hide", t !== "tf");
  get("fillFields").classList.toggle("hide", t !== "fill");
}

function addQuestion() {
  let t = get("type").value;
  let q = get("question").value.trim();
  let m = Number(get("marks").value);

  if (!q || m <= 0) return alert("Enter question and marks");

  let obj = { type: t, question: q, marks: m };

  if (t === "mcq") {
    obj.options = [
      get("op1").value.trim(),
      get("op2").value.trim(),
      get("op3").value.trim(),
      get("op4").value.trim(),
    ];

    obj.answer = get("correct").value.trim().toUpperCase();

    if (obj.options.some((x) => !x)) return alert("Enter all options");

    if (!["A", "B", "C", "D"].includes(obj.answer))
      return alert("Answer must be A, B, C or D");
  }

  if (t === "tf") obj.answer = get("tfAnswer").value;

  if (t === "fill") {
    obj.answer = get("fillAnswer").value.trim().toLowerCase();

    if (!obj.answer) return alert("Enter correct answer");
  }

  questions.push(obj);
  displayQuestions();
  clearQuestionFields();
}

function displayQuestions() {
  get("questionList").innerHTML = questions
    .map(
      (x, i) =>
        `<div>${i + 1}. ${x.question} | ${x.type} | ${x.marks} Marks</div>`
    )
    .join("");
}

function clearQuestionFields() {
  [
    "question",
    "marks",
    "op1",
    "op2",
    "op3",
    "op4",
    "correct",
    "fillAnswer",
  ].forEach((id) => (get(id).value = ""));
}

function saveQuiz() {
  let title = get("quizTitle").value.trim();
  let time = Number(get("quizTime").value);

  if (!title || time <= 0 || !questions.length)
    return alert("Enter quiz title, time and questions");

  let total = questions.reduce((s, x) => s + x.marks, 0);

  quizzes.push({
    title: title,
    time: time,
    totalMarks: total,
    questions: questions,
  });

  localStorage.setItem("quizzes", JSON.stringify(quizzes));

  ale