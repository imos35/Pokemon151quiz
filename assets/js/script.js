console.log('script loaded');

// Variables for game state
let pokemonImage = document.getElementById('pokemon-image');
let pokemonName = document.getElementById('pokemon-name');
let answerIndi = document.getElementById('answer-indicator');
let score = 0;
let allPokemonData = [];
let usedPokemonIds = new Set();
let pokemonType = [];
let selectedTypes = [];

// Fetch all Pokémon data at the start
async function fetchAllPokemon() {
    try {
        let fetchPromises = [];
        for (let i = 1; i <= 151; i++) {
            fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(response => response.json()));
        }
        allPokemonData = await Promise.all(fetchPromises);
        console.log("All Pokémon data fetched successfully");
    } catch (error) {
        console.log("Could not fetch all Pokémon data! Error:", error);
    }
}

// Display a random Pokémon on the start screen for visual effect
async function fetchRandomPokemon() {
    try {
        let randomPokemon = (Math.floor(Math.random() * 151) + 1);
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
        let data = await response.json();

        let sprite = data.sprites.front_default;
        document.getElementById('start-pokemon-image').src = sprite;
        document.getElementById('start-pokemon-image').style.display = 'block';
    } catch (error) {
        console.log("Could not fetch Pokémon for start screen! Error:", error);
    }
}
document.addEventListener('DOMContentLoaded', fetchRandomPokemon);

// Select a random Pokémon from preloaded data for gameplay
function getPokemon() {
    if (allPokemonData.length === 0) {
        console.error("No Pokémon data loaded. Ensure fetchAllPokemon() is called first.");
        return;
    }

    let randomPokemonData;
    do {
        randomPokemonData = allPokemonData[Math.floor(Math.random() * allPokemonData.length)];
    } while (usedPokemonIds.has(randomPokemonData.id));

    usedPokemonIds.add(randomPokemonData.id);

    let name = randomPokemonData.name;
    let sprite = randomPokemonData.sprites.front_default;
    let type = randomPokemonData.types.map(typeInfo => typeInfo.type.name);

    // Handle Gen 1 type overrides
    if (name === 'magneton' || name === 'magnemite') {
        pokemonType = type.filter(t => t !== 'steel');
    } else if (['clefable', 'clefairy'].includes(name)) {
        pokemonType = type.filter(t => t !== 'fairy').concat('normal');
    } else if (['wigglytuff', 'jigglypuff', 'mr-mime'].includes(name)) {
        pokemonType = type.filter(t => t !== 'fairy');
    } else {
        pokemonType = type;
    }

    pokemonName.textContent = name;
    pokemonImage.src = sprite;
    pokemonImage.alt = name;
    pokemonImage.style.display = 'block';

    answerIndi.textContent = '';
    answerIndi.style.color = '#ffcc03';
    answerIndi.style.textShadow = `
        -2px -2px 0 #006caf,
        2px -2px 0 #006caf,
        -2px 2px 0 #006caf,
        2px 2px 0 #006caf`;
}

let typeButtons = document.querySelectorAll('.type-btn');
typeButtons.forEach(button => {
    button.addEventListener('click', handleClick);
});

// Type button click handler
function handleClick(event) {
    let clickedButton = event.currentTarget;
    let buttonType = clickedButton.getAttribute('data-type');
    console.log('buttonType');

    // Handle button press effects
    typeButtons.forEach(button => button.classList.remove('pressed'));
    clickedButton.classList.add('pressed');
    setTimeout(() => clickedButton.classList.remove('pressed'), 100);

    if (!selectedTypes.includes(buttonType)) {
        selectedTypes.push(buttonType);
    }
    answerIndi.textContent = selectedTypes.join(' / ');

    if (pokemonType.length === selectedTypes.length) {
        let isCorrect = selectedTypes.every(type => pokemonType.includes(type));
        isCorrect ? displayCorrectAnswer() : displayWrongAnswer();
    }
}

// Functions to display correct and wrong answers
function displayCorrectAnswer() {
    score++;
    document.getElementById('score-display').textContent = `Score: ${score}`;
    answerIndi.style.color = '#12da00';
    answerIndi.style.textShadow = `
        -2px -2px 0 #004400,
        2px -2px 0 #004400,
        -2px 2px 0 #004400,
        2px 2px 0 #004400`;
    selectedTypes = [];

    setTimeout(() => {
        resetAnswerIndicator();
        getPokemon();
    }, 300);
}

function displayWrongAnswer() {
    answerIndi.style.color = '#ff2b2b';
    answerIndi.style.textShadow = `
        -2px -2px 0 #8b0000,
        2px -2px 0 #8b0000,
        -2px 2px 0 #8b0000,
        2px 2px 0 #8b0000`;
    selectedTypes = [];

    setTimeout(resetAnswerIndicator, 300);
}

function resetAnswerIndicator() {
    answerIndi.textContent = '';
    answerIndi.style.color = '#ffcc03';
    answerIndi.style.textShadow = `
        -2px -2px 0 #006caf,
        2px -2px 0 #006caf,
        -2px 2px 0 #006caf,
        2px 2px 0 #006caf`;
}

// "Next Question" button functionality
document.getElementById('next-question').addEventListener('click', handleNextQuestion);

function handleNextQuestion() {
    answerIndi.textContent = 'Passed!';
    answerIndi.style.color = 'grey';
    answerIndi.style.textShadow = `
        -2px -2px 0 #555555,
        2px -2px 0 #555555,
        -2px 2px 0 #555555,
        2px 2px 0 #555555`;
    selectedTypes = [];

    setTimeout(() => {
        resetAnswerIndicator();
        getPokemon();
    }, 300);
}

// Timer functionality
let timer;

function startTimer() {
    let timeLeft = 45;
    document.getElementById('timer-display').textContent = `${timeLeft}`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').textContent = `${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showScoreScreen();
        }
    }, 1000);
}

// Screen display functions

function showTutorialScreen() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('score-screen').style.display = 'none';
    document.getElementById('tutorial').style.display = 'flex';
}

function showStartScreen() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('score-screen').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
}

function showGameScreen() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    document.getElementById('score-screen').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    usedPokemonIds.clear();
    getPokemon();
    startTimer();
}

function showScoreScreen() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('score-screen').style.display = 'flex';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('final-score').textContent = `${score}`;
}

// Button events for starting and restarting
document.getElementById('next-btn').addEventListener('click', showStartScreen);
document.getElementById('start-btn').addEventListener('click', showGameScreen);
document.getElementById('restart-btn').addEventListener('click', () => {
    score = 0;
    showStartScreen();
});

// Initialize data when page loads

document.addEventListener('DOMContentLoaded', () => {
    fetchAllPokemon(); 
    showTutorialScreen();
});
