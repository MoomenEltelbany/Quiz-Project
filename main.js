// Capturing the elements of HTML
let categoryName = document.querySelector(".category-name");
let startGame = document.querySelector(".start");
let timerSpan = document.querySelector(".timer");
let questionCount = document.querySelector(".quiz-info .q-count");
let spansArea = document.querySelector(".bullets .spans");
let quizAnswers = document.querySelector(".quiz-answers");
let submitBtn = document.querySelector(".submit");
let rightAnswers = document.querySelector(".right-answers");
let totalAnswers = document.querySelector(".total-answers");
let result = document.querySelector(".results .result");
let countDown = document.querySelector(".count-down");
let languagesBtns = document.querySelectorAll(".category div");
let timerBtns = document.querySelectorAll(".level div");

// Setting up auxiliary elements
let indexCount = 0;
let rightAnswersCount = 0;
let countDownInterval;
let languageSelect;

// Adding the active class to the chosen category
languagesBtns.forEach((btn) => {
    btn.onclick = () => {
        languagesBtns.forEach((btn) => {
            btn.classList.remove("active");
        });
        btn.classList.add("active");
        categoryName.innerHTML = btn.innerHTML;
    };
});

// Adding the active class to the chosen timer
timerBtns.forEach((btn) => {
    btn.onclick = () => {
        timerSpan.innerHTML = btn.dataset.timer;
        timerBtns.forEach((btn) => {
            btn.classList.remove("active");
        });
        btn.classList.add("active");
    };
});
// Starting the game by clicking on the start button
startGame.onclick = () => {
    // Remove the button from the page, so that we can't click on it again
    startGame.style.display = "none";

    // Here we pass the parameter to choose which category we will generate the questions
    getsQuestion(categoryName.innerHTML.toLowerCase());
};

// The function that will generate the questions and answers
function getsQuestion(fileName) {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = () => {
        if (myRequest.readyState === 4 && myRequest.status === 200) {
            let questionObject = JSON.parse(myRequest.responseText);
            let questionObjectLength = questionObject.length;
            // Create the question count number and the span bullets
            spanBullets(questionObject);

            // Setting the total Question numbers
            totalAnswers.innerHTML = questionObjectLength;

            // Get the questions and answers
            showQuestions(questionObject[indexCount], questionObjectLength);

            // Initialize the correct answer count
            rightAnswers.innerHTML = rightAnswersCount;

            // Click on the submit button function
            timer(+timerSpan.innerHTML, questionObjectLength);
            submitBtn.onclick = () => {
                // Check if the question are finished or not
                // If yes, the button will be removed as well as the answers
                if (indexCount === questionObjectLength - 1) {
                    // Remove the submit button
                    submitBtn.remove();
                    // After one second, we remove the whole quiz area (Question and answers)
                    setTimeout(() => {
                        quizAnswers.innerHTML = "";
                    }, 1000);
                    // We check the result only if the last questions
                    checkTheRightAnswer(
                        questionObject[questionObjectLength - 1]["right_answer"]
                    );
                    if (+rightAnswers.innerHTML < +totalAnswers.innerHTML / 2) {
                        result.classList.add("bad");
                        result.innerHTML = "Bad Score,";
                    } else if (
                        +rightAnswers.innerHTML < +totalAnswers.innerHTML
                    ) {
                        result.classList.add("good");
                        result.innerHTML = "Moderate Score,";
                    } else {
                        result.classList.add("perfect");
                        result.innerHTML = "Perfect Score,";
                    }
                } else {
                    let rightAnswer =
                        questionObject[indexCount]["right_answer"];

                    // A function to check between the chosen answer and the right one
                    checkTheRightAnswer(rightAnswer, questionObjectLength);

                    //  Increment the index count by one
                    indexCount++;

                    // Empty the current question and get the next one
                    quizAnswers.innerHTML = "";

                    // Get the next question
                    showQuestions(
                        questionObject[indexCount],
                        questionObjectLength
                    );

                    nextSpanOn(indexCount);

                    // The count down function
                    clearInterval(countDownInterval);
                    timer(+timerSpan.innerHTML, questionObjectLength);
                }
            };
        }
    };
    myRequest.open("GET", `${fileName}.json`, true);
    myRequest.send();
}

// A function to create the question count number and the bullets spans
function spanBullets(obj) {
    questionCount.innerHTML = obj.length;

    for (let i = 0; i < obj.length; i++) {
        let bulletSpan = document.createElement("span");

        if (i === 0) {
            bulletSpan.className = "on";
        }

        spansArea.appendChild(bulletSpan);
    }
}

// Function for next span on
function nextSpanOn(ind) {
    let span = Array.from(document.querySelectorAll(".spans span"));

    span[ind].className = "on";
}

// Function to get questions and put them inside the HTML page
function showQuestions(obj, len) {
    // Create the question P and appending it to the main div
    let pQuestion = document.createElement("p");
    pQuestion.className = "question";

    // As the question inside the object is with the name of title, we used it to add to the page
    pQuestion.innerText = obj.title;

    // The for loop to create the divs that contains all the answers
    for (let i = 1; i <= 4; i++) {
        let answerDiv = document.createElement("div");
        answerDiv.className = "answer";

        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "questions";
        radioBtn.id = `answer_${i}`;
        radioBtn.dataset.answer = obj[`answer_${i}`];

        if (i === 1) {
            radioBtn.checked = true;
        }

        let labelArea = document.createElement("label");
        labelArea.setAttribute("for", `answer_${i}`);
        labelArea.innerText = obj[`answer_${i}`];

        answerDiv.appendChild(radioBtn);
        answerDiv.appendChild(labelArea);
        quizAnswers.appendChild(answerDiv);
    }
    quizAnswers.prepend(pQuestion);
}

// Function that takes the right answer and compare it to the chosen answer of the user
function checkTheRightAnswer(rightAnswer) {
    let allInputs = Array.from(document.querySelectorAll(".answer input"));
    let chosenAnswer;

    allInputs.forEach((answer) => {
        if (answer.checked) {
            chosenAnswer = answer.dataset.answer;
        }
    });

    if (chosenAnswer === rightAnswer) {
        // Increment the right answer by one
        rightAnswersCount++;
        rightAnswers.innerHTML = rightAnswersCount;
    }
}

// The count down function that takes the duration and make a count down
function timer(duration) {
    let minutes, seconds;

    countDownInterval = setInterval(() => {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        countDown.innerHTML = `${minutes} : ${seconds}`;
        if (--duration < 0) {
            clearInterval(countDownInterval);
            submitBtn.click();
        }
    }, 1000);
}
