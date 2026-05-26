const pokedexGrid = document.getElementById('pokedex-grid');

const fetchPokedex = async () => {
    try {
        // Fetch the original 151 Pokemon
        const url = `https://pokeapi.co/api/v2/pokemon?limit=151`;
        const res = await fetch(url);
        const data = await res.json();

        data.results.forEach((poke, index) => {
            const pokeId = index + 1; // API index starts at 0, Pokemon IDs start at 1
            const card = document.createElement('div');
            card.className = 'poke-card';

            // Fetches the high-quality official artwork
            const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;

            // Formats the ID number to be 3 digits (e.g., 001, 025, 150)
            const formattedId = pokeId.toString().padStart(3, '0');

            card.innerHTML = `
                <div class="poke-number">#${formattedId}</div>
                <img src="${imgUrl}" alt="${poke.name}" />
                <h3>${poke.name}</h3>
            `;

            pokedexGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load Pokédex:", error);
        pokedexGrid.innerHTML = `<p>Error loading Pokédex. Please check your connection.</p>`;
    }
};

// Build the grid when the page loads
fetchPokedex();