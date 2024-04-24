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