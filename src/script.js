document.addEventListener("DOMContentLoaded", () => {
  const carouselInner = document.querySelector(".carousel-inner");

  const fetchAndRenderCharacters = async () => {
    try {
      const response = await fetch("https://rickandmortyapi.com/api/character?page=1");
      const data = await response.json();
      const characters = data.results.slice(0, 30); 


      carouselInner.innerHTML = "";

      // Media Queries
      const isMobile = window.innerWidth < 768;
      let currentItem = document.createElement("div");
      currentItem.className = "carousel-item active";
      currentItem.innerHTML = `<div class="row"></div>`;
      carouselInner.appendChild(currentItem);

      characters.forEach((char, index) => {
        const charCard = `
          <div class="col-12 col-md-4 ">
            <div class="card "  style="cursor: pointer;">
              <img src="${char.image}" class="card-img-top" alt="${char.name}" data-bs-toggle="modal" data-bs-target="#characterModal" data-character-id="${char.id}">
              <div class="card-body text-center text-truncate">
                <h5 class="card-title">${char.name}</h5>
                <p class="card-text">${char.species}</p>
              </div>
            </div>
          </div>
        `;

        const row = currentItem.querySelector(".row");
        row.innerHTML += charCard;

       
        const itemsPerSlide = isMobile ? 1 : 3;
        if ((index + 1) % itemsPerSlide === 0 && index + 1 < characters.length) {
          currentItem = document.createElement("div");
          currentItem.className = "carousel-item";
          currentItem.innerHTML = `<div class="row"></div>`;
          carouselInner.appendChild(currentItem);
        }
      });


      const characterImages = document.querySelectorAll('[data-bs-toggle="modal"]');
      characterImages.forEach(image => {
        image.addEventListener("click", async (event) => {
          const characterId = event.target.getAttribute("data-character-id");
          const characterData = await fetchCharacterDetails(characterId);
          displayCharacterDetails(characterData);
        });
      });

    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  // Details api rest
  const fetchCharacterDetails = async (characterId) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching character details:", error);
    }
  };

  // Show on modal
  const displayCharacterDetails = (character) => {
    const modalContent = document.getElementById("modalCharacterDetails");
    modalContent.innerHTML = `
      <h4>${character.name}</h4>
      <p><strong>Especie:</strong> ${character.species}</p>
      <p><strong>Estado:</strong> ${character.status}</p>
      <p><strong>Género:</strong> ${character.gender}</p>
      <p><strong>Origen:</strong> ${character.origin.name}</p>
      <img src="${character.image}" class="img-fluid" alt="${character.name}">
    `;
  };


  fetchAndRenderCharacters();

  // Dinamic Responsive
  window.addEventListener("resize", () => {
    fetchAndRenderCharacters();
  });
});
