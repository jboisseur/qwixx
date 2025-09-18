/************ NEW TURN ************/
let diceArray;
let playerMoves;
let currentMainPlayer;
const grids = document.querySelector(".grids").children;
const cells = document.querySelectorAll(".grids .grid div span");

const getNbOfCrossedCellsPerRowPerGrid = (param = "") => {
    // @param: lastCells, penaltyCells or empty string
    // Returns an array (one item per grid)

    const res = [];
    
    for (let i = 0; i < Array.from(grids).length; i++) {       
        let tempRes = [];
        const rows = Array.from(grids[i].children);
        for (let j = 0; j < rows.length; j++) {
            const cells = Array.from(rows[j].children);
            switch (param) {
                case "lastCells":
                    tempRes[j] = cells.filter(cell => cell.dataset.isCrossed === "true" && cell.dataset.lastCell === "true").length;
                    break;
                
                case "penaltyCells":
                    res[i] = cells.filter(cell => cell.dataset.isCrossed === "true" && cell.dataset.penalty).length;
                    break;
                
                default:
                    tempRes[j] = cells.filter(cell => cell.dataset.isCrossed === "true").length;
                    if (cells.find(cell => cell.dataset.lastCell === "true" &&  cell.dataset.isCrossed === "true")) { tempRes[j] += 1; }
                    break;
            }
        }
        
        if (param !== "penaltyCells") res.push(tempRes);
        // res is something like [[2,0,1,3,1],[1,4,0,2,0]]
    }

    if (param === "lastCells") {
        for (let i = 0; i < res.length; i++) {
            res[i] = res[i].reduce((acc, curr) => acc + curr, 0,)      
        }
    }

    return res;
}

const countPoints = () => {
    const res = getNbOfCrossedCellsPerRowPerGrid();

    // Regular rows: sum up number of crossed cells per row (for instance 4 is crossed in red row: 4 + 3 + 2 + 1) and push it back into res. For penalty rows (the last from the grid), remove 5 for each crossed cell
    for (let i = 0; i < res.length; i++) {        
        for (let j = 0; j < res[i].length; j++) {
            let sum = 0;
            if (j == res[i].length - 1) { // Penalty row                
                for (let k = res[i][j]; k > 0; k--) {
                    sum -= 5;
                }
            }
            else { // Regular rows
                for (let k = res[i][j]; k > 0; k--) {
                    sum += k;
                }
            }
            res[i][j] = sum;
        }
    }

    // Count points
    for (let i = 0; i < res.length; i++) {
        res[i] = res[i].reduce((acc, curr) => acc + curr, 0,)      
    }

    return res;
}

const newTurn = () => {
    // Constants & variables
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

    const closeLine = () => {
        // si la last cell d'une des grids est crossed, ça veut dire que ça ligne est fermée. Il faut parcourir toutes les grid et détecter s'il y a une last cell de crossed et si oui, récupérer la couleur de la row et fermer pour toutes les grilles

        cells.forEach(cell => {
            if (cell.dataset.isCrossed === "true" && cell.dataset.lastCell === "true") {
                // get row color
                const color = cell.parentElement.dataset.rowColor;

                // add isClosed attribute to rows of that color on all grids
                Array.from(grids).forEach(grid => {
                    Array.from(grid.children).forEach(row => {
                        if (row.dataset.rowColor === color) {
                            row.setAttribute("data-is-closed", "true");

                            // for all cells in row that are not crossed or already unelegible, setAttribute isElegible to false
                            const cells = Array.from(row.children);
                            for (let i = 0; i < cells.length; i++) {
                                if (cells[i].dataset.isCrossed !== "true" && cells[i].dataset.isElegible !== "false") {
                                    cells[i].dataset.isElegible = "false";
                                }
                            }
                        }
                    }) 
                })
            }
        })

    }

    /* Running functions */
    closeLine();
    switchPlayer();
    /* End of game? */
    const pointsArray = countPoints();
    updateEndOfGame(pointsArray);    
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

const verifyLastCell = cell => {
    // in the row to cross last cell, at least 5 cells should be crossed or have an elegibilityW attribute
    const row = Array.from(cell.parentElement.children);
    let count = 0;
    count += row.filter(elem => elem.dataset.isCrossed).length;
    count += row.filter(elem => elem.dataset.isElegibleW === "true").length;

    return count >= 5;
}

const getElegibleCells = () => {
    cells.forEach(cell => {

        // remove all previous isElegible
        cell.removeAttribute("data-is-elegible-w");
        cell.removeAttribute("data-is-elegible-c");
        cell.removeAttribute("data-is-elegible-p");

        if (!cell.dataset.isCrossed && cell.dataset.isElegible !== "false") {

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

            // for all players, case of last cell
            if (cell.dataset.lastCell === "true") {
                cell.removeAttribute("data-is-elegible-w");
                cell.removeAttribute("data-is-elegible-c");
                
                if (verifyLastCell(cell)) {
                    if (verifyWhisteSum(cell)) {
                        cell.dataset.isElegibleW = "true";
                    }
                    // for main player
                    if (isMainPlayer === "true") {
                        if (verifyColorSum(cell)) {
                            cell.dataset.isElegibleC = "true";
                        }
                    }
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

const removeElegibilityOnTheRight = cell => {
    // Result of white sum should no longer be available on the right hand side of the cell on this row
    const row = Array.from(cell.parentElement.children);
    const cellIndex = row.indexOf(cell);
    for (let i = cellIndex + 1; i < row.length; i++) {   
        row[i].removeAttribute("data-is-elegible-w");
    }
}

// Remove isElegible attributes for penalty, white or color sum cells depending on what was crossed
const removeElegibility = (cell, w, c, p) => {
    const rows = Array.from(cell.parentElement.parentElement.children);
    
    if (p === "true") {
        rows.forEach(cells => Array.from(cells.children).forEach(cell => {
            cell.removeAttribute("data-is-elegible-w");
            cell.removeAttribute("data-is-elegible-c");
            cell.removeAttribute("data-is-elegible-p");
        }));
    }

    else if (w === "true" && c === "true") {
        cell.removeAttribute("data-is-elegible-w");
        cell.removeAttribute("data-is-elegible-c");
        rows.forEach(cells => Array.from(cells.children).forEach(cell => {
            cell.removeAttribute("data-is-elegible-p");
        }));
        removeElegibilityOnTheRight(cell);
    }
        
    else if (w === "true" && c === undefined) {
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
        removeElegibilityOnTheRight(cell);
    }

    // Two moves at most for main player        
    let mainPlayerIndex = Array.from(grids).findIndex(grid => grid.dataset.mainPlayer === "true");

    if (playerMoves[mainPlayerIndex].length === 2) {
        rows.forEach(cells => Array.from(cells.children).forEach(cell => {
            cell.removeAttribute("data-is-elegible-w");
            cell.removeAttribute("data-is-elegible-c");
        }));
    }
}

const cross = e => {
    const cell = e.target;
    if (cell.dataset.isElegibleW === "true" || cell.dataset.isElegibleC === "true" || cell.dataset.isElegibleP === "true") {
        crossCell(cell);
        const pointsArray = countPoints();
        saveMove(cell);
        communicate(`Points per player: ${pointsArray}`); 

        // Ineligibility for previous cells in row
        const row = Array.from(cell.parentElement.children);
        const cellIndex = row.indexOf(cell);
        for (let i = 0; i < cellIndex; i++) {
            row[i].setAttribute("data-is-elegible", "false");
            row[i].removeAttribute("data-is-elegible-w");
            row[i].removeAttribute("data-is-elegible-c");
        }

        // Ineligibility for previously elegible cells        
        removeElegibility(cell, cell.dataset.isElegibleW, cell.dataset.isElegibleC, cell.dataset.isElegibleP);
    }
}

cells.forEach(item => item.addEventListener("click", e => cross(e)));

/************ END GAME ************/
// Constants & variables
const msg = document.getElementById("message");


// Functions
const communicate = message => msg.innerText = `${message}`;
const disableButton = () => diceBtn.disabled = "true";

const getWinner = arr => {
    const max = arr.reduce((m, n) => Math.max(m, n));
    const winner = [...arr.keys()].filter(i => arr[i] === max);
    winner.forEach(item => communicate(`Player ${item + 1} wins the game with ${max} points!`));
}

const updateEndOfGame = pointsArray => {
    if(playerMoves) { 
        if(playerMoves.flat().find(elem => elem.dataset.lastCell === "true" || elem.dataset.penalty === "4")) {

            // todo: plutôt que de se baser sur lastCell crossed, compter le nombre de lignes qui ont l'attribut data-is-closed

            let lastCellCrossed = getNbOfCrossedCellsPerRowPerGrid("lastCells");
            let penaltyCellCrossed = getNbOfCrossedCellsPerRowPerGrid("penaltyCells");

            if(lastCellCrossed.some(item => item >= 2) || penaltyCellCrossed.some(item => item === 4)) {
                
                cells.forEach(cell => {
                    cell.removeAttribute("data-is-elegible-p");
                    cell.removeAttribute("data-is-elegible-w");
                    cell.removeAttribute("data-is-elegible-c");
                })

                getWinner(pointsArray);
                disableButton();
            }

        }
    };
}

/************ MAIN ************/
const diceBtn = document.getElementById("dice-btn");
diceBtn.addEventListener("click", newTurn);