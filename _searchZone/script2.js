// Game setup
var finalScore = 0, diceArray = [], sumsArray = [];
const diceCharList = ["&#9856;", "&#9857;", "&#9858;", "&#9859;", "&#9860;", "&#9861;"] // List of characters representing dice faces, from 1 to 6

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
//do {
    // Roll the 6 dices
    for (i = 0; i < 6; i++) {
        diceArray.push(rollDice());
    };

    console.log(document.getElementById("DBlanc1"));

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
    
    // Listen to player's choice
 /*   do {
        }

        while(!turnOver()); */
    
    // Copy choice to gameSheet
    
// }

// while (!gameOver());

// Game ends