/**********
    Qwixx is a boardgame created by Steffen Benndorf and illustrated by O. & S. Freudenreich.
    This flawed web version is the work of Julie Boissière-Vasseur, as part of webdevelopment studies.
    Project started sometime in 2022. It was last updated on November 2024
**********/

"use strict"

// Variables
const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6

const gridType = [
    {
      name: "classicGrid",
      architecture: [
          { numbers: "2,3,4,5,6,7,8,9,10,11,12", color: "red" },
          { numbers: "2,3,4,5,6,7,8,9,10,11,12", color: "yellow" },
          { numbers: "12,11,10,9,8,7,6,5,4,3,2", color: "green" },
          { numbers: "12,11,10,9,8,7,6,5,4,3,2", color: "blue" }      
      ],
      rules: [basicRules]
    }
  ]

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
    let nbOfCheckedCellPerLine = [0, 0, 0, 0, 0], pointsArray = [0, 0, 0, 0, 0], diceArray = [], allSums = [];
    let cellMove1 = {cell: null, class: null}, cellMove2 = {cell: null, class: null};
    let lineClosed = 0, points = 0;
    let playerName, rowIndex;
    messageZone.innerHTML = "To start the game, please click on the Roll button";

    // Declaration
    let cellClassName, rowOfCell;

// Build grid
const generateGrid = (gridSelected, playerSheetNumber) => {
    // getData
    const gridTypeIndex = gridType.findIndex((element) => element.name == gridSelected);
    const data = gridType[gridTypeIndex].architecture;
    
    // Create table
    const grid = document.createElement("table");
    grid.setAttribute("id", `playerSheet`)
    displayDiceZone.insertAdjacentElement("afterend", grid);

    // Create table head
    const tableHeader = grid.createTHead();
    grid.insertRow();
    const th = document.createElement("th");
    th.setAttribute("scope", "colgroup");
    th.setAttribute("colspan", "11");
    th.setAttribute("contenteditable", "true");
    th.setAttribute("id", "playerName");
    th.textContent = "Enter your name"
    tableHeader.appendChild(th);
    
    // Create rows
    data.forEach( () => grid.insertRow());
    const rows = grid.rows;
    
    // Create and populate cells for each row
    for (let i = 0; i < rows.length - 1; i++) {
      const row = data[i].numbers.split(",");
      row.forEach( (item, index) => {
        // add row background color
        rows[i].setAttribute("class", `${data[i].color}bg`);
        // add cell
        rows[i].insertCell();
        const cell = rows[i].cells[index];
        // add number
        cell.innerHTML = item;
        // add color cell.style.backgroundColor = `var(--${data[i].color})`;
      })
    }

    // Add malus row
    grid.insertRow();
    const lastRowIndex = rows.length - 1;
    rows[lastRowIndex].insertCell();
    rows[lastRowIndex].cells[0].setAttribute("colspan", "7");

    for (let i = 1; i < 5; i++) {
        rows[lastRowIndex].insertCell();
        rows[lastRowIndex].cells[i].innerHTML = "-5";
    }                       
  }

  generateGrid('classicGrid', 0);

  // Variables from created grid
  const playerNameZone = document.getElementById("playerName");
  const allTableCells = Array.from(document.querySelectorAll("#playerSheet td"));

          // Slicing the table
          const minus5Line = allTableCells.slice(45, 50);
          const redLine = allTableCells.slice(0, 11);
          const yellowLine = allTableCells.slice(11, 22);
          const greenLine = allTableCells.slice(22, 33);
          const blueLine = allTableCells.slice(33, 44);
  

// Player name management
    // Restore player's name with last game
    if (sessionStorage.getItem("autosave")) {
        playerNameZone.innerHTML = sessionStorage.getItem("autosave");
    }

    // Allow player to edit name
    playerNameZone.addEventListener("click", () => {
        playerNameZone.innerHTML = "";
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
        nameToSend.value = playerName;
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
    // Begin new turn
    function newTurn() {
        // Reset data
        diceArray = [];
        allSums = [];
        messageZone.innerHTML = "";
        cellMove1.cell = null;
        cellMove1.class = null;
        cellMove2.cell = null;
        cellMove2.class = null;

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
        if (lineClosed == 2 || nbOfCheckedCellPerLine[4] == 4) {
            // If so, change button text and function called onclick
            button.innerHTML = "End game?";
            button.setAttribute("onclick", "endGame()");
        }

        // Roll back in case cell is unchecked
        else {
            button.innerHTML = "Roll";
            button.setAttribute("onclick", "newTurn()");
        }
    };

    function endGame() {
        // Clean-up
        disableButton();
        clearClass("allowedCell")
        clearClass("allowCellColorLine");
        displayDiceZone.innerText = "";

        // Getting points and player name
        points = countPoints(nbOfCheckedCellPerLine);
        saveNameToSessionStorage();

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
        playerName = playerNameZone.innerText;
        sessionStorage.setItem("autosave", playerName);
        return playerName;
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

        whiteDiceSum(allSums);
        colorDiceSum(allSums);
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

    function whiteDiceSum(allSums) {
    // Applies allowedCell class for the full table for white dice sum
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].innerText == allSums[0]) {
                if (allTableCells[i].className == "") {
                    allTableCells[i].classList.add("allowedCell");
                }
            }
        }
    }

    function colorDiceSum(allSums) {
    // Let's apply allowCellColorLine per line
    // TO-DO: to avoid loop repetition, this could be transformed into a function with allSums array indexes and slicing from and to as arguments
        for (let i = 0; i < redLine.length; i++) {
            if (redLine[i].innerText == allSums[1] || redLine[i].innerText == allSums[5]) {
                    if (redLine[i].classList == "" || redLine[i].classList.contains("allowedCell")) {
                        redLine[i].classList.add("allowCellColorLine");
                    }
            }
        }

        for (let i = 0; i < yellowLine.length; i++) {
            if (yellowLine[i].innerText == allSums[2] || yellowLine[i].innerText == allSums[6]) {
                if (yellowLine[i].classList == "" || yellowLine[i].classList.contains("allowedCell")) {
                    yellowLine[i].classList.add("allowCellColorLine");
                }
            }
        }

        for (let i = 0; i < greenLine.length; i++) {
            if (greenLine[i].innerText == allSums[3] || greenLine[i].innerText == allSums[7]) {
                if (greenLine[i].classList == "" || greenLine[i].classList.contains("allowedCell")) {
                    greenLine[i].classList.add("allowCellColorLine");
                }
            }
        }

        for (let i = 0; i < blueLine.length; i++) {
            if (blueLine[i].innerText == allSums[4] || blueLine[i].innerText == allSums[8]) {
                if (blueLine[i].classList == "" || blueLine[i].classList.contains("allowedCell")) {
                    blueLine[i].classList.add("allowCellColorLine");
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
                whiteDiceSum(allSums);
                colorDiceSum(allSums);
                cell.classList.add("minus5");
            }

            else if (cell == cellMove1.cell) {
                cell.className = cellMove1.class;

                if (cellMove1.class == "allowedCell") {
                    whiteDiceSum(allSums);
                }

                else if (cellMove1.class == "allowCellColorLine") {
                    colorDiceSum(allSums);
                    whiteDiceSum(allSums);
                }

                // Clear up
                cellMove1.cell = null;
                cellMove1.class = null;
            }

            else if (cell == cellMove2.cell) {
                cell.className = cellMove2.class;

                if (cellMove2.class == "allowedCell") {
                    whiteDiceSum(allSums);
                }

                else if (cellMove2.class == "allowCellColorLine") {
                    colorDiceSum(allSums);
                }

                // Clear up
                cellMove2.cell = null;
                cellMove2.class = null;
            }

            // One of recorded class is "both"? Dislay again all results
            if (cellMove1.class == "allowedCell allowCellColorLine" || cellMove2.class == "allowedCell allowCellColorLine") {
                whiteDiceSum(allSums);
                colorDiceSum(allSums);
            }

            cell.classList.remove("checkCell");
            deadCell(cell);

            // Disable and button and display -5 cell only if there's no checkCell on the entire table
            checkCellFound() ? null : disableButton();
            checkCellFound() ? null : displayMinusFiveCell();
            checkCellFound() ? null : whiteDiceSum(allSums);
            checkCellFound() ? null : colorDiceSum(allSums);

            // Last cell of a line?
            if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
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
                if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] < 5) {
                    messageZone.innerHTML = "Sorry but at least 5 cells should be checked on this line before selecting this cell.";
                    nbOfCheckedCellPerLine[rowIndex -1] += 1; // To compensate the minus 1 at the end of this function
                }

                // Otherwise, check
                else {

                    // TO-DO: could be simplified I guess, there's some copy paste here

                    // Last cell of a line?
                    if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
                        lineClosed += 1;
                    }

                    if (cell.classList == "allowedCell") {
                        clearClass("allowedCell");

                        if (nbOfCheckCellFound() == 0) {
                            cellMove1.cell = cell
                            cellMove1.class = "allowedCell";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            cellMove2.cell = cell
                            cellMove2.class = "allowedCell";
                        }
                    }

                    else if (cell.classList == "allowCellColorLine") {
                        clearClass("allowCellColorLine");

                        // Remove allowedCell if any at the right in the same line
                        removeAllowedCellInRow(cell)

                        if (nbOfCheckCellFound() == 0) {
                            cellMove1.cell = cell
                            cellMove1.class = "allowCellColorLine";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            cellMove2.cell = cell
                            cellMove2.class = "allowCellColorLine";
                        }
                    }

                    else if (cell.classList == "allowedCell allowCellColorLine") {
                        cell.classList.remove("allowedCell");
                        cell.classList.remove("allowCellColorLine");

                        if (nbOfCheckCellFound() == 0) {
                            cellMove1.cell = cell
                            cellMove1.class = "allowedCell allowCellColorLine";
                        }

                        else if (nbOfCheckCellFound() == 1) {
                            cellMove2.cell = cell
                            cellMove2.class = "allowedCell allowCellColorLine";
                        }
                    }

                    clearClass("minus5");
                    cell.classList.add("checkCell");
                    deadCell(cell);
                    enableButton();
                }
            }

    updateNbOfCheckedCellPerLineArray(rowIndex, cell.className);
    }

    function updateNbOfCheckedCellPerLineArray(rowIndex, className) {
        if (className == "checkCell") {
            nbOfCheckedCellPerLine[rowIndex -1] += 1;
        }

        else if (className == "allowedCell" || className == "allowCellColorLine" || className == "minus5" || className == "allowedCell allowCellColorLine") {
            nbOfCheckedCellPerLine[rowIndex -1] -= 1;
        }
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

                        cell.classList.add("deadCell"); // Add deadCell class to unchcked cell

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
    function countPoints(nbOfCheckedCellPerLine) {
        for (let i = 0; i < nbOfCheckedCellPerLine.length - 1; i++) { // For each line from the main grid
            for (let j = 0; j < nbOfCheckedCellPerLine[i] + 1; j++) { // Add the number to the previous until the value in the index is reached
                pointsArray[i] = pointsArray[i] += j;
            }
        }

        // And for last line of the grid
        for (let k = 0; k < nbOfCheckedCellPerLine[4] ; k++) { // Add the number to the previous until the value in the index is reached
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
                    rowOfCell = cell.parentElement;
                    rowIndex = rowOfCell.rowIndex;

                    // Apply CSS class and calculate points
                    check(cell, rowIndex);

                    // When number of checkCell is exactly 2, clear out remaining dislay sum classes (could be a remaining because of the cells having 2 classes and we don't know which one is selected
                    nbOfCheckCellFound() == 2 ? clearClass("allowedCell") : null;
                    nbOfCheckCellFound() == 2 ? clearClass("allowCellColorLine") : null;

                    // Last cell of a line? Let's have another round of updating the number of checked cell per line array
                    if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
                        updateNbOfCheckedCellPerLineArray(rowIndex, cell.className)
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
    
    // gather a rule set
  }
  
  /*** Rules ***/

  /** Basic rules package **/
  // Rule 01 | Cross a first cell  
  // Rule 02 | Cross a second cell
  // Rule 03 | Mandatory crossing  
  // Rule 04 | Cross last cell of a line
  
  /*** Player data ***/
  let playerData = {
    playerId: [0, 1], // incremental
    playerName: ["Link", "Zelda"]
  }
  
  /*** Turn data ***/
  let turnData = {
    mainPlayerId: 0, // id of main player
    cellCrossed: false // one value per player 
  }
  
  /*** Game data ***/
  let gameData = {
    closedLine: 0,
    maxMalusCrossed: 0
  }
  