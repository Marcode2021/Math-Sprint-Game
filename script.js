// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
const wrongBtn = document.querySelector(".wrong");
const rightBtn = document.querySelector(".right");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
// let countdownNumber = 3;
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0;

// Stop Timer, proccess results, go to Score Page
const checkTime = function () {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log("Player guess array", playerGuessArray);
    clearInterval(timer);
    // Check for wrong guesses, add penalty time
    equationsArray.forEach((eqution, index) => {
      if (eqution.evaluated === playerGuessArray[index]) {
        // Correct guess, no penalty
      } else {
        // Incorrect Guess, add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log(
      "time",
      timePlayed,
      "penalty",
      penaltyTime,
      "final time",
      finalTime
    );
  }
};

// Add a tenth of a second to timePlayed
const addTime = function () {
  timePlayed += 0.1;
  checkTime();
};

// Start timer when game page is clicked
const startTimer = function () {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
};

// Scroll and Store user selection in playerGuessArray
const select = function (isGuessed) {
  valueY += 98;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return isGuessed
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
};

// Get Random Number up to a max number
const getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log("correct equations:", correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log("wrong equations:", wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add equations to DOM
const equationsToDOM = function () {
  equationsArray.forEach((equation) => {
    const item = `
    <div class="item">
      <h1>${equation.value}</h1>
    </div>;
    `;
    itemContainer.insertAdjacentHTML("beforeend", item);
  });
};

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");

  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append

  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

const changeToGamePage = function () {
  countdownPage.hidden = true;
  gamePage.hidden = false;
};

// Display 3,2,1 , GO!
const countdownStart = function () {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!";
  }, 3000);

  // const counting = setInterval(() => {
  //   countdownNumber--;
  //   countdown.textContent = countdownNumber;
  //   if (countdownNumber === 0) {
  //     countdown.textContent = "Go!";
  //   }
  // }, 1000);
  // setTimeout(() => {
  //   clearInterval(counting);
  // }, 3000);
};

// Navigate from Splash Page to Countdown Page
const showCountdown = function () {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(changeToGamePage, 500);
};

// Get the value from selected radio button
const getRadioValue = function () {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
};

// Form that decides amount of questions
const selectQuestionAmount = function (e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  questionAmount ? showCountdown() : "";
};

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove selected label styling
    radioEl.classList.remove("selected-label");
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);

wrongBtn.addEventListener("click", () => {
  select(false);
});
rightBtn.addEventListener("click", () => {
  select(true);
});
gamePage.addEventListener("click", startTimer);
