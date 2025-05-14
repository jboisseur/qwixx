class Dice {
    static sumDice(diceArray) {
        for (let i = 1; i < 6; i++) {
            allSums.push(diceArray[0] + diceArray[i]);
        };
        for (let i = 1; i < 5; i++) {
            allSums.push(diceArray[1] + diceArray[i + 1]);
        };

        return allSums
    }

    /********************
     * Build DOM tree for Rolling Zone as the host for
        * Roll button
        * Dice zone
        * Message zone
    ********************/
    static createRollingZone() {
        const rollingZone = document.createElement("div");
        rollingZone.setAttribute("id", "rollingZone");
        
        return document.getElementById("playerSheet0").insertAdjacentElement("afterend", rollingZone);
    }

    static createRollButton() {
        const rollDiceButton = document.createElement("button");
        rollDiceButton.setAttribute("id", "rollDiceButton");
        rollDiceButton.setAttribute("type", "button");
        rollDiceButton.textContent = "Roll";

        return document.getElementById("rollingZone").insertAdjacentElement("beforeend", rollDiceButton);
    }

    static createDiceZone() {
        const displayDiceZone = document.createElement("div");
        displayDiceZone.setAttribute("id", "displayDiceZone");

        return document.getElementById("rollingZone").insertAdjacentElement("beforeend", displayDiceZone);
    }

    // TODO create Message Zone

    /********************
     * Roll & display dice
    ********************/
    static rollDice(diceArray) {
        diceArray = [];

        for (let i = 0; i < 6; i++) {
            let min = Math.ceil(1);
            let max = Math.floor(6);
            diceArray.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }

        Dice.displayDice(diceArray);

        return diceArray;
    }

    static displayDice(diceArray) {
        const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'] // List of characters representing dice faces, from 1 to 6

        const displayDiceZone = document.getElementById("displayDiceZone");

        displayDiceZone.innerHTML = "";
        displayDiceZone.innerHTML += '<span class="white die">' + diceCharList[diceArray[0] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="white die">' + diceCharList[diceArray[1] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="red die">' + diceCharList[diceArray[2] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="yellow die">' + diceCharList[diceArray[3] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="green die">' + diceCharList[diceArray[4] - 1] + '</span> ';
        displayDiceZone.innerHTML += '<span class="blue die">' + diceCharList[diceArray[5] - 1] + '</span> ';

        return document.getElementById("diceZone").insertAdjacentElement("beforeend", displayDiceZone);
    }
}

export { Dice };