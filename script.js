import { Grid } from "./Grid.js";
import { Player } from "./Player.js";

/**********
    Qwixx is a boardgame created by Steffen Benndorf and illustrated by O. & S. Freudenreich.
    This flawed web version is the work of Julie Boissière-Vasseur, as part of webdevelopment studies.
    Project started sometime in 2022. It was last updated on May 2025
**********/

"use strict"

// Variables
    // Data
    const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6  

    // File names
    const allTimeBestScoreFile = "scores.json";
    const todayBestScoreFileFile = "todayscores.json";
    
    // From HTML
    let bestScoreList = document.getElementById("bestScoreList");
    let todayBestScoreList = document.getElementById("todayBestScoreList");
    let nameToSend = document.querySelector('input[name="name"]');
    let scoreToSend = document.querySelector('input[name="score"]');

    const displayDiceZone = document.getElementById("displayDice");
    const messageZone = document.getElementById("messageZone");
    const button = document.getElementById("rollDiceButton");

    // Initialize data
    let diceArray = [], allSums = [];
    let lineClosed = 0, points = 0;
    let rowIndex;
    messageZone.innerHTML = "To start the game, please click on the Roll button";

    // Declaration
    let cellClassName;

// Build player
const player = new Player(
    0, // id
    true, // isMain
    [0, 0, 0, 0, 0], // nb of crossed cell per line 
    { 
        "cellMove1": { cell: null, class: null },
        "cellMove2": { cell: null, class: null }
    }
);

// Build grid
const grid = new Grid("classicGrid");
displayDiceZone.insertAdjacentElement("afterend", grid.generateGrid());

  // TODO: update for multiplayer
  const allTableCells = Array.from(document.querySelectorAll("#playerSheet0 td"));
  const minus5Line = Array.from(allTableCells.slice(-4));   

  // Variables from created grids
  const playerNamesZone = () => {
    let array = [];
    for (let i = 0; i < 5; i++) {
        let element = document.getElementById(`playerName${i}`);
        if (element) { array.push(element) }
    }
    return array;
  }    

// Player name management
    // Restore player's names with last game
    if (sessionStorage.getItem("autosave")) {
        playerNamesZone().forEach((item, index) => { item.innerHTML = JSON.parse(sessionStorage.getItem("autosave"))[index] });
    }

    // Allow players to edit name
    playerNamesZone().forEach((item) => { 
        item.addEventListener("click", () => { 
            item.innerHTML = "" })
    })

// Best scores management
    function fetchScores(calledBy, file = 0) {
        fetch(new Request(file), { cache: "no-cache" })
        .then((response) => response.json())
        .then((data) => {
            calledBy == "display" ? displayBestScore(data, file) : verifyIfBestScore(data);
        })
        .catch(console.error);
    }

    function displayBestScore(data = null, file) {
        for (let item of data) {
            let listItem = document.createElement("li");
            listItem.appendChild(document.createElement("strong")).textContent = item.name;
            listItem.append(` : ${item.score} points`);
            file == allTimeBestScoreFile ? bestScoreList.appendChild(listItem) : todayBestScoreList.appendChild(listItem);
        }
    }

    function verifyIfBestScore(data) {
        for (let item of data) {
            if (points >= item.score) {
                sendBestScore();
                break;
            }
        }
    }

    function sendBestScore() {
        // toggle show / hidden class for the button (input fields remain hidden)
        document.getElementById("congrats").className = "show";

        // update form values
        nameToSend.value = playerNamesZone()[0];
        scoreToSend.value = points;
    }

    document.onreadystatechange = function(){ 
        if (document.readyState === "complete") { 
            // All time best scores
            bestScoreList.innerHTML = "";
            fetchScores("display", allTimeBestScoreFile);

            // Today best scores
            todayBestScoreList.innerHTML = "";
            fetchScores("display", todayBestScoreFileFile);
        }
    };    

// Functions
    // Start game
    button.addEventListener('click', newTurn);

    // Begin new turn
    function newTurn() {
        // Reset data
        diceArray = [];
        allSums = [];
        messageZone.innerHTML = "";
        player.reset_moves();

        // Call functions
        clearClass("allowedCell");
        clearClass("allowCellColorLine");
        pastIsPast();
        rollDice();
        disableButton();
    }

    // End game
    function askForEndOfGame() {
        // Game can end if two lines are closed or 4 negative cells are checked
        if (lineClosed == 2 || player.nbCC[4] == 4) {
            // If so, change button text and function called onclick
            button.innerHTML = "End game?";
            button.addEventListener('click', endGame);
        }

        // Roll back in case cell is unchecked
        else {
            button.innerHTML = "Roll";
            button.addEventListener('click', newTurn);
        }
    };

    function endGame() {
        // Clean-up
        disableButton();
        clearClass("allowedCell")
        clearClass("allowCellColorLine");
        displayDiceZone.innerText = "";

        // Getting points and player name
        points = countPoints(player.nbCC);
        let playerName = saveNameToSessionStorage();

        // Displaying end of game message
        function addS(points) {
            return points > 1 || points < -1 ? 's' : '';
        }

        messageZone.innerHTML = 'End of game! ' + playerName + ', you have ' + points + ' point' + addS(points) + '. <a href="index.php">Start again</a>?';

        // Is it one of the best scores?
        fetchScores("verify", allTimeBestScoreFile);
        fetchScores("verify", todayBestScoreFileFile);
    }

    function saveNameToSessionStorage() {
        let namesToSave = [];

        playerNamesZone().forEach((item) => { 
            namesToSave.push(item.innerText);
        })

        sessionStorage.setItem("autosave", JSON.stringify({ ...namesToSave}));

        return playerNamesZone()[0].innerText; // TODO: update for multiplayer approach
    }

    // Disable / enable Roll dice button
    function disableButton() {
        button.setAttribute("disabled", "");
    }

    function enableButton() {
        button.removeAttribute("disabled");
    }

    // Dice related functions
    function rollDie() {
        let min = Math.ceil(1);
        let max = Math.floor(6);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function rollDice() {
        for (let i = 0; i < 6; i++) {
            diceArray.push(rollDie());
        };

        displayDice(diceArray);

        sumDice(diceArray);

        return diceArray;
    }

    function displayDice(diceArray) {
        displayDiceZone.innerHTML = "";
        displayDiceZone.innerHTML += '<span class="black">' + diceCharList[diceArray[0] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="black">' + diceCharList[diceArray[1] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="red">' + diceCharList[diceArray[2] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="yellow">' + diceCharList[diceArray[3] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="green">' + diceCharList[diceArray[4] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="blue">' + diceCharList[diceArray[5] - 1] + '</span> ';
    }

    function sumDice(diceArray) {
        for (let i = 1; i < 6; i++) {
            allSums.push(diceArray[0] + diceArray[i]);
        };
        for (let i = 1; i < 5; i++) {
            allSums.push(diceArray[1] + diceArray[i + 1]);
        };

        showAllowedCell();
        displayMinusFiveCell();

        return allSums
    }

    // Functions that display possible moves
    function displayMinusFiveCell() {
        for (let i = 0; i < minus5Line.length; i++) {
            if (minus5Line[i].className == "minus5") {
                break;
            }

            else if (minus5Line[i].className == "") {
                minus5Line[i].classList.add("minus5");
                break;
            }
        }
    }

    function showAllowedCell() {
    // Applies allowedCell or allowCellColorLine class for the full table
        for (let i = 0; i < allTableCells.length; i++) {
            if (rule05(allTableCells[i])) {
                if (rule01(allTableCells[i])) {
                    allTableCells[i].classList.add("allowedCell");
                }

                if (rule02(allTableCells[i])) {
                    allTableCells[i].classList.add("allowCellColorLine");
                }
            }
        }
    }       

    // Function that clears provided className throughout the full grid
    function clearClass(className) {
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].classList.contains(className)) {
                    allTableCells[i].classList.remove(className);
                }
        }
    }

    // Function that changes checkCell class to permanentCheckCell class so past cannot be changed (called on a new turn)
    function pastIsPast() {
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].className == "checkCell") {
                    allTableCells[i].classList.remove("checkCell");
                    allTableCells[i].classList.add("permanentCheckCell");
                }
            }
    }

    // Function that returns true if checkCell class is found within the grid
    function checkCellFound() {
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].className == "checkCell") {
                return true;
            }
        }
    }

    // Function that removes allowedCell class situation at the right in same row
    function removeAllowedCellInRow(cell) {
        let cellIndex = cell.cellIndex;
        let cellRow = cell.parentElement;

        for (let i = cellIndex; i < 10; i++) {
                if (cellRow.children[i].className == "allowedCell") {
                   if (i > cellIndex && i != -1) {
                    cellRow.children[i].classList.remove("allowedCell");
                }
            }
        }
    }

    // Function that counts number of checkCell class within the grid
    function nbOfCheckCellFound() {
        let nbOfCheckCellFound = 0;
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].className == "checkCell") {
                nbOfCheckCellFound ++;
            }
        }
        return nbOfCheckCellFound;
    }

    // "Check a cell" function
    function check(cell, rowIndex) {

        // Uncheck
        if (cell.classList == "checkCell") {

            if (cellClassName == "minus5") {
                showAllowedCell();
                cell.classList.add("minus5");
            }

            else if (cell == player.moves.cellMove1.cell) {
                cell.className = player.moves.cellMove1.class;

                if (player.moves.cellMove1.class == "allowedCell") {
                    showAllowedCell();
                }

                else if (player.moves.cellMove1.class == "allowCellColorLine") {
                    showAllowedCell();
                }

                // Clear up
                player.moves.cellMove1.cell = null;
                player.moves.cellMove1.class = null;
            }

            else if (cell == player.moves.cellMove2.cell) {
                cell.className = player.moves.cellMove2.class;

                if (player.moves.cellMove2.class == "allowedCell") {
                    showAllowedCell();
                }

                else if (player.moves.cellMove2.class == "allowCellColorLine") {
                    showAllowedCell();
                }

                // Clear up
                player.moves.cellMove2.cell = null;
                player.moves.cellMove2.class = null;
            }

            // One of recorded class is "both"? Dislay again all results
            if (player.moves.cellMove1.class == "allowedCell allowCellColorLine" || player.moves.cellMove2.class == "allowedCell allowCellColorLine") {
                showAllowedCell();
            }

            cell.classList.remove("checkCell");
            deadCell(cell);

            // Disable and button and display -5 cell only if there's no checkCell on the entire table
            checkCellFound() ? null : disableButton();
            checkCellFound() ? null : displayMinusFiveCell();
            checkCellFound() ? null : showAllowedCell();

            // Last cell of a line?
            if (isLastCell(cell) && rule04(cell)) {
                lineClosed -= 1;
            }

        }

        // Check
            // Check - 5
            else if (cell.classList  == "minus5") {
                clearClass("allowedCell");
                clearClass("allowCellColorLine");

                cell.classList.remove("minus5");
                cell.classList.add("checkCell");

                cellClassName = "minus5"

                enableButton()
            }

            // Check on main grid
            else if (cell.classList == "allowedCell" || cell.classList == "allowCellColorLine" || cell.classList == "allowedCell allowCellColorLine") {

                // Verify wether nb of checked cell per line is at least 5 before checking last cell
                if (isLastCell(cell) && !rule04(cell)) {
                    messageZone.innerHTML = "Sorry but at least 5 cells should be checked on this line before selecting this cell.";
                    player.nbCC[rowIndex] += 1; // To compensate the minus 1 at the end of this function
                }

                // Otherwise, check
                else {

                    // TO-DO: could be simplified I guess, there's some copy paste here
                    // Last cell of a line?
                    if (isLastCell(cell) && rule04(cell)) {
                        lineClosed += 1;
                    }

                    if (cell.classList == "allowedCell") {
                        clearClass("allowedCell");

                        if (nbOfCheckCellFound() == 0) {
                            player.moves.cellMove1.cell = cell
                            player.moves.cellMove1.class = "allowedCell";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            player.moves.cellMove2.cell = cell
                            player.moves.cellMove2.class = "allowedCell";
                        }
                    }

                    else if (cell.classList == "allowCellColorLine") {
                        clearClass("allowCellColorLine");

                        // Remove allowedCell if any at the right in the same line
                        removeAllowedCellInRow(cell)

                        if (nbOfCheckCellFound() == 0) {
                            player.moves.cellMove1.cell = cell
                            player.moves.cellMove1.class = "allowCellColorLine";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            player.moves.cellMove2.cell = cell
                            player.moves.cellMove2.class = "allowCellColorLine";
                        }
                    }

                    else if (cell.classList == "allowedCell allowCellColorLine") {
                        cell.classList.remove("allowedCell");
                        cell.classList.remove("allowCellColorLine");

                        if (nbOfCheckCellFound() == 0) {
                            player.moves.cellMove1.cell = cell
                            player.moves.cellMove1.class = "allowedCell allowCellColorLine";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            player.moves.cellMove2.cell = cell
                            player.moves.cellMove2.class = "allowedCell allowCellColorLine";
                        }
                    }

                    clearClass("minus5");
                    cell.classList.add("checkCell");
                    deadCell(cell);
                    enableButton();
                }
            }
            
            player.update_nbCC(player.nbCC, rowIndex, cell.className);
    }

    // Function that apply or remove deadCell class to previous cells in a row where a cell is checked. Called after each check or uncheck.
    function deadCell(cell) {
        let cellIndex = cell.cellIndex;
        let cellRow = cell.parentElement;
        let beginArray = 0;
        let previousCellsInRow = [];

        // Building the previousCellsInRow array to apply or unapply deadCell class to previous cells
            // Beginning of the array should correspond to first previous cell in row having checkCell class or permanentCheckCell (else i 0)
            for (let i = cellIndex - 1; i > 0; i--) {
                if (cellRow.children[i].className == "checkCell" || cellRow.children[i].className == "permanentCheckCell") {
                    beginArray = i;
                    break;
                }
            }

            // End of the array should be the cellIndex
            for (let i = beginArray; i < cellIndex; i++) {
                previousCellsInRow.push(cellRow.children[i]);
            }

        // Apply or unapply deadCell class to the array
        if (cell.className == "checkCell" && cellRow.rowIndex != 5) { // Check case
            for (let i = 0; i < previousCellsInRow.length; i++) {
                if (previousCellsInRow[i].className != "checkCell" && previousCellsInRow[i].className != "permanentCheckCell") {
                    previousCellsInRow[i].classList.add("deadCell");
                }
            }
        }

        else { // Uncheck case
            for (let i = 0; i < previousCellsInRow.length; i++) {
                if (previousCellsInRow[i].classList.contains("deadCell")) {
                    previousCellsInRow[i].classList.remove("deadCell");
                }
            }

            // In case uncheck is left from another checkCell in same row
            if (cellRow.rowIndex != 5) {
                for (let i = cell.cellIndex; i < 11; i++) {
                    if (cellRow.children[i].className == "checkCell") { // Flag for checkCell class in row

                        cell.classList.add("deadCell"); // Add deadCell class to unchecked cell

                        for (let j = 0; j < previousCellsInRow.length; j++) { // And add it also for all cells in row preceding
                            if(previousCellsInRow[j].className != "permanentCheckCell") {
                                previousCellsInRow[j].classList.add("deadCell");
                            }
                        }
                    }
                }
            }
        }
    }

    // Function that count points
    function countPoints(nbCC_array) {
        let pointsArray = [0, 0, 0, 0, 0];

        for (let i = 0; i < nbCC_array.length - 1; i++) { // For each line
            for (let j = 0; j < nbCC_array[i] + 1; j++) { // Add the number to the previous until the value in the index is reached
                pointsArray[i] = pointsArray[i] += j;
            }
        }

        // And for last line of the grid
        for (let k = 0; k < nbCC_array[4] ; k++) { // Add the number to the previous until the value in the index is reached
            pointsArray[4] = pointsArray[4] -= 5;
        }

        // Let's sum up all these
        let sum = 0;
        for (let i = 0; i < pointsArray.length; i++) {
            sum += pointsArray[i];
        }

        return sum;
    }

    // Game loop
        for (let cell of allTableCells) {

            // If player clicks on a cell (don't listen to the blank one)
            if (!cell.hasAttribute("colspan")) {

                cell.addEventListener("click", function() {

                    // Update variable value for row information
                    rowIndex = cell.parentElement.rowIndex;

                    // Apply CSS class and calculate points
                    check(cell, rowIndex);

                    // When number of checkCell is exactly 2, clear out remaining dislay sum classes (could be a remaining because of the cells having 2 classes and we don't know which one is selected
                    nbOfCheckCellFound() == 2 ? clearClass("allowedCell") : null;
                    nbOfCheckCellFound() == 2 ? clearClass("allowCellColorLine") : null;

                    // Last cell of a line? Let's have another round of updating the number of checked cell per line array
                    if (isLastCell(cell) && rule04(cell)) {
                        player.update_nbCC(player.nbCC, rowIndex, cell.className);
                    }

                    // End of game?
                    askForEndOfGame();
                });
            }
        }


/*** Multiple grid and multiple players approach ***/
  const setGame = () => {
    const nbOfPlayers = Number(document.getElementById("nbofplayers").value);
    const gridSelected = document.getElementById("gridtype").value;
    
    // generate a grid for each player  
    for (i = 0; i < nbOfPlayers; i++) {
      generateGrid(gridSelected, i);
    }
  }
  
  /*** Rules ***/

  /** Basic rules package **/
  // Rule 01 | Cross white dice sum cell
    const rule01 = cell => allSums[0] === Number(cell.innerText);

  // Rule 02 | Cross color dice sum cell
    const rule02 = cell => {
        const cellNumber = Number(cell.innerText);
        switch(cell.parentElement.className) {
            case "redbg":
                return cellNumber === allSums[1] || cellNumber === allSums[5];
            case "yellowbg":
                return cellNumber === allSums[2] || cellNumber === allSums[6];
            case "greenbg":
                return cellNumber === allSums[3] || cellNumber === allSums[7];
            case "bluebg":
                return cellNumber === allSums[4] || cellNumber === allSums[8];
            default: 
                return false;
        }
    }

  // Rule 03 | Cross from left to right
    const rule03 = cell => {
        let checkedList = "";

        // Get list of cells already checked
        checkedList = Array.from(cell.parentElement.cells).filter( (item) => 
               item.classList.contains("permanentCheckCell") 
            || item.classList.contains("checkCell") 
            && item != cell
        );

        // Get indexes of those cells
        checkedList.forEach( (item, index) => { checkedList[index] = item.cellIndex } );

        // Compare indexes. Last one from the checkedList is the highest
        return checkedList.length > 0 ? cell.cellIndex > checkedList[checkedList.length - 1] : true;
    }
  
  // Rule 04 | Cross last cell of a line
    const rule04 = cell => {
        // Count if at least 5 cells are already checked
        return Array.from(cell.parentElement.cells).filter( (item) => 
            item.classList.contains("permanentCheckCell") 
            || item.classList.contains("checkCell") 
            && item != cell).length >= 5 ? true : false;
    }

    // Rule 05 | Cross a free cell
    const rule05 = cell => {
        return !Array.from(cell.classList).some((elem) => { return elem == "deadCell" || elem == "permanentCheckCell"})
    }

    const isLastCell = cell => { return !Boolean(cell.nextSibling) };