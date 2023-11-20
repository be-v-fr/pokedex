const TYPE_COLORS = {
    bug: '#3A9A54',
    dark: '#5C5879',
    dragon: '#448994',
    electric: '#FCF872',
    fairy: '#E71469',
    fighting: '#ED6237',
    fire: '#FF4A5A',
    flying: '#93B2C7',
    ghost: '#8E6890',
    grass: '#26CB4C',
    ground: '#A96F2F',
    ice: '#D8F0FA',
    normal: '#CB97A7',
    poison: '#9D68D9',
    psychic: '#F41E90',
    rock: '#893E23',
    steel: '#42BD94',
    water: '#85A9FE'
};

let pokemon = [];
let currentPokemon = 0;

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
        const type1 = data[4];
        pokedex.innerHTML += cardHtml(data);
        setPokedexBgColor(data);
        if (type1) {
            const id = `pokedexCardLeft${i}`;
            const container = document.getElementById(id);
            container.innerHTML += typeHtml(type1);
        }
    }
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

    return [pokemonIndex, name, imgUrl, type0, type1];
}

function setPokedexBgColor(data) { // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
    const card = document.getElementById(`pokedexCard${data[0]}`);
    card.style.background = getTypeColor(data[3]);
}

function getTypeColor(type) {
    type = type.toLowerCase(); // klein schreiben, da Parameter in Großschreibweise übergeben wurde
    return TYPE_COLORS[`${type}`];
}

function view(pokemonIndex) {
    currentPokemon = pokemonIndex;
    toggleViewer();
    renderPokemonToViewer(pokemonIndex);
}

function toggleViewer(event) {
    const body = document.body;
    const overlay = document.getElementById('overlay');
    overlay.style.display = (overlay.style.display === 'none') ? 'flex' : 'none';

    // Wenn ein Event übergeben wurde und es nicht im Pop-Up war, schließe das Pop-Up
    if (event && !event.target.closest('#viewer')) {
        overlay.style.display = 'none';
    }

    body.classList.toggle('no-scroll');
}

function renderPokemonToViewer(pokemonIndex) {
    const basicData = pokedexData(pokemonIndex); // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
    const name = document.getElementById('viewerName');
    const types = document.getElementById('viewerTypes');
    const pokemonImg = document.getElementById('viewerPokemonImg');

    name.innerHTML = basicData[1];
    types.innerHTML = '';
    types.innerHTML += typeHtml(basicData[3]);
    if (basicData[4]) {
        types.innerHTML += typeHtml(basicData[4]);
    }
    pokemonImg.src = basicData[2];
    setViewerBgColor(basicData);
}

function setViewerBgColor(data) { // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
    const viewer = document.getElementById('viewerTop');
    viewer.style.background = getTypeColor(data[3]);
}

function nextPokemon(next) {
    if (next) {
        incrementCurrent();
    } else {
        decrementCurrent();
    }
    renderPokemonToViewer(currentPokemon);
}

function incrementCurrent() {
    if (currentPokemon < pokemon.length - 1) {
        currentPokemon++;
    } else {
        currentPokemon = 0;
    }
}

function decrementCurrent() {
    if (currentPokemon > 0) {
        currentPokemon--;
    } else {
        currentPokemon = pokemon.length - 1;
    }
}

function cardHtml(pokedexData) { // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
    return /* html */ `
        <div class="pokedexCard" id="pokedexCard${pokedexData[0]}" onclick="view(${pokedexData[0]})">
        <div class="pokedexCardLeft" id="pokedexCardLeft${pokedexData[0]}">
            <h1>${pokedexData[1]}</h1>
            <span class="pokedexType">${pokedexData[3]}</span>
        </div>
        <div class="pokedexCardRight">
            <svg class="pokedexBgEllipse"></svg>
            <img class="pokedexImg" src="${pokedexData[2]}">
        </div>
    </div>
`;
}

function typeHtml(type) {
    return /* html */ `
        <span class="pokedexType">${type}</span>
    `;
}

function viewerHtml(pokemonJson) {

}