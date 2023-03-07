// Variables
const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6

    // From HTML
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
    let nbOfCheckedCellPerLine = [0, 0, 0, 0, 0], diceArray = [], allSums = [];
    let lineClosed = 0, points = 0, move = 0;
    messageZone.innerHTML = "To start the game, please click on the Roll dice button";

    // Declare variables
    let cellClassName, rowOfCell, rowClassName;

// Functions
    // Begin new turn: roll dice, disable button, reset number of moves, reset messageZone et blank arrays & classes
    function newTurn() {
        diceArray = [];
        allSums = [];
        clearClasses();
        rollDice();
        disableButton();
        move = 0;
        messageZone.innerHTML = "";
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
    
    // "Check a cell" function (change class, count moves, add points)
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
                cell.classList.remove("allowedCell");
                cell.classList.remove("allowCellColorLine");
                cell.classList.add("checkCell");
                cellClassName = "checkCell"; 
                countMove(rowIndex, cellClassName);
            }
            
            // Indicate to the player why s.he can't check any more cell
            else {
                messageZone.innerHTML = "No more moves! Unselect or roll dice again.";
                cellClassName = 0; // Set cellClassName to a value not considered elsewhere in the code
            }
        }

        // Add points according to number of checked cells per line and record +1 move
        addPoints(rowIndex, cellClassName);
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

    function displayPoints(rowIndex, points) {
        rowIndex == 0 ? redPointsZone.innerHTML = points : null;
        rowIndex == 1 ? yellowPointsZone.innerHTML = points : null;
        rowIndex == 2 ? greenPointsZone.innerHTML = points : null;
        rowIndex == 3 ? bluePointsZone.innerHTML = points : null;
        rowIndex == 4 ? minusPointsZone.innerHTML = points : null;
    }

    function verifyClassBeforeAddingPoints (rowIndex, className) {  
        if (className == "checkCell") {
            nbOfCheckedCellPerLine[rowIndex] += 1;
            points += nbOfCheckedCellPerLine[rowIndex];    
        }

        else if (className == undefined) {                
            points -= nbOfCheckedCellPerLine[rowIndex];
            nbOfCheckedCellPerLine[rowIndex] -= 1;           
        }
    }

    function addPoints(rowIndex, cellClassName) {     
        rowIndex == 1 ? verifyClassBeforeAddingPoints(0, cellClassName) : null;
        rowIndex == 2 ? verifyClassBeforeAddingPoints(1, cellClassName) : null;
        rowIndex == 3 ? verifyClassBeforeAddingPoints(2, cellClassName) : null;
        rowIndex == 4 ? verifyClassBeforeAddingPoints(3, cellClassName) : null;
        rowIndex == 5 ? removePoints(cellClassName) : null;
    }

    function removePoints(cellClassName) {
        if (cellClassName == "checkCell") {
            nbOfCheckedCellPerLine[4] += 1;
            points -= 5;
        }
        if (cellClassName == undefined) {                
            points += 5;
            nbOfCheckedCellPerLine[4] -= 1;
        }        
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
                                      
        
                    // Last cell of a line?
                    if (cell.cellIndex == 10) {
                        addPoints(rowIndex, cellClassName);
                        cell.className == "checkCell" ? lineClosed += 1 : lineClosed -= 1;
                    }

                    /* This section to verify points and nb of checked cells per line during game loop
                    messageZone.innerHTML = "Nombre de points : " + points + "<br/> Rouge : " + nbOfCheckedCellPerLine[0] + "<br/> Jaune : " + nbOfCheckedCellPerLine[1] + "<br/> Vert : " + nbOfCheckedCellPerLine[2] + "<br/> Bleu : " + nbOfCheckedCellPerLine[3] + "<br/> -5 : " + nbOfCheckedCellPerLine[4] + "<br/> Nb de coups : " + move;
                    /* End of help section */
        
                    // End of game? Two lines are closed or 4 negative cells are checked
                    if (lineClosed == 2 || nbOfCheckedCellPerLine[4] == 4) {
                        clearClasses();
                        messageZone.innerHTML = 'End of game! You have ' + points + ' points. <a href="javascript:window.location.href=window.location.href">Start again</a>?';
                        displayDiceZone.innerText = "";
                    }
                }});
                }
            }
        
