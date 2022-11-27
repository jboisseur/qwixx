// Game setup
var finalScore = 0;

const diceCharList = ["&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"] // List of characters representing dice faces, from 1 to 6

var diceArray = [];

var sumsArray = [];

var gameSheet = [
    [], // red line (from 2 to 12)
    [], // yellow line (from 2 to 12)
    [], // green line (from 12 to 2)
    [], // blue line (from 12 to 2)
    0   // negative line (up to 4)
];

var elegibleSheet = gameSheet;

// For test purposes, here's a game sheet with some cells already checked
gameSheet = [
    [5, 6, 7, 8, 9],
    [],
    [10, 9, 8, 7, 6],
    [],
    2
];

    // Set of functions
        function gameOver (nbOfLinesClosed, nbOfNegativeCellsChecked) {
            nbOfLinesClosed == 2 || nbOfNegativeCellsChecked == 4 ? true : false;
        }

        const turnOver = (nbOfMovesRemaining) => nbOfMovesRemaining == 0 ? true : false;

        function rollDice() {
            min = Math.ceil(1);
            max = Math.floor(6);
            return Math.floor(Math.random() * (max - min + 1)) + min; 
        }

        function sumDices(dice1, dice2) {
            return dice1 + dice2;
        }

        function displayDice(dice) {
            return diceCharList[dice - 1];             
        }

        function maxFromArray(...arr) {
            return Math.max(...arr);
        }

        function minFromArray(...arr) {
            return Math.min(...arr);
        }

// Game loop
do {
    // Roll the 6 dices
    for (i = 0; i < 6; i++) {
        diceArray.push(rollDice());
    };

    // Display result of rolling dices
    document.getElementById("DBlanc1").innerHTML = displayDice(diceArray[0]);
    document.getElementById("DBlanc2").innerHTML = displayDice(diceArray[1]);
    document.getElementById("DRed").innerHTML = displayDice(diceArray[2]);
    document.getElementById("DYellow").innerHTML = displayDice(diceArray[3]);
    document.getElementById("DGreen").innerHTML = displayDice(diceArray[4]);
    document.getElementById("DBlue").innerHTML = displayDice(diceArray[5]);

    // Calculate sums
    for (i = 1; i < 6; i++) {
        sumsArray.push(sumDices(diceArray[0], diceArray[i]));
    };
    for (i = 1; i < 5; i++) {
        sumsArray.push(sumDices(diceArray[1], diceArray[i+1]));
    };

    // Calculate authorized moves
        // Player can always choose to select -5 points
        elegibleSheet[4] = 1;

        // Run a loop for increasing and decrasing lines
            // Red line = gameSheet/elegibleSheet index 0
            // Numbers to check: sumsArray from index 0 (white sum) to 2 (index 1 and 2 are red dices)
               for (i = 0; i < 3; i++) {
                    if (sumsArray[i] > maxFromArray(...gameSheet[0])) {
                        elegibleSheet[0].push.sumsArray[i];
                    };
                };
        


    // Display elegible sheet (connection with HTML required)
    
    // Listen to player's choice
    do {
        }

        while(turnOver() == false);
    
    // Copy choice to gameSheet
    
}

while (gameOver() == false);

// Game ends