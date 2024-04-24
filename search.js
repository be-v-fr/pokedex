/**
 * search pokemon by filtering and rendering pokemon and reset search input value afterwards
 */
function searchPokemon() {
    renderPokedex(filterPokemon());
    resetSearch();
}


/**
 * reset search input value and set placeholder to current filter
 */
function resetSearch() {
    const input = document.getElementById('searchInput');
    input.value == '' ? input.placeholder = 'Search Pokémon' : input.placeholder = 'Filter: ' + input.value;
    input.value = '';
    showFilterNumber([], '');
}


/**
 * filter pokemon by search input
 * @returns {Array} filtered pokemon
 */
function filterPokemon() {
    let search = document.getElementById('searchInput').value;
    let pokemonFiltered = [];
    search = search.toLowerCase();
    for (let i = 0; i < pokemon.length; i++) {filterOnePokemon(search, i, pokemonFiltered)}
    showFilterNumber(pokemonFiltered, search);
    return pokemonFiltered;
}


/**
 * applay filter to single pokemon and push filtered array correspondingly
 * @param {String} search - search input value transformed to lower case
 * @param {Number} pokemonIndex - pokemon array index
 * @param {Array} pokemonFiltered - array consisting of filtered pokemon
 */
function filterOnePokemon(search, pokemonIndex, pokemonFiltered) {
    const data = prepareDataForFilter(pokedexData(pokemon, pokemonIndex));
    for (let j = 1; j < data.length; j++) {
        const datum = data[j];
        if (datum.includes(search)) {
            pokemonFiltered.push(pokemon[pokemonIndex]);
            break;
        }
    }
}


/**
 * prepare pokemon data for search filter by removing the url and transforming strings to lower case
 * @param {Array} data - normal data format as displayed to user
 * @returns {Array} prepared data
 */
function prepareDataForFilter(data) {
    data[1] = data[1].toLowerCase();
    data[3] = data[3].toLowerCase();
    data[4] = data[4].toLowerCase();
    data.splice(2, 1);
    return data;
}


/**
 * real-time display of number of pokemons to be filtered (before submitting the search)
 * @param {Array} pokemonArray - array of (filtered) pokemon to be counted
 * @param {String} search - search input value (transformed to lower case, which is irrelevant here)
 */
function showFilterNumber(pokemonArray, search) {
    const number = pokemonArray.length;
    const numberContainer = document.getElementById('searchNumber');
    search != '' && number < pokemon.length ? numberContainer.innerHTML = 'x ' + number : numberContainer.innerHTML = '';
}