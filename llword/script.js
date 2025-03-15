var wordSet = new Set();
var enteredWords = new Set();
var timer;
var time = 5.00;
var inputText = "";
const enterSound = new Audio('misc/enter.mp3');
const errorSound = new Audio('misc/error.mp3');
const tickSound = new Audio('misc/beep.mp3');

enterSound.load();
errorSound.load();
tickSound.load();

async function loadWords() {
    const response = await fetch("misc/words_alpha.txt");
    const data = await response.text();
    wordSet = new Set(data.split("\n").map(word => word.trim().toLowerCase()));
}

loadWords();

async function isRealWord(word) {
    return wordSet.has(word.toLowerCase());
}

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("keydown", function(event) {
        document.getElementById("error").style.visibility = "hidden";
        console.log(event.key);
        if (time > 0) {
            if (event.key.length == 1  && event.key.match(/[a-zA-Z]/)) {
                if (inputText.length == 31) {
                    triggerBounce("error");
                    playError();
                    document.getElementById("error").innerHTML = "REACHED CHARACTER LIMIT";
                    document.getElementById("error").style.visibility = "visible";
                } else if (inputText.length == 0 && document.getElementById("letter").innerHTML != "") {
                    if (event.key == document.getElementById("letter").innerHTML.toLowerCase() || event.key == document.getElementById("letter").innerHTML.toUpperCase()) {
                        inputText = event.key;
                        document.getElementById("word").style.color = "rgb(255, 255, 255, 1)";
                    } else {
                        triggerBounce("error");
                        playError();
                        document.getElementById("error").innerHTML = "FIRST LETTERS DO NOT MATCH";
                        document.getElementById("error").style.visibility = "visible";
                    }
                } else {
                    inputText += event.key;
                    document.getElementById("word").style.color = "rgb(255, 255, 255, 1)";
                }
            } else if (event.key === "Backspace") {
                if (inputText.length == 1) {
                    document.getElementById("word").style.color = "rgb(255, 255, 255, .5)";
                } 
                inputText = inputText.slice(0, -1);
            } else if (event.key === "Enter") {
                if (inputText.length < 3) {
                    triggerBounce("error");
                    playError();
                    document.getElementById("error").innerHTML = "ENTER A WORD WITH AT LEAST 3 CHARACTERS";
                    document.getElementById("error").style.visibility = "visible";
                    return;
                } else {
                    isRealWord(inputText).then((isValid) => {
                        if (isValid) {
                            if(document.getElementById("score").innerHTML == 0) {
                                success(inputText);
                            } else {
                                if(isUniqueWord(inputText.toLowerCase())) {
                                    success(inputText);
                                } else {
                                    triggerBounce("error");
                                    triggerShake("word");
                                    playError();
                                    document.getElementById("error").innerHTML = "WORD ALREADY USED";
                                    document.getElementById("error").style.visibility = "visible";
                                }
                            }
                        } else {
                            triggerBounce("error");
                            triggerShake("word");
                            playError();
                            document.getElementById("error").innerHTML = "INVALID WORD";
                            document.getElementById("error").style.visibility = "visible";
                        }
                    });
                }
            }
        } else {
            if (event.key === "=") {
                time = 5.00;
                inputText = "";
                document.getElementById("word").style.color = "rgb(255, 255, 255, .5)";
                document.getElementById("letter").innerHTML = "";
                document.getElementById("timer").innerHTML = time.toFixed(2);
                document.getElementById("overlay").classList.remove("fade");
                document.getElementById("stat_div").classList.remove("fade");
                document.getElementById("stat_div").classList.remove("slide");
                document.getElementById("stat_div").style.visibility = "hidden";
                document.getElementById("overlay").style.visibility = "hidden";
                document.getElementById("score").innerHTML = 0;
                enteredWords.clear();
            }
        }        
        document.getElementById("word").innerHTML = inputText.length > 0 ? inputText : "Enter a word...";
    }); 
});

function triggerBounce(elementID) {
    document.getElementById(elementID).classList.remove("bounce");
    void document.getElementById(elementID).offsetWidth;
    document.getElementById(elementID).classList.add("bounce");
}

function triggerShake(elementID) {
    document.getElementById(elementID).classList.remove("shake");
    void document.getElementById(elementID).offsetWidth;
    document.getElementById(elementID).classList.add("shake");
}

function addScore() {
    var score = document.getElementById("score").innerHTML;
    score++;
    document.getElementById("score").innerHTML = score;
}

function checkFirstLetter(input) {
    var letter_input = input.charAt(0).toLowerCase();
    var letter = document.getElementById("letter").innerHTML.toLowerCase();
    if (letter_input[0] === letter) {
        return true;
    }
    return false;
}

function isUniqueWord(input) {
    var word = input.trim().toLowerCase();
    if (enteredWords.has(word)) {
        return false;
    }
    return true;
}

function success() {
    enteredWords.add(inputText.toLowerCase());
    startTimer();
    stopTick();
    addScore();
    playEnter();
    triggerBounce("letter");
    triggerBounce("score");
    document.getElementById("letter").innerHTML = inputText.slice(-1).toUpperCase();
    document.getElementById("word").innerHTML = "Enter a word...";
    document.getElementById("word").setAttribute("style", "color: rgb(255, 255, 255, 0.5); font-size: 25px;");
    inputText = "";
}

function playEnter() {
    enterSound.play();
}

function playError() {
    errorSound.play();
}

function playTick() {
    tickSound.play();
}
function stopTick() {
    tickSound.pause();
    tickSound.currentTime = 0;
}

function startTimer() {
    clearInterval(timer);
    time = 5.00;

    document.getElementById("timer").innerHTML = time.toFixed(2);

    timer = setInterval(function() {
        time -= 0.01;
        document.getElementById("timer").innerHTML = time.toFixed(2);
        if (time <= 2.20) {
            playTick();
            if (time <= 0) {
                stopTick();
                clearInterval(timer);
                document.getElementById("timer").innerHTML = "0.00";
                gameOver();
            }
        }
    }, 10);
}

function gameOver() {
    document.getElementById("output").innerHTML = Array.from(enteredWords).join(", ");
    document.getElementById("overlay").classList.add("fade");
    document.getElementById("stat_div").classList.add("fade");
    document.getElementById("stat_div").classList.add("slide");
    document.getElementById("stat_div").style.visibility = "visible";
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("score_2").innerHTML = document.getElementById("score").innerHTML;
    if (document.getElementById("score").innerHTML > document.getElementById("high_score").innerHTML) {
        document.getElementById("high_score").innerHTML = document.getElementById("score").innerHTML;
    }
}

function greenColorProfile() {
    document.body.style.backgroundColor = "#87BA79";
    document.getElementById("letter_div").style.backgroundColor = "#3B4538CC";
    document.getElementById("main_div").style.backgroundColor = "#5B7E51";
    
}

function pinkColorProfile() {
    document.body.style.backgroundColor = "#BD929D";
    document.getElementById("letter_div").style.backgroundColor = "#604048CC";
    document.getElementById("main_div").style.backgroundColor = "#926E77";
}

function darkblueColorProfile() {
    document.body.style.backgroundColor = "#506586";
    document.getElementById("letter_div").style.backgroundColor = "#141923CC";
    document.getElementById("main_div").style.backgroundColor = "#304059";
}

function blueColorProfile() {
    document.body.style.backgroundColor = "#99B0D6";
    document.getElementById("letter_div").style.backgroundColor = "#29364BCC";
    document.getElementById("main_div").style.backgroundColor = "#5575A8";
}

function redColorProfile() {
    document.body.style.backgroundColor = "#CF4B4B";
    document.getElementById("letter_div").style.backgroundColor = "#471B1BCC";
    document.getElementById("main_div").style.backgroundColor = "#7E3838";
}

function yellowColorProfile() {
    document.body.style.backgroundColor = "#D0C375";
    document.getElementById("letter_div").style.backgroundColor = "#4D4619";
    document.getElementById("main_div").style.backgroundColor = "#938845";
}