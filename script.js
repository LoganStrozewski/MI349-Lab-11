const game = document.querySelector("#game");
let questions = [];
let questionIndex = 0;

function decodeHtml(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

async function loadQuestions() {
  game.textContent = "Loading questions...";
  const response = await fetch("https://opentdb.com/api.php?amount=10&category=23");
  const data = await response.json();
  questions = data.results;
  showQuestion();
}

function showQuestion() {
  const currentQuestion = questions[questionIndex];
  const heading = document.createElement("h2");
  heading.textContent = decodeHtml(currentQuestion.question);
  const count = document.createElement("p");
  count.textContent = `Question ${questionIndex + 1} of ${questions.length}`;

  game.replaceChildren();
  game.append(count, heading);

  const answers = currentQuestion.incorrect_answers.slice();
  answers.push(currentQuestion.correct_answer);

  // AI assisted answer shuffling start
  for (let i = answers.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = answers[i];
    answers[i] = answers[randomIndex];
    answers[randomIndex] = temp;
  }
  // AI assisted answer shuffling end
  
  for (const answer of answers) {
    const button = document.createElement("button");
    button.textContent = decodeHtml(answer);
    button.addEventListener("click", () => checkAnswer(answer, currentQuestion.correct_answer));
    game.append(button);
  }
}

function checkAnswer(answer, correctAnswer) {
  document.querySelectorAll("#game button").forEach((button) => {
    button.disabled = true;
  });

  // AI-assisted screen-flash code start
  if (answer !== correctAnswer) {
    const flashScreen = document.createElement("div");
    flashScreen.className = "flash-screen";
    flashScreen.textContent = `Wrong! The correct answer was: ${decodeHtml(correctAnswer)}`;
    document.body.append(flashScreen);

    setTimeout(() => {
      flashScreen.remove();
      questionIndex = 0;
      loadQuestions();
    }, 1000);
    return;
  }

  document.body.classList.add("flash-correct");
  questionIndex += 1;
  setTimeout(() => {
    document.body.classList.remove("flash-correct");
    if (questionIndex === questions.length) {
      const heading = document.createElement("h2");
      heading.textContent = "You win!";
      const result = document.createElement("p");
      result.textContent = "You answered all 10 questions correctly.";
      game.replaceChildren(heading, result);
    } else {
      showQuestion();
    }
  }, 1000);
  // AI-assisted screen-flash code end
}

loadQuestions();
