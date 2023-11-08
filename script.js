const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ftb-mt-web-pt";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

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
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // Refresh after adding a new player
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
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
    // Refresh after removing a player
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    let playerContainerHTML = "";
    playerList.forEach((player) => {
      const playerCard = document.createElement("div");
      playerCard.classList.add("player-card");
      playerCard.innerHTML = `
        <h3>${player.name}</h3>
        <p>Position: ${player.position}</p>
        <button id="details-${player.id}">See details</button>
        <button id="remove-${player.id}">Remove from roster</button>
      `;
      playerContainer.appendChild(playerCard);

      document
        .getElementById(`details-btn-${player.id}`)
        .addEventListener("click", () => fetchSinglePlayer(player.id));
      document
        .getElementById(`remove-btn-${player.id}`)
        .addEventListener("click", () => removePlayer(player.id));
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
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
    });
};

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  } catch (err) {
    console.error("Initialization failed!", err);
  }
};

// Call the init function when the script loads
init();
