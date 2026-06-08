/*
-au click récup la couleur/forme push dans un tableau (délégation d'event), affiche dans la ligne d'essai
-compare le code secret avec la ligne d'essai, donne indices
-const tableau pour code secret en random
-setTimeout + steInterval compte à rebours pour les 20s
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
    isGameOver: false //flag
};

// ===DOM ELEMENTS===
const secretStatusText = document.getElementById('secret-status-text');
const secretSlotsContainer = document.getElementById('secret-slots-container');
const boardContainer = document.getElementById('board');
const colorPicker = document.querySelector('.color-picker');

const submitGuessBtn = document.getElementById('submit-guess-btn');
const deleteBtn = document.getElementById('delete-btn');
const resetBtn = document.getElementById('reset-btn');

// ---LOGIC TO GENERATE RANDOM SECRET CODE---
function generateScretCode(){
    state.secretCode = []; //cleaning before generating new code

    for(let i = 0; i < CODE_LENGTH; i++){
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        state.secretCode.push(COLORS[randomIndex]);
    }

    console.log('secret code:', state.secretCode);
    return state.secretCode;

}

generateScretCode();

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

setUpBoard();

// ---LOGIC TO DISPLAY ON THE BOARD USER'S GUESS--- 
function updateGuessDisplay(){
    const activeRow = document.getElementById(`row-${state.currentTurn}`);
    if(!activeRow) return; //exclusively the current row

    const slots = document.querySelectorAll('.guess-slot');
    slots.forEach((slot, index) => {
        // clean before adding any class
        slot.className = 'guess-slot';

        // check if currentGuess has a color at this index so it can add it to the slot
        if(state.currentGuess[index]){
            slot.classList.add(state.currentGuess[index]);
            
            console.log(slot);
        }

    })
}

// ===EVENT LISTENERS===

// ---LOGIC FOR COLOR SELECTION HANDLER (EVENT DELEGATION)
colorPicker.addEventListener('click', (e) => {
    if(state.isGameOver) return; // can play if it is gameover

    const clickedpawn = e.target.closest('.color-pawn');
    if(!clickedpawn) return; // security if clicked beside the pawn

    if(state.currentGuess.length >= CODE_LENGTH) return; //security if currentGuess is already full

    state.currentGuess.push(clickedpawn.dataset.color);
    updateGuessDisplay();

})