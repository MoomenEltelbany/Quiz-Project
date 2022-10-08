// Capturing the elements of HTML
let questionCount = document.querySelector(".quiz-info .q-count");
let spansArea = document.querySelector(".bullets .spans");
let quizAnswers = document.querySelector(".quiz-answers");
let submitBtn = document.querySelector(".submit");
let rightAnswers = document.querySelector(".right-answers");
let totalAnswers = document.querySelector(".total-answers");

// Setting up auxiliary elements
let indexCount = 0;
let rightAnswersCount = 0;

function getsQuestion() {
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
            submitBtn.onclick = () => {
                // Check if the question are finished or not
                // If yes, the button will be removed as well as the answers
                if (indexCount === questionObjectLength - 1) {
                    quizAnswers.innerHTML = "";
                    submitBtn.remove();
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
                }
            };
        }
    };
    myRequest.open("GET", "html.json", true);
    myRequest.send();
}

getsQuestion();

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

function checkTheRightAnswer(rightAnswer, len) {
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
    } else {
        console.log("Bads");
    }
}
