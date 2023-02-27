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
        cell.classList.add("checkCell");
    }

    // Functions that help calculating the results
    function addPoints(row) {
        if (row == "redbg") {
            nbOfCheckedCellPerLine[0] += 1;
            points += nbOfCheckedCellPerLine[0];
        }

        if (row == "yellowbg") {
            nbOfCheckedCellPerLine[1] += 1;
            points += nbOfCheckedCellPerLine[1];
        }

        if (row == "greenbg") {
            nbOfCheckedCellPerLine[2] += 1;
            points += nbOfCheckedCellPerLine[2];
        }

        if (row == "bluebg") {
            nbOfCheckedCellPerLine[3] += 1;
            points += nbOfCheckedCellPerLine[3];
        }
    }

    function removePoints() {
        nbOfCheckedCellPerLine[4] += 1;
        points -= 5;
    }


// Game loop
for (let cell of allTableCells) {

    // If player clicks on a cell
    cell.addEventListener("click", function(){
        check(cell);

        // Add points according to number of checked cells per line
        addPoints(cell.parentElement.classList);

        // Remove points according to number of checked cell on -5 line
        if (cell.parentElement.rowIndex == 5) {
            removePoints();
        }

        // Last cell of a line?
        if (cell.cellIndex == 10) {
            lineClosed += 1;
            addPoints(cell.parentElement.classList);
        }

            // Two lines are closed or 4 negative cells are checked: end of game
            if (lineClosed == 2 || nbOfCheckedCellPerLine[4] == 4) {
               document.getElementById("messageZone").innerHTML = "End of game! You have " + points + " points.";
            }
    });
}
