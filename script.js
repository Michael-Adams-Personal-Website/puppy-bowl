const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const cohortName = "2308-ftb-mt-web-pt";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}${playerId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const playerDetails = await response.json();
    // Handle playerDetails (e.g., display them on the webpage)
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL, {
      // Make sure APIURL is the correct endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Fetch the updated list of players after adding a new one
    const updatedPlayers = await fetchAllPlayers();
    if (updatedPlayers && updatedPlayers.data && updatedPlayers.data.players) {
      // Pass the updated list of players to the render function
      renderAllPlayers(updatedPlayers.data.players);
    } else {
      throw new Error("Failed to fetch updated player list.");
    }
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}${playerId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const playerData = await fetchAllPlayers(); // This line fetches the updated player list
    renderAllPlayers(playerData.data.players); // Use the fetched player list to re-render the UI
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

const renderAllPlayers = (playerList) => {
  try {
    playerContainer.innerHTML = ""; // Clear the container before adding new player cards
    playerList.forEach((player) => {
      const playerCard = document.createElement("div");
      playerCard.classList.add("player-card");
      playerCard.innerHTML = `
        <h3>${player.name}</h3>
        <img class="player-image" src="${player.imageUrl}" alt="${player.name}" />
        <div id="details-container-${player.id}" class="player-details" style="display: none;">
        <p>Name: ${player.name}</p>
        <p>Breed: ${player.breed}</p>
          <p>Status: ${player.status}</p>
        </div>
        <button id="details-button-${player.id}">See details</button>
        <button id="remove-${player.id}">Remove from roster</button>
      `;
      playerContainer.appendChild(playerCard);

      document
        .getElementById(`details-button-${player.id}`)
        .addEventListener("click", () => togglePlayerDetails(player.id));
      document
        .getElementById(`remove-${player.id}`)
        .addEventListener("click", () => removePlayer(player.id));
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const togglePlayerDetails = (playerId) => {
  const detailsContainer = document.getElementById(
    `details-container-${playerId}`
  );
  const button = document.getElementById(`details-button-${playerId}`);
  if (detailsContainer.style.display === "none") {
    detailsContainer.style.display = "block";
    button.textContent = "Hide details";
  } else {
    detailsContainer.style.display = "none";
    button.textContent = "See details";
  }
};

const renderNewPlayerForm = () => {
  newPlayerFormContainer.innerHTML = `
    <form id="new-player-form">
      <input type="text" id="player-name" placeholder="Player's name" required />
      <input type="text" id="player-position" placeholder="Player's position" required />
      <button type="submit">Add Player</button>
    </form>
  `;

  document
    .getElementById("new-player-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const playerName = document.getElementById("player-name").value;
      const playerPosition = document.getElementById("player-position").value;
      await addNewPlayer({ name: playerName, position: playerPosition });
      document.getElementById("player-name").value = ""; // Clear the input after submitting
      document.getElementById("player-position").value = ""; // Clear the input after submitting
    });
};

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players.data.players); // Assuming the API returns an object with a data property containing a players array
    renderNewPlayerForm();
  } catch (err) {
    console.error("Initialization failed!", err);
  }
};

init();
