
var offset = 0;
var limit = 10;

const listPokemons = document.getElementById('list-pokemons');
loadMore = document.getElementById('LoadMore');
const pokemons = document.querySelectorAll('.pokemon');





getPokemons = (limit, offset) => {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    fetch(url)
        .then((response) => response.json()) // Transformamos a resposta em JSON -> Primeiras informações 
        .then((responseJson) => responseJson.results) // Pegamos o results do nosso json, que é a parte que contém de fato as informações a respeito dos pokemons 
        .then((pokemons) => pokemons.map(getPokemonDetail))  // Aqui estamos coletando todas as urls que contém os detalhes dos pokemons e fazendo as requisições 
        .then((detailRequest) => Promise.all(detailRequest)) // Esperando que todas as requisições sejam concluídas
        .then((pokemonDetails) => {
            console.log(pokemonDetails)
            return pokemonDetails.map(pokemonToHTML).join('') // Transformando para o padrão do nosso html
        })
        .then((pokemonsdetalhados) => listPokemons.innerHTML += pokemonsdetalhados) // Adicionando ao html
        .catch((error) => console.log(error))


}

getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
}

pokemonToHTML = (pokemon) => {
    return `<li class="col">
                <div class="${pokemon.types[0].type.name} pokemon p-3 d-flex flex-column rounded text-white h-100 gap-2 overflow-hidden" data-id="${pokemon.id}">

                    <div class="d-flex flex-column">
                        <span class="number align-self-end opacity-25">#${pokemon.id}</span>
                        <span class="name-pokemon fs-4 fw-bold">${pokemon.name}</span>
                    </div>

                    <div class="details d-flex justify-content-between align-items">
                        <ol class="types list-unstyled mb-0">
                            ${pokemon.types.map((type) => `<li class="type mb-1 border-0 text-center p-2 rounded-pill bg-dark bg-opacity-25"
                                style="font-size: 0.8rem; min-width: 70px;">${type.type.name}</li>`).join('')}
                        </ol>

                        <img src="${pokemon.sprites.other.dream_world.front_default}"
                            alt="${pokemon.name}" class="img-fluid" style="max-height: 80px; width: auto;">
                    </div>
                </div>
            </li>`
}


loadMore.addEventListener('click', () => {
    getPokemons(limit, offset)
    offset += limit
})

listPokemons.addEventListener('click', (event) => {
    const cardClicado = event.target.closest('.pokemon')

    if (!cardClicado) return;

    const pokemonId = cardClicado.dataset.id;

    abrirDetalhesPokemon(pokemonId)
})

const modal = document.getElementById('modal-pokemon')


function abrirDetalhesPokemon(id) {
    console.log("Buscando dados do Pokémon número: " + id);

    let urlPokemon = `https://pokeapi.co/api/v2/pokemon/${id}`
    fetch(urlPokemon)
        .then((response) => response.json())
        .then((pokemon) => {
            modal.innerHTML = getDetails(pokemon)
            const buttonClose = document.getElementById('close-button')
            buttonClose.addEventListener('click', () => modal.close())
        })
        .catch((error) => console.log(error))



    modal.showModal();
}


getDetails = (pokemon) => {
    return `<div class="modal-content">

            <div class="infos-poke d-flex justify-content-between">
                <div>
                    <h1 class="name-pokemon">${pokemon.name}</h1>
                    <ul class="types-pokemon d-flex gap-3 list-unstyled">
                        ${pokemon.types.map((type) => `<li class="type mb-1 border-0 text-center p-2 rounded-pill bg-dark bg-opacity-25"
                                >${type.type.name}</li>`).join('')}
                    </ul>
                </div>

                <span class="id">#${pokemon.id}</span>
            </div>

            <img src="${pokemon.sprites.other.dream_world.front_default}"
                alt="${pokemon.name}" class="img-fluid mb-4">

            <ul class="stats d-flex flex-column justify-content-center align-items-start p-0">

               

                ${pokemon.stats.map((stat) => `<div class="stat d-flex align-items-center gap-3">
                    <span class="name-stat">${stat.stat.name}</span>
                    <span><b>${stat.base_stat} </b></span>
                    <progress value="${stat.base_stat}" max="255"></progress>
                </div>`).join('')}


            </ul>

        </div>

        <button id="close-button" class="p-2 rounded-pill bg-transparent">Fechar</button>`
}




