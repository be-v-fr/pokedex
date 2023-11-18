let pokemon = [];

async function init() {
    await loadPokemon();
    renderPokedex();
}

async function loadPokemon() {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    for (let i = 1; i <= 150; i++) {
        let response = await fetch(url + i).catch(errorFunction);
        let responseAsJson = await response.json();

        pokemon.push(responseAsJson);
    }
}

function errorFunction() {
    console.log('Fehler');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokedex() {
    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
    for (let i = 0; i < pokemon.length; i++) {
        const data = pokedexData(i);
        const type1 = data[3];
        pokedex.innerHTML += cardHtml(data);
        if (type1) {
            const id = `pokedexCardLeft${data[0]}`;
            const card = document.getElementById(id);
            card.innerHTML += type1Html(type1);
        }
    }
}

function renderPokemonToViewer(pokemonIndex) {
    const pokemonViewer = document.getElementById('pokemonViewer');
    let pokemonJson = pokemon[pokemonIndex];
    pokemonViewer.innerHTML += viewerHtml(pokemonJson);
}

function pokedexData(pokemonIndex) {
    let pokemonJson = pokemon[pokemonIndex];
    let name = pokemonJson['name'];
    let imgUrl = pokemonJson['sprites']['other']['official-artwork']['front_default'];
    let type0 = pokemonJson['types']['0']['type']['name'];
    let type1 = '';

    name = capitalizeFirstLetter(name);
    type0 = capitalizeFirstLetter(type0);
    if (pokemonJson['types']['1']) {
        type1 = pokemonJson['types']['1']['type']['name'];
        type1 = capitalizeFirstLetter(type1);
    }

    return [name, imgUrl, type0, type1];
}

function cardHtml(pokedexData) { // 0: name, 1: imgUrl, 2: type0, 3: type1
    return /* html */ `
        <div class="pokedexCard" onclick="view()">
        <div class="pokedexCardLeft" id="pokedexCardLeft${pokedexData[0]}">
            <h1>${pokedexData[0]}</h1>
            <p class="pokedexType">${pokedexData[2]}</p>
        </div>
        <div class="pokedexCardRight">
            <svg class="pokedexBgEllipse"></svg>
            <img class="pokedexImg" src="${pokedexData[1]}">
        </div>
    </div>
`;
}

function view() {
    toggleViewer(true);
}

function toggleViewer(show) {
    const overlay = document.getElementById('overlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function type1Html(type) {
    return /* html */ `
        <p class="pokedexType">${type}</p>
    `;
}

function viewerHtml(pokemonJson) {
    let imgUrl = pokemonJson['sprites']['other']['official-artwork'];
    let name = pokemonJson['name'];
    name = capitalizeFirstLetter(name);

    return /* html */ `
        <img src="${spriteUrl}" alt="Bild">
        <h1>${name}</h1>    
    `;
}