/**
 * get loading message HTML with calculated parameters
 * @param {Number} pokeId - PokeID of currently loading Pokemon 
 * @param {Number} countFrom - number of pokemon loaded before
 * @returns {String} loading message HTML
 */
function loadingMessageHtml(pokeId, countFrom) {
    const current = getPokeId(pokeId - 1);
    const end = getPokeId(countFrom + LOAD_NR - 1);
    return messageHtml('loading', current, end);
}


/**
 * get HTML string for loading or rendering message
 * @param {String} message - message content ('loading' or 'rendering')
 * @param {String} current - PokeID of currently loading Pokemon
 * @param {String} end - total number after loading
 * @returns {String} loading message HTML
 */
function messageHtml(message, current, end) {
    return /* html */ `
        ${message}      
        ${current} / ${end}
        ...
    `;
}


/**
 * get single pokemon card HTML
 * @param {Array} data - pokemon data (0: index, 1: name, 2: imgUrl, 3: type0, 4: type1)
 * @returns {String} single pokemon card HTML
 */
function cardHtml(data) {
    return /* html */ `
        <div class="pokedexCard" id="pokedexCard${data[0]}" onclick="view(${data[0]})">
            <img class="pokeballBg" src="./img/pokeball.svg">
            <div class="pokedexCardLeft" id="pokedexCardLeft${data[0]}">
                <h1>${data[1]}</h1>
                ${typeHtml(data[3])}
            </div>
            <div class="pokedexCardRight">
                <img class="pokedexImg" src="${data[2]}">
            </div>
        </div>
    `;
}


/**
 * get pokemon type badge HTML
 * @param {String} type - pokemon type
 * @returns {String} type badge HTML
 */
function typeHtml(type) {
    const color = TYPE_COLORS[type.toLowerCase()][1];
    return /* html */ `
        <span
            class="pokedexType"
            style="background: ${color}"
        >
            ${type}
        </span>
    `;
}


/**
 * get stats table row HTML
 * @param {String} name - stats name
 * @param {String} value - stats value
 * @returns {String} stats table row HTML 
 */
function statsHtml(name, value) {
    return /* html */ `
        <tr>
            <td class="tableLeft">${name}</td>
            <td id="${name}" class="tableRight">${value}</td>
        </tr>
    `;
}