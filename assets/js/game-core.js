/*=========================
      Declear vars
=========================*/

var cardsContainer = document.getElementById("cards-container"),
  startGameBtn = document.getElementById("start-game"),
  newGameBtn = document.getElementById("new-game"),
  playerTime = document.getElementById("player-time"),
  totalPlayerScore = document.getElementById("total-player-score"),
  totalplayerTime = document.getElementById("total-player-time"),
  playerScore = document.getElementById("player-score"),
  questionHead = document.getElementById("question"),
  submitButton = document.getElementById("submit-answer"),
  // playAgainBtn = document.getElementById("play-again-btn"),
  // closeScorePopUp = document.getElementById("close-btn"),
  option_1 = document.getElementById("option-1"),
  option_2 = document.getElementById("option-2"),
  option_3 = document.getElementById("option-3"),
  option_4 = document.getElementById("option-4"),
  getRadios = document.querySelectorAll(".question-option input"),
  getLabel = document.querySelectorAll(".question-option label"),
  cardsArray = [],
  totalCardsNumber = cardsContainer.childElementCount,
  matchedCardsNumber,
  card,
  cardId,
  flippedCard,
  previousCardId = 0,
  tempCardId,
  gameTries = 0,
  myTimeInverval,
  endGameTime,
  totalGameTime,
  activeGame = false,
  score = 0,
  scoreIncreaseValue = 100,
  startGameTime = 4 * 60,
  FlippingCardSpeed = 500,
  activeGameTime;

/*=========================
    Define functions
=========================*/

// Start timer or restart it

activeGameTime = startGameTime;

function gameTimeCalc() {
  if (myTimeInverval) {
    // clear first then create a new intreval
    clearInterval(myTimeInverval);

    myTimeInverval = setInterval(function () {
      activeGameTime--;
      playerTime.innerHTML = toHHMMSS(activeGameTime);
    }, 1000);
  } else {
    // Create a new intreval
    myTimeInverval = setInterval(function () {
      activeGameTime--;
      playerTime.innerHTML = toHHMMSS(activeGameTime);

      // Game over - Time out
      if (activeGameTime == 0) {
        clearInterval(myTimeInverval);
        gameOver();
      }
    }, 1000);
  }
}

// // // Start timer or restart it
// function gameTimeCalc() {
//   activeGameTime = 0;
//   if (myTimeInverval) {
//     // clear first then create a new intreval
//     clearInterval(myTimeInverval);

//     myTimeInverval = setInterval(function () {
//       activeGameTime++;
//       playerTime.innerHTML = timeFromateConverter(activeGameTime);
//     }, 1000);
//   } else {
//     // Create a new intreval
//     myTimeInverval = setInterval(function () {
//       activeGameTime++;
//       playerTime.innerHTML = timeFromateConverter(activeGameTime);
//     }, 1000);
//   }
// }

// Time formatter in 00:00
// function timeFromateConverter(t) {
//   var sec_num = parseInt(t, 10),
//     hours = Math.floor(sec_num / 3600),
//     minutes = Math.floor((sec_num - hours * 3600) / 60),
//     seconds = sec_num - hours * 3600 - minutes * 60,
//     formattedTime;

//   if (hours < 10) {
//     hours = "0" + hours;
//   }
//   if (minutes < 10) {
//     minutes = "0" + minutes;
//   }
//   if (seconds < 10) {
//     seconds = "0" + seconds;
//   }

//   formattedTime = minutes + ":" + seconds;
//   return formattedTime;
// }

// Randomize cards array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Shuffle cards
function randomCardsLoading(x) {
  for (i = 0; i < x.childElementCount; i++) {
    cardsArray[i] = x.children[i].outerHTML;
    if (i === x.childElementCount - 1) {
      x.innerHTML = "";
    }
  }

  shuffleArray(cardsArray);
  for (i = 0; i < cardsArray.length; i++) {
    x.innerHTML = x.innerHTML + cardsArray[i];
  }
}

// Case of Matched cards
function matchedCards(x) {
  matchedCardsNumber = matchedCardsNumber + 1;

  matchAudio();
  popUpMatchMessage();

  $(`#card-${x}`).addClass("matched-card");
  $(`#card-${x % 2 !== 0 ? x + 1 : x - 1}`).addClass("matched-card");

  // popUpQuestion(matchedCardsNumber);
  modifyScore();

  if (matchedCardsNumber == totalCardsNumber / 2) {
    gameEnded();
  }
}

/* ======== START GAME ============*/

$("#start-page")
  .fadeIn("slow", function () {})
  .css("display", "flex");

startGameBtn.onclick = function () {
  tickAudio();
  startGameAudio();

  // Start game
  activeGame = true;

  //Clear previous score
  score = 0;
  playerScore.innerHTML = score;

  // Track new game time
  gameTimeCalc();
  activeGameTime = startGameTime;

  //Randmized cards
  randomCardsLoading(cardsContainer);

  // Clear any previous matched cards
  matchedCardsNumber = 0;

  // Start checking new matches
  checkCardMatching();

  // Clear questions
  questionHead.innerHTML = questions[1].question;
  option_1.nextElementSibling.innerHTML = questions[1].option_1;
  option_2.nextElementSibling.innerHTML = questions[1].option_2;
  option_3.nextElementSibling.innerHTML = questions[1].option_3;
  option_4.nextElementSibling.innerHTML = questions[1].option_4;

  // Clear all active and matched classes
  for (i = 0; i < totalCardsNumber; i++) {
    // document
    //   .querySelectorAll(".card")
    //   [i].classList.remove("activated-card", "matched-card");
  }

  // Flip card
  $(".flip-card-inner").click(function () {
    $(this).css("transform", "rotateY(180deg)");
  });
};

//  Match cards check
function checkCardMatching() {
  // Loop event for each card
  var q = 1;
  document.querySelectorAll(".card").forEach(function (card, index) {
    // Create click event
    card.onclick = function () {
      tickAudio();
      // Get integer ID of card
      cardId = parseInt(card.getAttribute("id").slice(5));

      // check if there are 2 continous clicks
      if (q % 2 == 0) {
        // Check porint
        if (cardId % 2 != 0) {
          tempCardId = previousCardId - 1;
          if (tempCardId == cardId) {
            matchedCards(cardId);
          } else {
            $(".card").css("pointer-events", "none");

            setTimeout(function () {
              $("#card-" + cardId).css("transform", "rotateY(0deg)");
              $("#card-" + (tempCardId + 1)).css("transform", "rotateY(0deg)");
              $(".card").css("pointer-events", "auto");
            }, FlippingCardSpeed);
          }
        } else {
          tempCardId = previousCardId + 1;
          if (tempCardId == cardId) {
            matchedCards(cardId);
          } else {
            $(".card").css("pointer-events", "none");

            setTimeout(function () {
              $("#card-" + cardId).css("transform", "rotateY(0deg)");
              $("#card-" + (tempCardId - 1)).css("transform", "rotateY(0deg)");
              $(".card").css("pointer-events", "auto");
            }, FlippingCardSpeed);
          }
        }
      }
      q = q + 1;
      previousCardId = cardId;
    };
  });
}

// Questions prepareation
var questions = [
  (question_1 = {
    question_number: 1,
    question: "All the below are symptoms of Hypothyroidism except,",
    option_1: "Dry Hair",
    option_2: "Hoarse voice",
    option_3: "Bradycardia",
    option_4: "Hirsutism",
    answer: 4,
  }),
  (question_2 = {
    question_number: 2,
    question: "What is lorem ipsum ?",
    option_1: "Dummy text",
    option_2: "Software",
    option_3: "Person",
    option_4: "Device",
    answer: 1,
  }),
  (question_3 = {
    question_number: 3,
    question: "What is Android ?",
    option_1: "Celeberty",
    option_2: "Mobile software",
    option_3: "car",
    option_4: "city",
    answer: 2,
  }),
  (question_4 = {
    question_number: 3,
    question: "How meny days a week?",
    option_1: "1",
    option_2: "10",
    option_3: "7",
    option_4: "2",
    answer: 3,
  }),
  (question_5 = {
    question_number: 3,
    question: "What is sea color?",
    option_1: "Blue",
    option_2: "Red",
    option_3: "Vilote",
    option_4: "Grey",
    answer: 1,
  }),
  (question_6 = {
    question_number: 6,
    question: "What is devloper name ?",
    option_1: "Ali",
    option_2: "Mohamed",
    option_3: "Mahmoud",
    option_4: "Amr",
    answer: 2,
  }),
  (question_7 = {
    question_number: 7,
    question: "What is devloper name ?",
    option_1: "Ali",
    option_2: "Mohamed",
    option_3: "Mahmoud",
    option_4: "Amr",
    answer: 2,
  }),
  (question_8 = {
    question_number: 8,
    question: "What is devloper name ?",
    option_1: "Ali",
    option_2: "Mohamed",
    option_3: "Mahmoud",
    option_4: "Amr",
    answer: 2,
  }),
  (question_9 = {
    question_number: 9,
    question: "What is devloper name ?",
    option_1: "Ali",
    option_2: "Mohamed",
    option_3: "Mahmoud",
    option_4: "Amr",
    answer: 2,
  }),
  (question_10 = {
    question_number: 10,
    question: "What is devloper name ?",
    option_1: "Ali",
    option_2: "Mohamed",
    option_3: "Mahmoud",
    option_4: "Amr",
    answer: 2,
  }),
];

shuffleArray(questions);

// Get selected radio button value
var checkedRadio;
for (i = 0; i < getRadios.length; i++) {
  getRadios[i].onchange = function () {
    if (this.checked) {
      checkedRadio = parseInt(this.getAttribute("id").slice(7));
    }
  };
}

// Reset radio buttons
function resetRadios() {
  $('input[type="radio"]').next("label").removeClass("checked");
  for (i = 0; i < getRadios.length; i++) {
    getRadios[i].checked = false;
  }
}

// Pop up congrats mesage on match
function popUpMatchMessage() {
  $("#match-popup").fadeIn("slow", function () {
    setTimeout(function () {
      $("#match-popup").fadeOut("slow", function () {});
    }, 1000);
  });
}

// Send questions to the front-end
function popUpQuestion(x) {
  // Pop up question page after match message

  $("#time-out, #start-page, #game-ended").animate({ opacity: "0" }, 600);
  setTimeout(function () {
    $("#question-popup").fadeIn("slow", function () {});
  }, 1200);

  // Send questions to the front-end (Check first id there is a question)
  if (questions[x - 1]) {
    questionHead.innerHTML = questions[x - 1].question;
    option_1.nextElementSibling.innerHTML = "A. " + questions[x - 1].option_1;
    option_2.nextElementSibling.innerHTML = "B. " + questions[x - 1].option_2;
    option_3.nextElementSibling.innerHTML = "C. " + questions[x - 1].option_3;
    option_4.nextElementSibling.innerHTML = "D. " + questions[x - 1].option_4;
  }

  // Enable all radio buttons
  getRadios.forEach(function (item_2, index_2) {
    item_2.disabled = false;
  });

  // Click event when submitting answer
  submitButton.onclick = function () {
    tickAudio();
    if (questions[x - 1].answer == checkedRadio) {
      //  Correct !;
      CorrectAudio();
      resetRadios();
      score = score + scoreIncreaseValue;
      playerScore.innerHTML = score;

      $("#question-popup").fadeOut("slow", function () {});
    } else {
      wrongAudio();
      resetRadios();
      $("#question-popup").fadeOut("slow", function () {});
    }

    // Disable all radio buttons
    getRadios.forEach(function (item_2, index_2) {
      item_2.disabled = true;
    });

    $("#time-out, #start-page, #game-ended").animate({ opacity: "1" }, 600);
  };
}

// modify score when match
function modifyScore() {
  score = score + scoreIncreaseValue;
  playerScore.innerHTML = score;
}

$(".play-again").click(function () {
  location.reload();
});

// $(".leader-board").click(function () {
//   // Hide all pages
//   $(
//     "#time-out, #match-popup, #question-popup , #game-page, #start-page, #game-ended"
//   ).fadeOut("slow", function () {
//     setTimeout(function () {
//       // Show leader board page
//       $("#leader-board-page").fadeIn("slow", function () { });

//       // Show score

//       totalPlayerScore.innerHTML = score;
//       totalplayerTime.innerHTML = (startGameTime - activeGameTime);

//       $("#score-popup").fadeIn("slow", function () { });
//     }, 1000);
//   });
// });

//    Case of Game ended
function gameEnded() {
  // Clear game time
  $("#game-ended").fadeIn("slow", function () {});
  clearInterval(myTimeInverval);
}

//    Case of  game over
function gameOver() {
  // Clear game time
  $("#time-out").fadeIn("slow", function () {});
  clearInterval(myTimeInverval);
}

// Format time
function toHHMMSS(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

function startGameAudio() {
  //Game Sound
  var obj = document.createElement("audio");

  obj.src = "assets/sounds/loop.mp3";
  obj.volume = 0.1;
  obj.id = "start-sound";
  obj.autoPlay = true;
  obj.preLoad = true;
  obj.controls = true;
  obj.loop = true;
  $(obj).get(0).play();
}

function CorrectAudio() {
  //Game Sound
  var obj = document.createElement("audio");

  obj.src = "assets/sounds/correct.mp3";
  obj.volume = 0.5;
  obj.id = "correct-sound";
  obj.autoPlay = true;
  obj.preLoad = true;
  obj.controls = true;
  obj.loop = false;
  $(obj).get(0).play();
}

function wrongAudio() {
  //Game Sound
  var obj = document.createElement("audio");

  obj.src = "assets/sounds/wrong.wav";
  obj.volume = 0.5;
  obj.id = "wrong-sound";
  obj.autoPlay = true;
  obj.preLoad = true;
  obj.controls = true;
  obj.loop = false;
  $(obj).get(0).play();
}

function tickAudio() {
  //Game Sound
  var obj = document.createElement("audio");

  obj.src = "assets/sounds/tick.wav";
  obj.volume = 0.5;
  obj.id = "tick-sound";
  obj.autoPlay = true;
  obj.preLoad = true;
  obj.controls = true;
  obj.loop = false;
  $(obj).get(0).play();
}

function matchAudio() {
  //Game Sound
  var obj = document.createElement("audio");

  obj.src = "assets/sounds/collect-money.wav";
  obj.volume = 0.5;
  obj.id = "collect-money-sound";
  obj.autoPlay = true;
  obj.preLoad = true;
  obj.controls = true;
  obj.loop = false;
  $(obj).get(0).play();
}
