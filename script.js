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


/**
 * load pokemon and dynamically render pokedex
 */
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
        if (pokemon.length == goalNr) {
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
    for (let i = 0; i < pokemonArray.length; i++) { addToPokedex(pokemonArray, i) }
}


/**
 * update pokedex to current pokemon array (only unfiltered since only applied when loading, not when searching)
 */
function updatePokedex() {
    const startingLength = document.getElementsByClassName('pokedexCard').length;
    for (let i = startingLength; i < pokemon.length; i++) { addToPokedex(pokemon, i) }
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
    if (type1) { renderType1(pokeId, type1) }
}


/**
 * render (optional) second pokemon type
 * @param {Number} pokeId - PokeID (counting from 1, not 0) 
 * @param {String} type1 - pokemon type
 */
function renderType1(pokeId, type1) {
    const containerId = `pokedexCardLeft${pokeId}`;
    const container = document.getElementById(containerId);
    container.innerHTML += typeHtml(type1);
}


/**
 * get desired pokedex data from raw API data for a single pokemon
 * @param {Array} pokemonArray - array of pokemon in raw API format
 * @param {Number} pokemonIndex - array index 
 * @returns {Array} pokedex data
 */
function pokedexData(pokemonArray, pokemonIndex) {
    const pokemonJson = pokemonArray[pokemonIndex];
    const pokeId = pokemonJson['id'];
    const name = capitalizeFirstLetter(pokemonJson['name']);
    const imgUrl = pokemonJson['sprites']['other']['official-artwork']['front_default'];
    const type0 = capitalizeFirstLetter(pokemonJson['types']['0']['type']['name']);
    const type1 = capitalizeFirstLetter(getType1(pokemonJson));
    return [pokeId, name, imgUrl, type0, type1];
}


/**
 * get pokemon type 1
 * @param {JSON} pokemonJson 
 * @returns {String} type 1 (if existing) or '' (else)
 */
function getType1(pokemonJson) {
    if (pokemonJson['types']['1']) { return pokemonJson['types']['1']['type']['name'] }
    else { return '' };
}


/**
 * set background color of pokemon card in pokedex (according to pokemon type 0)
 * @param {Number} pokeId - PokeID (counting from 1, not 0) 
 */
function setPokedexBgColor(pokeId) {
    const card = document.getElementById(`pokedexCard${pokeId}`);
    card.style.backgroundColor = getTypeColor(pokeId - 1, 0);
}


/**
 * get corresponding type color
 * @param {Number} pokemonIndex - pokemon array index
 * @param {Number} colorHierarchy - 0 for primary type color, 1 for (darker) secondary type color
 * @returns {String} color in hex format
 */
function getTypeColor(pokemonIndex, colorHierarchy) {
    const type = pokedexData(pokemon, pokemonIndex)[3].toLowerCase();
    return TYPE_COLORS[type][colorHierarchy];
}


/**
 * view pokemon in pokemon viewer
 * @param {Number} pokemonIndex - pokemon array index
 */
function view(pokemonIndex) {
    currentPokemon = pokemonIndex - 1;
    toggleViewer();
    renderPokemonToViewer(currentPokemon);
}


/**
 * toggle pokemon viewer
 * @param {Event} event - click event 
 */
function toggleViewer(event) {
    const overlay = document.getElementById('viewerOverlay');
    overlay.style.display = (overlay.style.display == 'none') ? 'flex' : 'none';
    if (event && !event.target.closest('#viewer')) { overlay.style.display = 'none' }
    document.body.classList.toggle('no-scroll');
}


/**
 * render pokemon to pokemon viewer
 * @param {Number} pokemonIndex - pokemon array index
 */
function renderPokemonToViewer(pokemonIndex) {
    const typeColor = getTypeColor(pokemonIndex, 0);
    renderViewerBasic(pokemonIndex);
    renderViewerAboutSection(pokemonIndex);
    renderViewerStatsSection(pokemonIndex);
    setViewerColor(typeColor);
    setButtonColor(typeColor);
    setNavDisplay(currentSection);
}


/**
 * render basic pokemon data to pokemon viewer
 * @param {Number} pokemonIndex - pokemon array index
 */
function renderViewerBasic(pokemonIndex) {
    const basicData = pokedexData(pokemon, pokemonIndex);
    const types = document.getElementById('viewerTypes');
    const pokemonImg = document.getElementById('viewerPokemonImg');
    document.getElementById('viewerName').innerHTML = basicData[1];
    types.innerHTML = '';
    types.innerHTML += typeHtml(basicData[3]);
    if (basicData[4]) { types.innerHTML += typeHtml(basicData[4]) }
    pokemonImg.src = basicData[2];
}


/**
 * set viewer colors
 * @param {String} color - color in hex format 
 */
function setViewerColor(color) {
    document.getElementById('viewerTop').style.background = color;
    document.getElementById('viewerBottom').style.color = color;
}


/**
 * set arrow buttons color
 * @param {String} color - color in hex format 
 */
function setButtonColor(color) {
    document.getElementById('arrowLeft').style.stroke = color;
    document.getElementById('arrowRight').style.stroke = color;
}


/**
 * render pokemon data to pokemon viewer about section
 * @param {Number} pokemonIndex - pokemon array index
 */
function renderViewerAboutSection(pokemonIndex) {
    document.getElementById('pokeId').innerHTML = getPokeId(pokemonIndex);
    document.getElementById('height').innerHTML = getHeight(pokemonIndex);
    document.getElementById('weight').innerHTML = getWeight(pokemonIndex);
    renderAbilities(pokemonIndex);
}


/**
 * get full official PokeID from array index 
 * @param {Number} pokemonIndex - pokemon array index (counting from 0)
 * @returns {String} PokeID (counting from '#001')
 */
function getPokeId(pokemonIndex) {
    let id = pokemonIndex + 1;
    id = '00' + id;
    id = id.slice(-3);
    return '#' + id;
}


/**
 * get pokemon height
 * @param {Number} pokemonIndex - pokemon array index
 * @returns {String} height in meters
 */
function getHeight(pokemonIndex) {
    return (pokemon[pokemonIndex]['height'] / 10) + ' m';
}


/**
 * get pokemon weight
 * @param {Number} pokemonIndex - pokemon array index
 * @returns {String} weight in kilograms
 */
function getWeight(pokemonIndex) {
    return (pokemon[pokemonIndex]['weight'] / 10) + ' kg';
}


/**
 * render pokemon abilities
 * @param {Number} pokemonIndex - pokemon array index
 */
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


/**
 * render pokemon data to pokemon viewer stats section
 * @param {Number} pokemonIndex - pokemon array index
 */
function renderViewerStatsSection(pokemonIndex) {
    const stats = pokemon[pokemonIndex]['stats'];
    const table = document.getElementById('statsTable');
    table.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        renderStat(stats, i);
    }
}


/**
 * render single stats table item
 * @param {*} stats 
 * @param {*} statsIndex 
 */
function renderStat(stats, statsIndex) {
    const table = document.getElementById('statsTable');
    const value = stats[statsIndex]['base_stat'];
    let name = stats[statsIndex]['stat']['name'];
    name = (statsIndex == 0) ? 'HP' : removeHyphens(capitalizeFirstLetter(name));
    table.innerHTML += statsHtml(name, value);
}


/**
 * show viewer section
 * @param {String} section - viewer section ('about' or 'stats') 
 */
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


/**
 * set viewer navigation style according to current pokemon and viewer state
 * @param {String} section - viewer section ('about' or 'stats')
 */
function setNavDisplay(section) {
    setNavColor(section);
    setNavCss(section);
}


/**
 * set viewer navigation color according to current pokemon and section
 * @param {String} section - viewer section ('about' or 'stats')
 */
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


/**
 * set viewer navigation style (other than pokemon type color) according to current section
 * @param {String} section - viewer section ('about' or 'stats')
 */
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


/**
 * handle css classes for viewer navigation hover animation
 * @param {String} section - viewer section ('about' or 'stats')
 * @param {Boolean} activate - activate (true) or deactivate (false) viewer section
 * @param {String} side - section position in navigation menu ('left' or 'right')
 */
function navActivate(section, activate, side) {
    side = capitalizeFirstLetter(side);
    if (activate == true) {
        section.classList.add('navActive');
        section.classList.remove('navInactive');
        section.classList.remove(`nav${side}`)
    } else {
        section.classList.remove('navActive');
        section.classList.add('navInactive');
        section.classList.add(`nav${side}`)
    }
}


/**
 * view next or previous pokemon
 * @param {Boolean} next - next (true) or previous (false) pokemon
 */
function nextPokemon(next) {
    next ? incrementCurrent() : decrementCurrent();
    renderPokemonToViewer(currentPokemon);
}


/**
 * increment current pokemon including modulo
 */
function incrementCurrent() {
    currentPokemon++;
    currentPokemon %= pokemon.length;
}


/**
 * decrement current pokemon including modulo
 */
function decrementCurrent() {
    currentPokemon--;
    if(currentPokemon < 0) {currentPokemon += pokemon.length};
}