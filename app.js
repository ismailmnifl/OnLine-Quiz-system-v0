//elements selector
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanCOntainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector('.bullets');
let resultsArea = document.querySelector('.results');
let countdown = document.querySelector('.countdown');

//options
let currentIndex = 0;
let rightAnswers = 0;
let overview = [];
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            //question count and and bullets generation
            createBullets(questionsCount);
            //Add questions data
            addQiestionData(questionsObject[currentIndex], questionsCount);
            //countDown
            countDown(10);
            //click on submit
            submitButton.onclick = () => {
                //get the right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                //increase the currentIndex
                currentIndex++;
                //check the answer
                checkAnswer(theRightAnswer, questionsCount, currentIndex);
                //remove old querstion
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addQiestionData(questionsObject[currentIndex], questionsCount);

                //handle bullets classes 
                bulletesManipilations();
                //countDown
                clearInterval(countDownInterval);
                countDown(10);
                //show results
                showResults(questionsCount);

            };
        }
    };
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //create spans

    for (let index = 0; index < num; index++) {
        //create bullets
        let bullets = document.createElement("span");
        //check if the test is on the first question

        if (index == 0) {
            bullets.className = "on";
        }
        //set bullets to bullets container
        bulletsSpanCOntainer.appendChild(bullets);
    }
}

function addQiestionData(object, count) {
    if (currentIndex < count) {
        //creat H2 question title
        let questionTitle = document.createElement("h2");
        //create question text
        let questionText = document.createTextNode(object.title);
        //apend text to h2
        questionTitle.append(questionText);
        //apend quesion to quiz-area
        quizArea.append(questionTitle);

        //create the answers
        for (let index = 1; index <= 4; index++) {
            //creat main answers div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            //create radio input

            let radioInput = document.createElement("input");
            // add type + id + name to the radio input
            radioInput.name = "question";
            radioInput.id = `answer_${index}`;
            radioInput.type = "radio";
            radioInput.dataset.answer = object[`answer_${index}`];

            //create label
            let answerLabel = document.createElement("label");

            //add for attribute
            answerLabel.htmlFor = `answer_${index}`;

            //create text for the label
            let labelAnswerText = document.createTextNode(object[`answer_${index}`]);
            //add answer text to the label
            answerLabel.append(labelAnswerText);
            //add input + label to maiin div
            mainDiv.append(radioInput);
            mainDiv.append(answerLabel);
            //add all the div to the answers area
            answersArea.append(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count, arrayIndex) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let index = 0; index < answers.length; index++) {
        if (answers[index].checked) {
            theChoosenAnswer = answers[index].dataset.answer;
        }
    }
    //console.log(`the right answer : ${rAnswer}`);
    //console.log(`the choosen answer : ${theChoosenAnswer}`);
    if (rAnswer == theChoosenAnswer) {
        rightAnswers++;
        overview[arrayIndex] = `<i onclick="alert('the right answer was ${rAnswer} ')" style="color: #009688; margin: 3px; font-size: 20px;" class="far fa-check-circle"></i>`;
        //console.log('good answer'+overview);

    } else {
        overview[arrayIndex] = `<i onclick="alert('the right answer was ${rAnswer} ')" style="color: #dc0a0a; margin: 3px; font-size: 20px;" class="far fa-times-circle"></i>`;
        //console.log('bad answer'+overview);

    }
}

function bulletesManipilations() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex == index) {
            span.className = 'on';
        }
    })
}

function showResults(count) {
    let theResults = "";

    //if the the question are finished then show me the the results
    if (currentIndex == count) {
        //console.log('questions are finished');

        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

       
        let Percentage = (rightAnswers / count) * 100;
        if (Percentage == 100) {
            sessionStorage.removeItem('Percentage')
            sessionStorage.setItem("Percentage", Percentage);
            theResults = 
            `<span>
            <span class="perfect">
            perfect score
            </span> you score is ${Percentage}% you got all the questions right.<br>
            <a href="score.html" id="startAgain">Register your score</a>
            </span>`;
        } else if (Percentage >= 50 && Percentage < 100) {
            sessionStorage.removeItem('Percentage')
            sessionStorage.setItem("Percentage", Percentage);
            theResults = 
            `<span>
            <span class="good">
            acceptable job
            </span> ${Percentage}% you got ${rightAnswers} of ${count} question right. you can try again<br>
            <button onclick="location.reload();" id="startAgain">star again</button><br>
            <a href="score.html" id="startAgain">Register your score</a>

            </span>
            `;
        } else if(Percentage < 50){
            theResults = 
            `<span>
            <span class="bad">
            bad job
            </span> ${Percentage}% you got ${rightAnswers} of ${count} question right. you have failed this quiz
            </span>`
            ;

        }
        resultsArea.innerHTML = theResults;

       
        let mainDiv = document.createElement('div');
        let test = document.createElement('span')
        test.className = 'bad'
        
        mainDiv.innerHTML = "";
        for (let index = 1; index <= count; index++) {

            test.innerHTML += overview[index];
            mainDiv.appendChild(test);
        }
            mainDiv.className = "maiDiv";
            resultsArea.append(mainDiv);
  
    
    }
}


/* function countDown(duration, count) {
    if (currentIndex < count) {
        let seconds;
        countDownInterval = setInterval(function(){
            duration = duration < 10 ? `0${duration}`: duration;
            countdown.innerHTML = `00:${duration}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);  
                submitButton.click();
            }
        },1000);
    }
} */

function countDown(duration) {

        let minutes, seconds;
        countDownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdown.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();

            }
        }, 1000);
}