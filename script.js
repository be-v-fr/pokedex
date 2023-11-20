const TYPE_COLORS = {
    types: ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'],
    colors: ['#3A9A54', '#5C5879', '#448994', '#FCF872', '#E71469', '#ED6237', '#FF4A5A', '#93B2C7', '#8E6890', '#26CB4C', '#A96F2F', '#D8F0FA', '#CB97A7', '#9D68D9', '#F41E90', '#893E23', '#42BD94', '#85A9FE'],
    colors_dark: ['#1C4B27', '#040706', '#458A95', '#E3E32B', '#981844', '#984025', '#AB1F23', '#4C667C', '#33336B', '#147B3C', '#A7702C', '#86D2F5', '#75515B', '#5E2D88', '#A42A6C', '#4A180C', '#5F756D', '#1552E4']
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
    let index = TYPE_COLORS['types'].indexOf(type);
    return TYPE_COLORS['colors'][index];
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