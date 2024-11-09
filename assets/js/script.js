console.log('script loaded');

async function fetchRandomPokemon() {
    try {
        let randomPokemon = (Math.floor(Math.random() * 151) + 1);
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
        let data = await response.json();

        let sprite = data.sprites.front_default;

        document.getElementById('start-pokemon-image').src = sprite;

    } catch (error) {
        console.log("Could not fetch Pokémon! Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRandomPokemon);

let pokemonImage = document.getElementById('pokemon-image');
let pokemonName = document.getElementById('pokemon-name');
let answerIndi = document.getElementById('answer-indicator');
let score = 0;

let pokemonType = [];
let selectedTypes = [];

async function getPokemon() {
    try {
        let randomPokemon = Math.floor(Math.random() * 151) + 1;
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
        let data = await response.json();

        let name = data.name;
        let sprite = data.sprites.front_default;
        let type = data.types.map(typeInfo => typeInfo.type.name);
        console.log(type);

        if (name.toLowerCase() === 'magneton' || name.toLowerCase() === 'magnemite') {
            pokemonType = type.filter(type => type !== 'steel');
        } else if (name.toLowerCase() === 'clefable' || name.toLowerCase() === 'clefairy') {
            pokemonType = type.filter(type => type !== 'fairy').concat('normal');
        } else if (name.toLowerCase() === 'wigglytuff' || name.toLowerCase() === 'jigglypuff') {
            pokemonType = type.filter(type => type !== 'fairy');
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
    } catch (error) {
        console.log("Could not fetch Pokémon! Error:", error);
    }
}

let typeButtons = document.querySelectorAll('.type-btn');
typeButtons.forEach(button => {
    button.addEventListener('click', handleClick);
});

function handleClick(event) {
    let clickedButton = event.currentTarget;
    let buttonType = clickedButton.getAttribute('data-type');

    typeButtons.forEach(button => button.classList.remove('pressed'));
    clickedButton.classList.add('pressed');
    setTimeout(() => {
        clickedButton.classList.remove('pressed');
    }, 100);

    if (!selectedTypes.includes(buttonType)) {
        selectedTypes.push(buttonType);
    }

    answerIndi.textContent = selectedTypes.join(' / ');

    if (pokemonType.length === selectedTypes.length) {
        let isCorrect = selectedTypes.every(type => pokemonType.includes(type));

        if (isCorrect) {
            score += 1;
            document.getElementById('score-display').textContent = `Score: ${score}`;
            displayCorrectAnswer();
            console.log(score)
        } else {
            displayWrongAnswer();
        }
    }

    console.log(`You clicked on: ${buttonType}`);
}

function displayCorrectAnswer() {
    answerIndi.style.color = '#12da00';
    answerIndi.style.textShadow = `
        -2px -2px 0 #004400,
        2px -2px 0 #004400,
        -2px 2px 0 #004400,
        2px 2px 0 #004400`;
    console.log('correct!');
    selectedTypes = [];

    setTimeout(() => {
        getPokemon();
        resetAnswerIndicator();
    }, 300);
}

function displayWrongAnswer() {
    answerIndi.style.color = '#ff2b2b';
    answerIndi.style.textShadow = `
        -2px -2px 0 #8b0000,
        2px -2px 0 #8b0000,
        -2px 2px 0 #8b0000,
        2px 2px 0 #8b0000`;
    console.log('wrong!');
    selectedTypes = [];

    setTimeout(() => {
        resetAnswerIndicator();
    }, 300);
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

document.getElementById('next-question').addEventListener('click', handleNextQuestion);

function handleNextQuestion() {
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

