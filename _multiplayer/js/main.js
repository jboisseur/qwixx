import { Grid } from "./Grid.js";
import { Dice } from "./Dice.js";

/********************
 * New Game
********************/
const setGame = (event) => {
    event.preventDefault();
    setGrids();
    setDice();
    document.getElementById("new-game").remove();
}

const setGrids = () => {
    const nbOfPlayers = Number(document.getElementById("nbOfPlayers").value);
    const gridSelected = document.getElementById("gridtype").value;

    // Generate a grid for each player  
    for (let i = 0; i < nbOfPlayers; i++) {
        let grid = new Grid(gridSelected);
        grid.generateGrid(i);
    }
}

const setDice = () => {
    Dice.createRollingZone();
    const rollButton = Dice.createRollButton();
    Dice.createDiceZone();

    // TODO move to Game Loop
    let diceArray = rollButton.addEventListener("click", () => { Dice.rollDice(diceArray) });
}

const form = document.getElementById("gameSetup");
form.addEventListener("submit", setGame);

const grids = Array.from(document.querySelectorAll('[id^="playerSheet"]'));

/********************
 * Game Loop
********************/
for (let grid of grids) {

    for (let cell of grid) {

        cell.addEventListener("click", function() {

            cell.classList.add("cross");

        });

    }
}