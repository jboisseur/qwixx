/* 
    Qwixx is a boardgame created by Steffen Benndor and illustrated by O. & S. Freudenreich.
    This flawed web version is the work of Julie Boissière-Vasseur, as part of webdevelopment studies.
    Project started sometime in 2022. It was last updated on March 2023
*/

/* 
    TO-DO
    Corner cases spotted
    - When you check 2 cells on the same line and uncheck the leftest: the left cells don't herit from the deadCell class although they should
    - Verify points, there's still something wrong, I believe something to do with checking/unchecking? Unable de reproduce so far

    Version 3
    3a
    - On a same line, cell with class .allowedCell should be left from cell with .allowCellColorLine class
*/

// Variables
const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6

    // From HTML
    const playerNameZone = document.getElementById("playerName");
    const allTableCells = Array.from(document.getElementsByTagName("td"));

        // Slicing the table
        const minus5Line = allTableCells.slice(45, 50);
        const redLine = allTableCells.slice(0, 11);
        const yellowLine = allTableCells.slice(11, 22);
        const greenLine = allTableCells.slice(22, 33);
        const blueLine = allTableCells.slice(33, 44);

    const displayDiceZone = document.getElementById("displayDice");
    const messageZone = document.getElementById("messageZone");
    const button = document.getElementById("rollDiceButton");

    // Initialize data
    let nbOfCheckedCellPerLine = [0, 0, 0, 0, 0], diceArray = [], allSums = [], pointsArray = [0, 0, 0, 0, 0];
    let lineClosed = 0, points = 0, move = 0;
    let playerName;
    messageZone.innerHTML = "To start the game, please click on the Roll dice button";

    // Declare variables
    let cellClassName, rowOfCell, rowClassName;

// Player name management
    // Restore player's name with last game
    if (sessionStorage.getItem("autosave")) {
        playerNameZone.innerHTML = sessionStorage.getItem("autosave");
    } 

    // Allow player to edit name
    playerNameZone.addEventListener("click", () => {
        playerNameZone.innerHTML = "";
    })

// Functions
    // Begin new turn
    function newTurn() {
        // Reset data
        diceArray = [];
        allSums = [];
        move = 0;
        messageZone.innerHTML = "";

        // Call functions
        clearClasses();
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
            button.innerHTML = "Roll dice";
            button.setAttribute("onclick", "newTurn()");  
        }
    }

    function endGame() {
        // Clean-up
        disableButton();
        clearClasses();
        displayDiceZone.innerText = ""; 

        // Getting points and player name
        points = countPoints(nbOfCheckedCellPerLine);
        saveNameToSessionStorage();

        // Displaying end of game message
        messageZone.innerHTML = 'End of game! ' + playerName + ', you have ' + points + ' points. <a href="javascript:window.location.href=window.location.href">Start again</a>?';               
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
        min = Math.ceil(1);
        max = Math.floor(6);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }

    function rollDice() {
        for (i = 0; i < 6; i++) {
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
        for (i = 1; i < 6; i++) {
            allSums.push(diceArray[0] + diceArray[i]);
        };
        for (i = 1; i < 5; i++) {
            allSums.push(diceArray[1] + diceArray[i + 1]);
        };

        displaySums(allSums)
        displayMinusFiveCell(allSums)

        return allSums
    }

    // Functions that display possible moves    
    function displayMinusFiveCell(allSums) {
        for (let i = 0; i < minus5Line.length; i++) {
            if (minus5Line[i].className == "allowedCell") {
                break;
            }

            else if (minus5Line[i].className == "") {
                minus5Line[i].classList.add("allowedCell");
                break;
            }
        }
    }
        
    function displaySums(allSums) {
        // Let's apply allowedCell for the full table for white dice sum
        for (let i = 0; i < allTableCells.length; i++) {
                if (allTableCells[i].innerText == allSums[0]) {
                    if (allTableCells[i].className == "") {
                        allTableCells[i].classList.add("allowedCell");
                    }
                }                    
        }

        // Let's apply allowedCell per line 
        // TODO: to avoid loop repetition, this could be transformed into a function with allSums array indexes and slicing from and to as arguments
        for (let i = 0; i < redLine.length; i++) {
            if (redLine[i].innerText == allSums[1] || redLine[i].innerText == allSums[5]) {
                if (redLine[i].className == "") {
                    redLine[i].classList.add("allowCellColorLine");
                }
            }      
        }

        for (let i = 0; i < yellowLine.length; i++) {
            if (yellowLine[i].innerText == allSums[2] || yellowLine[i].innerText == allSums[6]) {
                if (yellowLine[i].className == "") { 
                    yellowLine[i].classList.add("allowCellColorLine");
                }
            }      
        }

        for (let i = 0; i < greenLine.length; i++) {
            if (greenLine[i].innerText == allSums[3] || greenLine[i].innerText == allSums[7]) {
                if (greenLine[i].className == "") {
                    greenLine[i].classList.add("allowCellColorLine");
                }
            }      
        }

        for (let i = 0; i < blueLine.length; i++) {
            if (blueLine[i].innerText == allSums[4] || blueLine[i].innerText == allSums[8]) {
                if (blueLine[i].className == "") {
                    blueLine[i].classList.add("allowCellColorLine");
                }
            }      
        }
    }

    // Function that clears allowedCell and allowCellColorLine classes (called on a new turn)
    function clearClasses() {
        for (let i = 0; i < allTableCells.length; i++) {
            if (allTableCells[i].className == "allowedCell") {
                    allTableCells[i].classList.remove("allowedCell");
                }
            else if (allTableCells[i].className == "allowCellColorLine") {
                allTableCells[i].classList.remove("allowCellColorLine");
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
    
    // "Check a cell" function (change class and count moves)
    function check(cell, rowIndex) {        

        cellClassName = cell.className;

        // Allow player to uncheck if checked within a turn
        if (cellClassName == "checkCell" && move > 0) {
            cell.classList.remove("checkCell");

            // back to previous state
            if (rowIndex == 5) {
                displayMinusFiveCell(allSums);
            }

            if (rowIndex >= 1 && rowIndex <= 4) {
                displaySums(allSums);
                deadCell(cell);
            }

            if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
                lineClosed -= 1;
            }

            cellClassName = undefined;
            messageZone.innerHTML = "";
                
            countMove(rowIndex, cellClassName);
        }

        // Apply checkCell class on certain conditions
        if (cellClassName == "allowedCell" || cellClassName == "allowCellColorLine" && move >= 0) {

            // Don't do anything on -5 line if a cell is already checked on main grid
            if (rowIndex == 5 && move >= 1) {
                cellClassName = 0; // Set cellClassName to a value not considered elsewhere in the code
                messageZone.innerHTML = "Impossible move!";
            }

            // Apply checkCell class if the maximum of moves is not reached            
            else if (move < 2) {
                // Verify wether nb of checked cell per line is at least 5 before checking last cell
                if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] < 5) {
                        messageZone.innerHTML = "Sorry but at least 5 cells should be checked on this line before selecting this cell."; 
                }

                else {
                    // Last cell of a line?
                    if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
                        lineClosed += 1;
                    }          
                    cell.classList.remove("allowedCell");
                    cell.classList.remove("allowCellColorLine");
                    cell.classList.add("checkCell");
                    cellClassName = "checkCell"; 
                    messageZone.innerHTML = "";
                    countMove(rowIndex, cellClassName);
                    deadCell(cell);
                }
            }
            
            // Indicate to the player why s.he can't check any more cell
            else {
                messageZone.innerHTML = "No more moves! Unselect or roll dice again.";
                cellClassName = 0; // Set cellClassName to a value not considered elsewhere in the code
            }
        }

        updateNbOfCheckedCellPerLineArray(rowIndex, cellClassName);
    }

    function updateNbOfCheckedCellPerLineArray(rowIndex, className) {  
        if (className == "checkCell") {
            nbOfCheckedCellPerLine[rowIndex -1] += 1;
        }

        else if (className == undefined) {                
            nbOfCheckedCellPerLine[rowIndex -1] -= 1;           
        }
    }

    // Function that apply or remove deadCell class to previous cells in a row where a cell is checked. Called after each check or uncheck. 
    function deadCell(cell) {
        cellIndex = cell.cellIndex;
        cellRow = cell.parentElement;
        let beginArray = 0;
        let previousCellsInRow = [];

        // Building the array to apply or unapply deadCell class 
            // Beginning of the array should correspond to first previous cell in row having checkCell class or permanentCheckCell (else i 0)
            for (i = cellIndex - 1; i > 0; i--) {
                if (cellRow.children[i].className == "checkCell" || cellRow.children[i].className == "permanentCheckCell") {
                    beginArray = i;
                    break;
                }
            }

            // End of the array should by the cellIndex      
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
                // TO-DO: here we have no manage the case of unchecking the leftest cell if two where check in a row
                if (previousCellsInRow[i].classList.contains("deadCell")) {
                    previousCellsInRow[i].classList.remove("deadCell");
                }
            }        
        }
    }  

    // Functions that help calculating the results and counting moves
    function countMove(rowIndex, className) {
        // Main grid 
        if (rowIndex >= 1 && rowIndex <= 4) {            

            // Main grid and cell checked: count + 1 move
            if (className == "checkCell") {
                move ++;
            }

             // Main grid and cell unchecked: count - 1 move
             if (className == undefined) {
                move --;
             }
        }

        // -5 line
        if (rowIndex == 5) {

            // -5 line and cell checked: count + 2 moves
            if (className == "checkCell") {
                move += 2;
            }

            // -5 line and cell unchecked: count - 2 moves
            if (className == undefined) {
                move -=2;
            }
        }

       move >= 1 ? enableButton() : null;
       move == 0 ? disableButton() : null;
    }

    function countPoints(nbOfCheckedCellPerLine) {
        for (let i = 0; i < nbOfCheckedCellPerLine.length - 1; i++) { // For each line from the main grid
            for (let j = 0; j <= nbOfCheckedCellPerLine[i] ; j++) { // Add the number to the previous until the value in the index is reached
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

                    if (displayDiceZone.innerText != "") {

                    // Update variable value for row information
                    rowOfCell = cell.parentElement;
                    rowClassName = rowOfCell.classList;
                    rowIndex = rowOfCell.rowIndex;

                    // Apply CSS class and calculate points
                    check(cell, rowIndex);
                    
                    // Last cell of a line? Let's have another round of updating the number of checked cell per line array
                    if (cell.cellIndex == 10 && nbOfCheckedCellPerLine[rowIndex - 1] >= 5) {
                        updateNbOfCheckedCellPerLineArray(rowIndex, cell.className)
                    }  

                    /* This section to verify points and nb of checked cells per line during game loop 
                    messageZone.innerHTML = "Nombre de points : " + points + "<br/> Rouge : " + nbOfCheckedCellPerLine[0] + "<br/> Jaune : " + nbOfCheckedCellPerLine[1] + "<br/> Vert : " + nbOfCheckedCellPerLine[2] + "<br/> Bleu : " + nbOfCheckedCellPerLine[3] + "<br/> -5 : " + nbOfCheckedCellPerLine[4] + "<br/> Nb de coups : " + move;
                    /* End of help section */

                    // End of game?
                    askForEndOfGame();
                }});
                }
            }