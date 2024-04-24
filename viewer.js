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