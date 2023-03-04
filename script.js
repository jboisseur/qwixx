/* TODO : afficher le nombre de points par ligne en cours de route pour vérifications */

// Variables
const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6

    // From HTML
    const allTableCells = Array.from(document.getElementsByTagName("td"));
    const displayDicesZone = document.getElementById("displayDices");
    const messageZone = document.getElementById("messageZone");
    const button = document.getElementById("rollDicesButton");

    // Initialize data
    let nbOfCheckedCellPerLine = [0, 0, 0, 0, 0];
    let lineClosed = 0, points = 0, move = 0;

    // Declare variables
    let cellClassName, rowOfCell, rowClassName;

// Functions
    // Begin new turn: roll dices, disable button, reset number of moves and listen to player next move
    function newTurn() {
        rollDices();
        disableButton();
        move = 0;
        messageZone.innerHTML = "";
    }

    // Disable / enable Roll dices button
    function disableButton() {
        button.setAttribute("disabled", "");
    }

    function enableButton() {
        button.removeAttribute("disabled");
    }

    // Roll and display dices
    function rollDice() {
        min = Math.ceil(1);
        max = Math.floor(6);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }

    function rollDices() {
        let diceArray = []

        for (i = 0; i < 6; i++) {
            diceArray.push(rollDice());
        };

        return displayDices(diceArray);
    }

    function displayDices(diceArray) {
        displayDicesZone.innerHTML = "";
        displayDicesZone.innerHTML += '<span class="black">' + diceCharList[diceArray[0] - 1] + '</span> ';
        displayDicesZone.innerHTML += '<span class="black">' + diceCharList[diceArray[1] - 1] + '</span> ';
        displayDicesZone.innerHTML += '<span class="red">' + diceCharList[diceArray[2] - 1] + '</span> ';
        displayDicesZone.innerHTML += '<span class="yellow">' + diceCharList[diceArray[3] - 1] + '</span> ';
        displayDicesZone.innerHTML += '<span class="green">' + diceCharList[diceArray[4] - 1] + '</span> ';
        displayDicesZone.innerHTML += '<span class="blue">' + diceCharList[diceArray[5] - 1] + '</span> ';
    }

    // "Check a cell" function (change class, count moves, add points)
    function check(cell, rowIndex) {        

        cellClassName = cell.className;

        // Allow player to uncheck if checked within a turn
        if (cellClassName == "checkCell" && move > 0) {
            cell.classList.remove("checkCell");
            cellClassName = undefined;
            messageZone.innerHTML = "";
                
            countMove(rowIndex, cellClassName);
        }

        // Apply checkCell class on certain conditions
        if (cellClassName == "" && move >= 0) {

            // Don't do anything on -5 line if a cell is already checked on main grid
            if (rowIndex == 5 && move >= 1) {
                cellClassName = 0; // Set cellClassName to a value not considered elsewhere in the code
            }

            // Apply checkCell class if the maximum of moves is not reached            
            else if (move < 2) {
                cell.classList.add("checkCell");
                cellClassName = "checkCell"; 
                countMove(rowIndex, cellClassName);
            }
            
            // Indicate to the player why s.he can't check any more cell
            else {
                messageZone.innerHTML = "No more moves! Unselect or roll dices again.<br/>";
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

                    if (displayDicesZone.innerText != "") {

                    // Update variable value for row information
                    rowOfCell = cell.parentElement;
                    rowClassName = rowOfCell.classList;
                    rowIndex = rowOfCell.rowIndex;

                    // Apply CSS class and calculate points
                    check(cell, rowIndex);
                                      
        
                    // Last cell of a line?
                    if (cell.cellIndex == 10) {
                        addPoints(rowIndex, cellClassName);
                        cellClassName == "checkCell" ? lineClosed += 1 : lineClosed -= 1;
                    }

                    /* This section to verify points and nb of checked cells per line during game loop
                    messageZone.innerHTML = "Nombre de points : " + points + "<br/> Rouge : " + nbOfCheckedCellPerLine[0] + "<br/> Jaune : " + nbOfCheckedCellPerLine[1] + "<br/> Vert : " + nbOfCheckedCellPerLine[2] + "<br/> Bleu : " + nbOfCheckedCellPerLine[3] + "<br/> -5 : " + nbOfCheckedCellPerLine[4] + "<br/> Nb de coups : " + move;
                    /* End of help section */
        
                    // End of game? Two lines are closed or 4 negative cells are checked
                    if (lineClosed == 2 || nbOfCheckedCellPerLine[4] == 4) {
                        messageZone.innerHTML = 'End of game! You have ' + points + ' points. <a href="javascript:window.location.href=window.location.href">Start again</a>?';
                        displayDicesZone.innerText = "";
                    }
                }});
                }
            }
        
