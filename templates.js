function loadingMessageHtml(pokeId, countFrom) {
    const current = getPokeId(pokeId - 1);
    const end = getPokeId(countFrom + LOAD_NR - 1);
    return messageHtml('loading', current, end);
}

function messageHtml(message, current, end) {
    return /* html */ `
        ${message}        
        ${current} / ${end}
        ...
    `;
}

function cardHtml(data) { // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
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

function statsHtml(name, value) {
    return /* html */ `
        <tr>
            <td class="tableLeft">${name}</td>
            <td id="${name}" class="tableRight">${value}</td>
        </tr>
    `;
}