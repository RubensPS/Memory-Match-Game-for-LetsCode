const btnStart = document.querySelector(".btn-start");
const btnRestart = document.querySelector(".btn-restart");
const btnCloseModal = document.querySelector('.close-modal');
const cards = document.querySelectorAll('.card');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
let started = false;
let isFirstFlipped = true;
let firstCard;
let secondCard;
let totalFlips = 0;
let totalMatched = 0;
let locked = true;
const deck = ['card-0', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7', 'card-8', 'card-9',
            'card-10', 'card-11', 'card-12', 'card-13', 'card-14', 'card-15'];

            
function flipCheck () {
    if (locked || this === firstCard) return;

    this.classList.add('flip');

    if (isFirstFlipped) {
        isFirstFlipped = false;
        firstCard = this;
        return;
    }

    if (!isFirstFlipped) {
    secondCard = this;
    isFirstFlipped = true;
    }

    pairCheck();
}

function pairCheck () {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        fixPair();
        totalMatched++
        document.querySelector('#total-matched').textContent = `${totalMatched}`;
        totalFlips++
        document.querySelector('#total-flips').textContent = `${totalFlips}`;
        rightSound();
    } else {
        totalFlips++
        document.querySelector('#total-flips').textContent = `${totalFlips}`;
        unflipPair()
        wrongSound()
    }
    
    setTimeout (() => {
        if (totalMatched === 8) {
            modal.classList.remove('hidden');
            overlay.classList.remove('hidden');
            document.querySelector('.modal-msg').textContent = `Congratulations! You completed the jungle challenge in ${totalFlips} moves!`;
            winSound();
        }  
    }, 1000)
}

function fixPair () {
    firstCard.removeEventListener('click', flipCheck);
    secondCard.removeEventListener('click', flipCheck);
}

function unflipPair () {

    locked = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        locked = false;
    }, 1000);
}

function wrongSound () {
    let audio = new Audio("sounds/wrong.mp3");
    audio.play();
}

function rightSound () {
    let audio = new Audio("sounds/right.mp3");
    audio.play();
}

function winSound () {
    let audio = new Audio("sounds/win.mp3");
    audio.play();
}

function shuffle (shuffledDeck) {
    shuffledDeck = [...deck];
    for (let i = shuffledDeck.length -1; i > 0; i--) {
       let j = Math.floor(Math.random() * (i + 1));
       [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    
    shuffledDeck.map((x, i) => {document.querySelector(`#${x}`).style.order = `${i}`});
}

btnStart.addEventListener('click', e => {
    if (e && !started) {
        alert("Good luck adventurer! You have 5 seconds to memorize the pattern.")
        btnStartBlock();
        btnRestartBlock();
        shuffle();
        timer();
    }
})

btnRestart.addEventListener('click', e => {
    if (e && started) {
        if (window.confirm('Do you want to restart the game? The deck will be shuffled again!')) {
            locked = true
            btnStartBlock();
            btnRestartBlock();
            shuffle();
            timer();
            totalFlips = 0;
            document.querySelector('#total-flips').textContent = `${totalFlips}`;
            totalMatched = 0;
            document.querySelector('#total-matched').textContent = '0';
            isFirstFlipped = true;
            firstCard = undefined;
            secondCard = undefined;
            cards.forEach(card => {card.addEventListener('click', flipCheck)});
        }
    }
})

function closeModal () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

function timer () {
    setTimeout (() => {
        cards.forEach(card => {card.classList.add('flip')});
    }, 1500)
    
    setTimeout (() => {
        cards.forEach(card => {card.classList.remove('flip')});
        started = true;
        locked = false;
    }, 6500)
} 

function btnRestartBlock () {
    btnRestart.disabled = true;
    setTimeout (() => {
        btnRestart.disabled = false;
    }, 10000) 
}

function btnStartBlock () {
    btnStart.disabled = true;
    setTimeout (() => {
        btnStart.disabled = false;
    }, 10000) 
}

cards.forEach(card => {card.addEventListener('click', flipCheck)});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);