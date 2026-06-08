/*
-créer une suite de couleur random à deviner
-au click récup la couleur push dans un tableau (délégation d'event), affiche dans la ligne d'essai
-au click btn check compare le code secret avec la ligne d'essai, donner indices

*/
'use strict';

// ===CONST & GLOBAL STATES===
const COLORS = ['red-diamond', 'green-circle', 'blue-square', 'yellow-triangle'];
const CODE_LENGTH = 4;
const ATTEMPTS = 10;

const state = {
    secretCode: [],
    currentGuess: [],
    currentTurn: 0,
    isOver: false //flag
};

// ===DOM ELEMENTS===
const secretStatusText = document.getElementById('secret-status-text');
const secretSlotsContainer = document.getElementById('secret-slots-container');
const boardContainer = document.getElementById('board');
const colorPicker = document.querySelector('.color-picker');
const resultText = document.getElementById('result-text');

const submitGuessBtn = document.getElementById('submit-guess-btn');
const deleteBtn = document.getElementById('delete-btn');
const resetBtn = document.getElementById('reset-btn');

// ===GAME LOGIC===

// ---LOGIC TO INITIALIZE THE GAME---
function initGame(){
    // make sure everything is cleaning before starting the game
    state.secretCode = [];
    state.currentGuess = [];
    state.currentTurn = 0;
    state.isOver = false;
    
    resultText.textContent = '';
    secretStatusText.classList.remove('hidden');
    secretSlotsContainer.classList.add('hidden');


    generateSecretCode();
    setUpBoard();
}

// ---LOGIC TO GENERATE RANDOM SECRET CODE---
function generateSecretCode(){
    state.secretCode = []; //cleaning before generating new code

    for(let i = 0; i < CODE_LENGTH; i++){
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        state.secretCode.push(COLORS[randomIndex]);
    }

    console.log('secret code:', state.secretCode);
    return state.secretCode;

}


// ---LOGIC TO GENERATE DYNAMICALLY ROWS IN THE BOARD FOR USER GUESSES---
function setUpBoard(){
    boardContainer.innerHTML = ''; //cleaning

    for(let r = 0; r < ATTEMPTS; r++){
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        rowDiv.id = `row-${r}`;
        if(r === 0) rowDiv.classList.add('active'); //add class active at the first row to begin the game

        // create guess slots
        const slotsContainer = document.createElement('div');
        slotsContainer.classList.add('row-slots');
        for(let s = 0; s < CODE_LENGTH; s++){
            const slot = document.createElement('div');
            slot.classList.add('guess-slot');
            slotsContainer.appendChild(slot)
        }

        // ???TODO??? CLUE pawn ELEMENTS

        rowDiv.appendChild(slotsContainer);
        boardContainer.appendChild(rowDiv)

    }
}


// ---LOGIC TO DISPLAY ON THE BOARD USER'S GUESSES--- 
function updateGuessDisplay(){
    const activeRow = document.getElementById(`row-${state.currentTurn}`);
    if(!activeRow) return; //exclusively the current row

    const slots = document.querySelectorAll('.guess-slot');
    slots.forEach((slot, index) => {
        // clean before adding any class to prevent having previous classes
        slot.className = 'guess-slot';

        // check if currentGuess has a color at this index so it can add it to the slot
        if(state.currentGuess[index]){
            slot.classList.add(state.currentGuess[index]);
            
            console.log(slot);
        }

    });
}

// ---LOGIC TO COMPARE SECRET CODE AND USER'S GUESS
function checkGuess(secret, guess){
    let perfectMatches = 0; // well placed and good color
    let colorMatches = 0; // good color but misplaced

    console.log('perfect matches before checking: ', perfectMatches);
    console.log('color matches before checking: ', colorMatches);
    
    let secretCopy = [...secret];
    let guessCopy = [...guess];
    
    // Check correct placement
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] === secretCopy[i]) {
            perfectMatches++;
            // avoid double check for misplacement
            guessCopy[i] = null;
            secretCopy[i] = null;

        }
    }
    console.log('perfect matches after checking: ', perfectMatches);
    
    // Check misplacement
    for(let i = 0; i < CODE_LENGTH; i++){
        if(guessCopy !== null){
            // guessCopy[i] dans secretCopy
            let colorAtIndex = secretCopy.indexOf(guessCopy[i]);
            console.log(colorAtIndex);
            if(colorAtIndex !== -1){
                colorMatches++;
                secretCopy[colorAtIndex] = null;
            }

        }
    }
    
    console.log('color matches after checking: ', colorMatches);


    return { perfectMatches, colorMatches };
}

// ---LOGIC TO REVEAL SECRET CODE---
function revealSecretCode(){
    secretStatusText.classList.add('hidden');
    secretSlotsContainer.classList.remove('hidden');
    const secretSlots = document.querySelectorAll('.secret-slot');
    secretSlots.forEach((slot, index) => {
        slot.classList.add(state.secretCode[index]);
    })
}

// ===EVENT LISTENERS===

// ---LOGIC FOR COLOR SELECTION HANDLER (EVENT DELEGATION)
colorPicker.addEventListener('click', (e) => {
    if(state.isOver) return;

    const clickedpawn = e.target.closest('.color-pawn');
    if(!clickedpawn) return; // security if clicked beside the pawn

    if(state.currentGuess.length >= CODE_LENGTH) return; //security if currentGuess is already full

    state.currentGuess.push(clickedpawn.dataset.color);
    updateGuessDisplay();

});

submitGuessBtn.addEventListener('click', () => {
    if(state.isOver) return; 

    // security if user attempts to check code before filling completly currentGuess
    if(state.currentGuess.length < CODE_LENGTH){
        resultText.textContent = 'Please select 4 colors before checking...'
        return;
    }

    const result = checkGuess(state.secretCode, state.currentGuess);

    console.log('result: ',result);

    // condition win
    if(result.perfectMatches === CODE_LENGTH){
        resultText.textContent = 'You win, you guessed right!!';
        state.isOver = true;
        revealSecretCode();

        return;
    }
    
    // change current row, update turn and clean currentGuess for new attempt
    document.getElementById(`row-${state.currentTurn}`).classList.remove('active');
    state.currentTurn++;
    state.currentGuess = [];
    
    // condition lose
    if(state.currentTurn >= ATTEMPTS){
        resultText.textContent = 'You lose';
        state.isOver = true;
        revealSecretCode();

        return;
    }

    document.getElementById(`row-${state.currentTurn}`).classList.add('active');


});

resetBtn.addEventListener('click', () => {
    initGame();
})

// ***INITIALIZING THE GAME***
initGame();