// Variables
const diceCharList = ["&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"] // List of characters representing dice faces, from 1 to 6
let allTableCells = Array.from(document.getElementsByTagName("td"));
let nbOfCheckedCellPerLine = [0, 0, 0, 0, 0];
let lineClosed = 0, points = 0; 

// Functions
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
        let displayDicesZone = document.getElementById("displayDices");
        displayDicesZone.innerHTML = "";

        for (i in diceArray) {
            if (i == 0 || i == 1) {
                displayDicesZone.innerHTML += diceCharList[diceArray[i] - 1] + ' ';
            }
            if (i == 2) {
                displayDicesZone.innerHTML += '<span class="red">' + diceCharList[diceArray[i] - 1] + '</span> ';
            }
            if (i == 3) {
                displayDicesZone.innerHTML += '<span class="yellow">' + diceCharList[diceArray[i] - 1] + '</span> ';
            }
            if (i == 4) {
                displayDicesZone.innerHTML += '<span class="green">' + diceCharList[diceArray[i] - 1] + '</span> ';
            }
            if (i == 5) {
                displayDicesZone.innerHTML += '<span class="blue">' + diceCharList[diceArray[i] - 1] + '</span> ';
            }    
        } 
    }

    // Functions that apply a particular class
    function check(cell) {
        cell.className == "" ? cell.classList.add("checkCell") : cell.classList.remove("checkCell");
    }

    // Functions that help calculating the results
    function verifyClassBeforeAddingPoints (rowIndex, className) {
        if (className == "checkCell") {
            nbOfCheckedCellPerLine[rowIndex] += 1;
            points += nbOfCheckedCellPerLine[rowIndex];
        }
        else {                
            points -= nbOfCheckedCellPerLine[rowIndex];
            nbOfCheckedCellPerLine[rowIndex] -= 1;
        }
    }

    function addPoints(row, className) {
        row == "redbg" ? verifyClassBeforeAddingPoints(0, className) : null;
        row == "yellowbg" ? verifyClassBeforeAddingPoints(1, className) : null;
        row == "greenbg" ? verifyClassBeforeAddingPoints(2, className) : null;
        row == "bluebg" ? verifyClassBeforeAddingPoints(3, className) : null;
    }

    function removePoints(className) {
        if (className == "checkCell") {
            nbOfCheckedCellPerLine[4] += 1;
            points -= 5;
        }
        else {                
            points += 5;
            nbOfCheckedCellPerLine[4] -= 1;
        }        
    }


// Game loop
for (let cell of allTableCells) {
    let cellClassName, rowOfCell, rowClassName;

    // If player clicks on a cell (don't listen to the blank one)
    if (!cell.hasAttribute("colspan")) {
    
        cell.addEventListener("click", function(){
            // Update variable value for row information
            rowOfCell = cell.parentElement;
            rowClassName = rowOfCell.classList;

            // Apply CSS class
            check(cell);

            // Update variable value for cellClass
            cellClassName = cell.className;

            // Add points according to number of checked cells per line
            addPoints(rowClassName, cellClassName);

            // Remove points according to number of checked cell on -5 line
            if (rowOfCell.rowIndex == 5) {
                removePoints(cellClassName);
            }

            // Last cell of a line?
            if (cell.cellIndex == 10) {
                addPoints(rowClassName, cellClassName);
                cellClassName == "checkCell" ? lineClosed += 1 : lineClosed -= 1;
            }

            /* This section to verify points and nb of checked cells per line during game loop

            document.getElementById("messageZone").innerHTML = "Nombre de points : " + points + "<br/> Rouge : " + nbOfCheckedCellPerLine[0] + "<br/> Jaune : " + nbOfCheckedCellPerLine[1] + "<br/> Vert : " + nbOfCheckedCellPerLine[2] + "<br/> Bleu : " + nbOfCheckedCellPerLine[3] + "<br/> -5 : " + nbOfCheckedCellPerLine[4];

            */

            // Two lines are closed or 4 negative cells are checked: end of game
            if (lineClosed == 2 || nbOfCheckedCellPerLine[4] == 4) {
                document.getElementById("messageZone").innerHTML = "End of game! You have " + points + " points.";
            }
        });
    }
}
