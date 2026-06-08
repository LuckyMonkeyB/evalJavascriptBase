/*
-au click récup la couleur/forme push dans un tableau (délégation d'event), affiche dans la ligne d'essai
-compare le code secret avec la ligne d'essai, donne indices
-const tableau pour code secret en random
-setTimeout + steInterval compte à rebours pour les 20s
*/
'use strict';

// ===CONST & GLOBAL STATES===
const COLORS = ['red', 'green', 'blue', 'yellow'];
const CODE_LENGTH = 4;
const ATTEMPTS = 10;

const state = {
    secretCode: [],
    currentGuess: [],
    currentTurn: 0,
    isGameOver: false
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
    state.secretCode = [];

    for(let i = 0; i < CODE_LENGTH; i++){
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        state.secretCode.push(COLORS[randomIndex]);
    }

    console.log('secret code:', state.secretCode);
    return state.secretCode;

}

generateScretCode();





