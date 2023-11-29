function searchPokemon() {
    renderPokedex(filterPokemon());
    resetSearch();
}

function resetSearch() {
    const input = document.getElementById('searchInput');
    if (input.value != '') {
        input.placeholder = 'Filter: ' + input.value;
    } else {
        input.placeholder = 'Search Pokémon';
    }
    input.value = '';
    showFilterNumber([], '');
}

function filterPokemon() {
    let search = document.getElementById('searchInput').value;
    let pokemonFiltered = [];
    search = search.toLowerCase();
    for (let i = 0; i < pokemon.length; i++) {
        filterOnePokemon(search, i, pokemonFiltered);
    }
    showFilterNumber(pokemonFiltered);
    return pokemonFiltered;
}

function filterOnePokemon(search, pokemonIndex, pokemonFiltered) {
    let data = pokedexData(pokemon, pokemonIndex); // 0: index, 1: name, 2: imgUrl, 3: type0, 4: type1
    data = prepareDataForFilter(data);
    for (let j = 1; j < data.length; j++) { // alle Items durchsuchen
        let datum = data[j];
        if (datum.includes(search)) {
            pokemonFiltered.push(pokemon[pokemonIndex]); // Pokemon zur Auswahl hinzufügen
            break; // verhindern, dass dasselbe Pokemon mehrfach hinzugefügt wird
        }
    }
}

function prepareDataForFilter(data) {
    data[1] = data[1].toLowerCase();
    data[3] = data[3].toLowerCase();
    data[4] = data[4].toLowerCase();
    data.splice(2, 1); // URL entfernen
    return data;
}

function showFilterNumber(pokemonArray, search) {
    const number = pokemonArray.length;
    const numberContainer = document.getElementById('searchNumber');
    if (search != '' && number < pokemon.length) {
        numberContainer.innerHTML = 'x ' + number;
    } else {
        numberContainer.innerHTML = '';
    }
}