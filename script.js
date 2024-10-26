const cards = document.querySelectorAll(".card");
const movesElement = document.getElementById("moves");
const matchedElement = document.getElementById("matched");
const body = document.body;
let matched = 0;
let cardOne,
  cardTwo = "";
let disableDeck = false;
let moves = 0;

// this matchCard function responsible for finding the matched cards and adding effects to shake and flipcard back to original state if not matched
function matchCard(cardOneImg, cardTwoImg) {
  if (cardOneImg === cardTwoImg) {
    matched++; //matched is increased by 1
    matchedElement.textContent = "Matched: " + matched;
    if (matched === 6) {
      //if matched is 6 then all cards are matched
      stopTimer();
      setTimeout(() => {
        let div = document.createElement("div");
        div.id = "result-board";
        body.appendChild(div);
        div.innerHTML = `
          <span>
            <h1>Player</h1>
            <p>You Nailed it</p>
            <div id="scores">
            <h4>Moves Used :${moves}</h4>
            <h4>Matched :${matched}</h4>
          </div>
            <button id="close-result">Close</button>
          </span>`;
        // close result board feature
        resultBoardClose();
      }, 1200);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  } else if (cardOne !== cardTwo) {
    //if cards are not matched flip back to original state
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      // if not matched added back to listens for click event again
      cardOne.addEventListener("click", flipCard);
      cardTwo.addEventListener("click", flipCard);
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1200);
  }
}

function flipCard(e) {
  if (time === 0) {
    //if time is 0 then start timer to count how much time is taken to match all cards
    startTimer();
  }

  let clickedCard = e.target.parentElement;
  if (cardOne !== clickedCard && !disableDeck) {
    //if card is not clicked then flip card and add class flip to card
    moves++; //moves is increased by 1
    movesElement.innerText = "Moves used: " + moves;
    clickedCard.classList.add("flip");
    if (!cardOne) {
      // i remove click event when clicked card and add back again validation in matchCard function
      // this will prevent from adding multiple click event to same card
      clickedCard.removeEventListener("click", flipCard);
      //if card is not clicked then flip card and add class flip to card
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".card-back img").src,
      cardTwoImg = cardTwo.querySelector(".card-back img").src;
    matchCard(cardOneImg, cardTwoImg);
  }
}

//time function to measure how much time is taken to match all cards
let time = 0;
let setIntervalTime = null; // Initialize as null
let timer = document.getElementById("timer");
function startTimer() {
  // Only start if no interval is running
  if (setIntervalTime === null) {
    setIntervalTime = setInterval(function () {
      time++;
      timer.innerText = "Time: " + time + "S";
    }, 1000);
  }
}
// stop timer function
function stopTimer() {
  clearInterval(setIntervalTime);
  setIntervalTime = null; // Reset to null after clearing
}

// shuffle cards function responsible for shuffling the cards on the load of the page and reset timing
function shuffleCards() {
  array = generateRandomNumbers();
  cards.forEach((card, index) => {
    img = card.children[1].children[0];
    img.src = "./image/img" + array[index] + ".png";
  });
}
// this will shuffle the cards on the load of the page
shuffleCards();

// random generate numbers function
function generateRandomNumbers() {
  const arrayNumbers = [];
  while (arrayNumbers.length < 12) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    if (arrayNumbers.filter((num) => num === randomNumber).length < 2) {
      arrayNumbers.push(randomNumber);
    }
  }
  return arrayNumbers;
}

// reset cards function
function resetGame() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  moves = 0;
  time = 0;
  timer.innerHTML = "Time: " + time + "<span>S</span>";
  matchedElement.textContent = "Matched: " + matched;
  movesElement.innerText = "Moves used: " + moves;
  stopTimer();
  cards.forEach((card) => {
    card.classList.remove("flip");
    card.addEventListener("click", flipCard);
  });
  shuffleCards();
}

// restart-btn to shuffle cards
const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to restart the game?")) {
    resetGame();
  }
});
// shuffle cards on page load

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

function resultBoardClose() {
  const closeresult = document.getElementById("close-result");
  const resultboard = document.getElementById("result-board");
  closeresult.addEventListener("click", () => {
    resultboard.style.display = "none";
  });
}
