let pokemonImage = document.getElementById('pokemon-image');
let pokemonName = document.getElementById('pokemon-name');

async function getPokemon() {
    try {
        let randomPokemon = (Math.floor(Math.random) * 151) + 1;
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
        let data = await response.json;

        let name = data.name;
        let sprite = data.sprites.front_default;
        let type = data.types[0].type.name;

        pokemonName.textContent = name;
        pokemonImage.src = sprite;
        pokemonImage.alt = name;
    }
    catch(error) {
        console.log('Could not fetch Pokémon!')
    }
}

document.addEventListener('DOMContentLoaded', getPokemon);