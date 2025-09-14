/************ NEW TURN ************/
let diceArray;
let playerMoves;
let currentMainPlayer;

const newTurn = () => {
    // Constants & variables
    const grids = document.querySelector(".grids").children;
    const dice = document.getElementById("dice");

    // Functions    
    const getDiceArray = () => {
        let res = [];
        for (let i = 0; i < 6; i++) {
            res.push(Math.floor(Math.random() * 6 + 1));
        }
        return res
    }

    const currentMainPlayer = () => {
        let index;

        for (let i = 0; i < grids.length; i++) {        
            let mainPlayerAttribute = grids[i].dataset.mainPlayer;
            if (mainPlayerAttribute === "true") {
                grids[i].dataset.mainPlayer = "false";
                index = i;
            }
        }

        return index;
    }

    const switchPlayer = () => {
        let sourceIndex = currentMainPlayer();

        // Target mainPlayer
        let targetIndex = sourceIndex === grids.length - 1 ? 0 : sourceIndex + 1;
        grids[targetIndex].dataset.mainPlayer = "true";
    }

    const resetPlayerMoves = () => {
        playerMoves = new Array(grids.length);
        for (let i = 0; i < playerMoves.length; i++) {
        playerMoves[i] = new Array();
        };
    }

    /* Running functions */
    switchPlayer();    
    resetPlayerMoves();

    // Roll dice
    diceArray = getDiceArray();
    dice.innerText = diceArray;
    // Check for elegibile cells
    getElegibleCells();
}

/************ ELEGIBILITY ************/
const whiteDiceSum = () => {
    return diceArray[0] + diceArray[1];
}

const colorDiceSum = () => {
    let sums = [];
    for (let i = 2; i < diceArray.length; i++) {
        let sum = [];
        sum.push(diceArray[0] + diceArray[i]);
        sum.push(diceArray[1] + diceArray[i]);
        sums.push(sum);
    }
    return sums;
}

const verifyWhisteSum = cell => {
    return Number(cell.dataset.number) === whiteDiceSum(); 
}

const verifyColorSum = cell => {
    const idValid = colorDiceSums => { return colorDiceSums.some(s => s === Number(cell.dataset.number)) }

    // colorDiceSum() returns an array composed of 4 arrays corresponding to the sum a each white die with a color die. For instance: [[8,11],[6,9],[6,9],[3,6]]
    switch (cell.dataset.color) {
        case "red":
            return idValid(colorDiceSum()[0]);
        case "yellow":
            return idValid(colorDiceSum()[1]);
        case "green":
            return idValid(colorDiceSum()[2]);
        case "blue":
            return idValid(colorDiceSum()[3]);
    }    
}

const verifyPenalty = cell => {
    const row = Array.from(cell.parentElement.children);
    return !row.find(elem => elem.dataset.isElegibleP && !elem.dataset.isCrossed);
}

const cells = document.querySelectorAll(".grids .grid div span");

const getElegibleCells = () => {
    cells.forEach(cell => {

        // remove all previous isElegible
        cell.removeAttribute("data-is-elegible-w");
        cell.removeAttribute("data-is-elegible-c");
        cell.removeAttribute("data-is-elegible-p");

        // TODO je ne sais plus pourquoi j'ai mis la condition ci-dessous
        if (cell.dataset.isElegibleW === "false" || !cell.dataset.isElegibleW) {

            // for all players
            if (verifyWhisteSum(cell)) {
                cell.dataset.isElegibleW = "true";
            }

            // for main player
            const isMainPlayer = cell.parentElement.parentElement.dataset.mainPlayer;
            if (isMainPlayer === "true") {
                if (verifyColorSum(cell)) {
                    cell.dataset.isElegibleC = "true";
                }
                if (cell.parentElement.dataset.rowPenalty) {
                    if (verifyPenalty(cell)) {
                        cell.dataset.isElegibleP = "true";
                    };
                }
            }

        }

    })
}

/************ CROSS ************/
const crossCell = cell => {
    cell.classList.add("cross");
    cell.setAttribute("data-is-crossed", "true");
}

const saveMove = cell => {
    const index = cell.parentElement.parentElement.id.slice(-1) - 1;
    playerMoves[index].push(cell);    
}

const cross = e => {
    const cell = e.target;
    if (cell.dataset.isElegibleW === "true" || cell.dataset.isElegibleC === "true" || cell.dataset.isElegibleP === "true") {
        crossCell(cell);
    }

    // Ineligibility for previous cells in row
    const row = Array.from(cell.parentElement.children);
    const cellIndex = row.indexOf(cell);

    for (let i = 0; i < cellIndex; i++) {
        row[i].setAttribute("data-is-elegible", "false");
    }

    // Update turn data
    saveMove(cell);

    // remove elegibility
    const removeElegibility = (w, c, p) => {
        const rows = Array.from(cell.parentElement.parentElement.children);
        
        if (p === "true") {
            rows.forEach(cells => Array.from(cells.children).forEach(cell => {
                cell.removeAttribute("data-is-elegible-w");
                cell.removeAttribute("data-is-elegible-c");
                cell.removeAttribute("data-is-elegible-p");
            }));

        }
        
        if (w === "true" && c === undefined) {
            rows.forEach(cells => Array.from(cells.children).forEach(cell => {
                cell.removeAttribute("data-is-elegible-w");
                cell.removeAttribute("data-is-elegible-p");
            }));
        }

        else if (w === undefined && c === "true") {
            rows.forEach(cells => Array.from(cells.children).forEach(cell => {      
                cell.removeAttribute("data-is-elegible-p");

                if (cell.dataset.isElegibleC === "true") {                    
                    cell.removeAttribute("data-is-elegible-c");
                }
            }));

            for (let i = 0; i < row.slice(cellIndex + 1).length; i++) {
                row[i].removeAttribute("data-is-elegible-w");
            }
            
        }        
    }
    removeElegibility(cell.dataset.isElegibleW, cell.dataset.isElegibleC, cell.dataset.isElegibleP);
}

cells.forEach(item => item.addEventListener("click", e => cross(e)));

/************ MAIN ************/
const diceBtn = document.getElementById("dice-btn");
diceBtn.addEventListener("click", newTurn);