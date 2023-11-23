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
let currentSection = 'about';

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

function removeHyphens(string) {
    return string.replace(/-/g, ' ');
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
     card.style.backgroundColor = getTypeColor(data[0]);
}

function getTypeColor(pokemonIndex) {
    let type = pokedexData(pokemonIndex)[3];
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
    const typeColor = getTypeColor(pokemonIndex);
    renderViewerBasic(pokemonIndex);
    renderViewerAboutSection(pokemonIndex);
    renderViewerStatsSection(pokemonIndex);
    setViewerColor(typeColor);
    setButtonColor(typeColor);
    setNavDisplay(currentSection);
}

function renderViewerBasic(pokemonIndex) {
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
}

function setViewerColor(color) {
    const viewerTop = document.getElementById('viewerTop');
    const viewerBottom = document.getElementById('viewerBottom');
    viewerTop.style.background = color;
    viewerBottom.style.color = color;
}

function setButtonColor(color) {
    const arrowLeft = document.getElementById('arrowLeft');
    const arrowRight = document.getElementById('arrowRight');
    arrowLeft.style.stroke = color;
    arrowRight.style.stroke = color;
}

function renderViewerAboutSection(pokemonIndex) {
    const idContainer = document.getElementById('pokeId');
    const heightContainer = document.getElementById('height');
    const weightContainer = document.getElementById('weight');

    idContainer.innerHTML = getPokeId(pokemonIndex);
    heightContainer.innerHTML = getHeight(pokemonIndex);
    weightContainer.innerHTML = getWeight(pokemonIndex);
    renderAbilities(pokemonIndex);
}

function getPokeId(pokemonIndex) {
    let id = '00' + pokemonIndex; // füge vor der Zahl zwei Nullen hinzu
    id = id.slice(-3); // entferne alles vor den letzten drei Zeichen
    return '#' + id;
}

function getHeight(pokemonIndex) {
    let height = pokemon[pokemonIndex]['height']; // dm
    height /= 10; // m
    return height + ' m';
}

function getWeight(pokemonIndex) {
    let weight = pokemon[pokemonIndex]['weight']; // cg
    weight /= 10; // kg
    return weight + ' kg';
}

function renderAbilities(pokemonIndex) {
    const abilitiesContainer = document.getElementById('abilities');
    const abilities = pokemon[pokemonIndex]['abilities'];
    abilitiesContainer.innerHTML = '';

    for (let i = 0; i < abilities.length; i++) {
        let ability = abilities[i]['ability']['name'];
        ability = capitalizeFirstLetter(ability);
        ability = removeHyphens(ability);
        abilitiesContainer.innerHTML += '<li>' + ability + '</li>';
    }
}

function renderViewerStatsSection(pokemonIndex, color) {
    const stats = pokemon[pokemonIndex]['stats'];
    const table = document.getElementById('statsTable');
    table.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        renderStat(stats, i);
    }
}

function renderStat(stats, statsIndex) {
    const table = document.getElementById('statsTable');
    const value = stats[statsIndex]['base_stat'];
    let name = stats[statsIndex]['stat']['name'];
    if (statsIndex == 0) { // Formatierung des Namens
        name = 'HP'; // notwendig, da Abkürzung Sonderfall ist
    } else {
        name = capitalizeFirstLetter(name);
        name = removeHyphens(name);
    }
    table.innerHTML += statsHtml(name, value);
}

function showViewerSection(section) {
    const about = document.getElementById('viewerAbout');
    const stats = document.getElementById('viewerStats');
    currentSection = section;
    setNavDisplay(section);
    if(section == 'about') {
        stats.style.display = 'none';
        about.style.display = '';
    } else {
        stats.style.display = '';
        about.style.display = 'none';
    }
}

function setNavDisplay(section) {
    setNavColor(section);
    setNavCss(section);
}

function setNavColor(section) {
    const about = document.getElementById('navAbout');
    const stats = document.getElementById('navStats');
    const typeColor = getTypeColor(currentPokemon);
    if(section == 'about') {
        about.style.color = typeColor;
        about.style.borderColor = typeColor;
        stats.style.color = '';
    } else {
        about.style.color = '';
        stats.style.borderColor = typeColor;
        stats.style.color = typeColor;
    }
}

function setNavCss(section) {
    const about = document.getElementById('navAbout');
    const stats = document.getElementById('navStats');
    if (section == 'about') {
        about.classList.add('navActive');
        about.classList.remove('navInactive');
        about.classList.remove('navLeft');
        stats.classList.remove('navActive');
        stats.classList.add('navInactive');
        stats.classList.add('navRight');
    } else {
        about.classList.remove('navActive');
        about.classList.add('navInactive');
        about.classList.add('navLeft');
        stats.classList.add('navActive');
        stats.classList.remove('navInactive');
        stats.classList.remove('navRight');      
    }
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
            <img class="pokeballBg" src="./img/pokeball.svg">
            <div class="pokedexCardLeft" id="pokedexCardLeft${pokedexData[0]}">
                <h1>${pokedexData[1]}</h1>
                <span class="pokedexType">${pokedexData[3]}</span>
            </div>
            <div class="pokedexCardRight">
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

function statsHtml(name, value) {
    return /* html */ `
        <tr>
            <td class="tableLeft">${name}</td>
            <td id="${name}" class="tableRight">${value}</td>
        </tr>
    `;
}