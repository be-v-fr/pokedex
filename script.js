let pokemon = [];
let renderedPokemon = 0;
let currentPokemon = 0;
let currentSection = 'about';


/**
 * initialize web page (called by body onload event)
 */
function init() {
    loadAndRenderPokemon();
}


function loadAndRenderPokemon() {
    const goalNr = pokemon.length + LOAD_NR;
    loadPokemon();
    renderPokedexWhileLoading(pokemon.length + LOAD_NR);
}


/**
 * download next set of pokemon from API
 * (number of pokemon per set given by global const "LOAD_NR")
 */
async function loadPokemon() {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const countFrom = pokemon.length;
    for (let i = 1; i <= LOAD_NR; i++) {
        const pokeId = countFrom + i;
        setMessage(getLoadingMessageHtml(pokeId, countFrom));
        let response = await fetch(url + pokeId).catch(errorFunction);
        let responseAsJson = await response.json();
        pokemon.push(responseAsJson);
    }
}


/**
 * set message to be shown in message container
 * @param {String} messageHtml - message HTML string 
 */
function setMessage(messageHtml) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = messageHtml;
}


/**
 * toggle loading/rendering message overlay
 */
function toggleMessageOverlay() {
    const overlay = document.getElementById('messageOverlay');
    overlay.style.display == 'none' ? overlay.style.display = 'flex' : overlay.style.display = 'none';
}


/**
 * display general error in console
 */
function errorFunction() {
    console.error('Error!');
}


/**
 * capitalize first letter of any string
 * @param {String} string - input string 
 * @returns {String} transformed string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * replace hyphens with spaces in any string
 * @param {String} string - input string 
 * @returns transformed string
 */
function removeHyphens(string) {
    return string.replace(/-/g, ' ');
}


/**
 * render pokedex
 * @param {Array} pokemonArray - array of pokemon to be rendered (all loaded pokemon or filtered pokemon)
 * @param {Number} goalNr - pokemon number after loading process completion
 */
function renderPokedexWhileLoading(goalNr) {
    toggleMessageOverlay();
    const interval = setInterval(() => {
        updatePokedex();
        window.scrollTo(0, document.body.scrollHeight);
        console.log('render while loading!')
        if(pokemon.length == goalNr) {
            toggleMessageOverlay();
            clearInterval(interval);
        }
    }, 1000);
}


/**
 * render pokedex
 * @param {Array} pokemonArray - array of pokemon to be rendered (all loaded pokemon or filtered pokemon)
 */
function renderPokedex(pokemonArray) {
    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
    for (let i = 0; i < pokemonArray.length; i++) {addToPokedex(pokemonArray, i)}
}


function updatePokedex() {
    const startingLength = document.getElementsByClassName('pokedexCard').length;
    for (let i = startingLength; i < pokemon.length; i++) {
        addToPokedex(pokemon, i);
    }
}


/**
 * render single pokemon to pokedex
 * @param {Array} pokemonArray - array containing the pokemon to be added
 * @param {Number} index - pokemon array index 
 */
function addToPokedex(pokemonArray, index) {
    const pokedex = document.getElementById('pokedex');
    const pokeId = pokedexData(pokemonArray, index)[0];
    const data = pokedexData(pokemon, pokeId - 1);
    const type1 = data[4];
    pokedex.innerHTML += cardHtml(data);
    setPokedexBgColor(pokeId);
    if (type1) {renderType1(pokeId, type1)}
}

function renderType1(pokeId, type1) {
    const containerId = `pokedexCardLeft${pokeId}`;
    const container = document.getElementById(containerId);
    container.innerHTML += typeHtml(type1);
}

function pokedexData(pokemonArray, pokemonIndex) {
    let pokemonJson = pokemonArray[pokemonIndex];
    let pokeId = pokemonJson['id'];
    let name = pokemonJson['name'];
    let imgUrl = pokemonJson['sprites']['other']['official-artwork']['front_default'];
    let type0 = pokemonJson['types']['0']['type']['name'];
    let type1 =  getType1(pokemonJson);
    name = capitalizeFirstLetter(name);
    type0 = capitalizeFirstLetter(type0);
    return [pokeId, name, imgUrl, type0, type1];
}

function getType1(pokemonJson) {
    let type1 = '';
    if (pokemonJson['types']['1']) {
        type1 = pokemonJson['types']['1']['type']['name'];
        type1 = capitalizeFirstLetter(type1);
    }
    return type1;
}

function setPokedexBgColor(pokeId) {
    const card = document.getElementById(`pokedexCard${pokeId}`);
    card.style.backgroundColor = getTypeColor(pokeId - 1, 0);
}

function getTypeColor(pokemonIndex, arrayIndex) {
    let type = pokedexData(pokemon, pokemonIndex)[3];
    type = type.toLowerCase(); // klein schreiben, da Parameter in Großschreibweise übergeben wurde
    return TYPE_COLORS[`${type}`][arrayIndex];
}

function loadMorePokemon() {
    loadAndRenderPokemon();
}

function view(pokemonIndex) {
    currentPokemon = pokemonIndex - 1;
    toggleViewer();
    renderPokemonToViewer(currentPokemon);
}

function toggleViewer(event) {
    const body = document.body;
    const overlay = document.getElementById('viewerOverlay');
    overlay.style.display = (overlay.style.display === 'none') ? 'flex' : 'none';

    // Wenn ein Event übergeben wurde und es nicht im Pop-Up war, schließe das Pop-Up
    if (event && !event.target.closest('#viewer')) {
        overlay.style.display = 'none';
    }

    body.classList.toggle('no-scroll');
}

function renderPokemonToViewer(pokemonIndex) {
    const typeColor = getTypeColor(pokemonIndex, 0);
    renderViewerBasic(pokemonIndex);
    renderViewerAboutSection(pokemonIndex);
    renderViewerStatsSection(pokemonIndex);
    setViewerColor(typeColor);
    setButtonColor(typeColor);
    setNavDisplay(currentSection);
}

function renderViewerBasic(pokemonIndex) {
    const basicData = pokedexData(pokemon, pokemonIndex); // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
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
    let id = pokemonIndex + 1 // Indizierung anpassen
    id = '00' + id; // füge vor der Zahl zwei Nullen hinzu
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
    if (section == 'about') {
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
    const typeColor = getTypeColor(currentPokemon, 0);
    if (section == 'about') {
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
        navActivate(about, true, 'left');
        navActivate(stats, false, 'right');
    } else {
        navActivate(about, false, 'left');
        navActivate(stats, true, 'right');
    }
}

function navActivate(section, activate, side) {
    side = capitalizeFirstLetter(side);
    if(activate == true) {
        section.classList.add('navActive');
        section.classList.remove('navInactive');
        section.classList.remove(`nav${side}`)
    } else {
        section.classList.remove('navActive');
        section.classList.add('navInactive');
        section.classList.add(`nav${side}`)
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