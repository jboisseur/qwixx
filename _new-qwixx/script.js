/************************
 * CONSTANTS & VARIABLES 
 ************************/
let diceArray;
let playerMoves;

const grids = document.querySelector(".grids").children;
const gridsArray = Array.from(grids);
const cells = document.querySelectorAll(".grids .grid div span");
const diceBtn = document.getElementById("dice-btn");
const cancelBtn = document.getElementById("cancel-btn");
const dice = document.getElementById("dice");
const msg = document.getElementById("message");

const diceCharList = ['<i class="fa-solid fa-dice-one"></i>', '<i class="fa-solid fa-dice-two"></i>', '<i class="fa-solid fa-dice-three"></i>', '<i class="fa-solid fa-dice-four"></i>', '<i class="fa-solid fa-dice-five"></i>', '<i class="fa-solid fa-dice-six"></i>'];

/************************ 
 * FUNCTIONS 
************************/
/****** 
 * UTILS
******/
const communicate = message => msg.innerText = `${message}`;
const disableButton = btn => btn.disabled = "true";
const enableButton = btn => btn.removeAttribute("disabled");
const getMainPlayerIndex = () => gridsArray.findIndex(grid => grid.dataset.mainPlayer === "true");
const permanentIsElegibleFalse = () => {
    cells.forEach(cell => {
        if (cell.dataset.isElegibleTemp) {
            cell.removeAttribute("data-is-elegible-temp");
            cell.dataset.isElegible = "false";
        }        
    })
}
const getNbOfCrossedCellsPerRowPerGrid = (param = "") => {
    // @param: penaltyCells or empty string
    // Returns an array (one item per grid)

    const res = [];
    
    for (let i = 0; i < gridsArray.length; i++) {       
        let tempRes = [];
        const rows = gridsArray[i].children;
        for (let j = 0; j < rows.length; j++) {
            const cells = Array.from(rows[j].children);
            switch (param) {                
                case "penaltyCells":
                    res[i] = cells.filter(cell => cell.dataset.isCrossed === "true" && cell.dataset.penalty).length;
                    break;
                
                default:
                    tempRes[j] = cells.filter(cell => cell.dataset.isCrossed === "true").length;
                    break;
            }
        }
        
        if (param !== "penaltyCells") res.push(tempRes);
        // res is something like [[2,0,1,3,1],[1,4,0,2,0]]
    }

    return res;
}

const getClosedLines = () => {
    let res = [];
    for (let i = 0; i < gridsArray.length; i++) {       
        const rows = gridsArray[i].children;
        for (let j = 0; j < rows.length; j++) {
            if (rows[j].dataset.isClosed === "true") {
                res.push(rows[j].dataset.rowColor);
            }
        }
    }
    return [...new Set(res)];
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

/****** 
 * DICE RELATED 
******/
const getDiceArray = () => {
    let res = [];
    for (let i = 0; i < 6; i++) {
        res.push(Math.floor(Math.random() * 6 + 1));
    }
    return res
}

const displayDice = diceArray => {
    dice.innerHTML = "";
    dice.innerHTML += `<span class="black">${diceCharList[diceArray[0] - 1]}</span> `;
    dice.innerHTML += `<span class="black">${diceCharList[diceArray[1] - 1]}</span> `;
    dice.innerHTML += `<span class="red">${diceCharList[diceArray[2] - 1]}</span> `;
    dice.innerHTML += `<span class="yellow">${diceCharList[diceArray[3] - 1]}</span> `;
    dice.innerHTML += `<span class="green">${diceCharList[diceArray[4] - 1]}</span> `;
    dice.innerHTML += `<span class="blue">${diceCharList[diceArray[5] - 1]}</span>`;
}

const whiteDiceSum = () => diceArray[0] + diceArray[1];

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

/****** 
 * NEW TURN FUNCTIONS 
 ******/
const resetPlayerMoves = () => {
    playerMoves = new Array(grids.length);
    for (let i = 0; i < playerMoves.length; i++) {
    playerMoves[i] = new Array();
    };
}

const switchPlayer = () => {
    let sourceIndex = getMainPlayerIndex();
    let targetIndex = sourceIndex === grids.length - 1 ? 0 : sourceIndex + 1;
    grids[sourceIndex].removeAttribute("data-main-player");
    grids[targetIndex].dataset.mainPlayer = "true";
}

/****** 
 * ELEGIBILITY 
******/
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

        if (!cell.dataset.isCrossed && cell.dataset.isElegible !== "false" && cell.parentElement.dataset.isClosed !== "true") {

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

            // case of last cell
            if (cell.dataset.lastCell === "true") {
                cell.removeAttribute("data-is-elegible-w");
                cell.removeAttribute("data-is-elegible-c");

                if (verifyLastCell(cell)) {
                    // for all players   
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

/****** 
 * CROSS 
******/
const crossCell = cell => {
    cell.classList.add("cross");
    cell.setAttribute("data-is-crossed", "true");
}

const unCrossCell = cell => {
    cell.classList.remove("cross");
    cell.removeAttribute("data-is-crossed");
}

const saveMove = cell => {
    const index = cell.parentElement.parentElement.id.slice(-1) - 1;
    playerMoves[index].push(cell);
}

const removeElegibilityOnTheRight = cell => {
    const row = Array.from(cell.parentElement.children);
    const cellIndex = row.indexOf(cell);
    for (let i = cellIndex + 1; i < row.length; i++) {   
        row[i].removeAttribute("data-is-elegible-w");
    }
}

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
    let mainPlayerIndex = getMainPlayerIndex();
    if (playerMoves[mainPlayerIndex].length === 2) {
        rows.forEach(cells => Array.from(cells.children).forEach(cell => {
            cell.removeAttribute("data-is-elegible-w");
            cell.removeAttribute("data-is-elegible-c");
        }));
    }
}

/****** 
 * END GAME
******/
const verifyEndOfGame = () => {
    if(playerMoves) {
        if(playerMoves.flat().find(elem => elem.dataset.lastCell === "true" || elem.dataset.penalty === "4")) {
            let closedLines = getClosedLines();
            let penaltyCellCrossed = getNbOfCrossedCellsPerRowPerGrid("penaltyCells");

            return closedLines.length >= 2 || penaltyCellCrossed.some(item => item === 4)
        }
    }
}

const endOfGameCleanUp = () => {
    cells.forEach(cell => {
        cell.removeAttribute("data-is-elegible-p");
        cell.removeAttribute("data-is-elegible-w");
        cell.removeAttribute("data-is-elegible-c");
    })

    gridsArray.forEach(grid => grid.removeAttribute("data-main-player"));

    disableButton(diceBtn);
    disableButton(cancelBtn);
}

const getWinner = arr => {
    const max = arr.reduce((m, n) => Math.max(m, n));
    const winner = [...arr.keys()].filter(i => arr[i] === max);
    winner.forEach(item => communicate(`Player ${item + 1} wins the game with ${max} points!`));
}

/******
 * END LINE
******/
const verifyEndOfLine = () => {
    cells.forEach(cell => {
        if (cell.dataset.isCrossed === "true" && cell.dataset.lastCell === "true") {
            // get row color
            const color = cell.parentElement.dataset.rowColor;

            // add isClosed attribute to rows of that color on all grids
            gridsArray.forEach(grid => {
                Array.from(grid.children).forEach(row => {
                    if (row.dataset.rowColor === color) {
                        row.setAttribute("data-is-closed", "true");
                    }
                }) 
            })
        }
    })
}

/************ RUNNING GAME ************/
const newTurn = () => {
    //test below
    getClosedLines();
    //test above
    verifyEndOfLine();

    if (verifyEndOfGame()) {        
        endOfGameCleanUp();
        const pointsArray = countPoints();
        getWinner(pointsArray);
    }

    else {
        // End of previous turn
        permanentIsElegibleFalse();      
        resetPlayerMoves();        
        disableButton(diceBtn);
        disableButton(cancelBtn);
        switchPlayer();

        // New turn        
        diceArray = getDiceArray();
        displayDice(diceArray);
        getElegibleCells();
    }
}

const cross = e => {
    const cell = e.target;
    if (cell.dataset.isElegibleW === "true" || cell.dataset.isElegibleC === "true" || cell.dataset.isElegibleP === "true") {
        crossCell(cell);
        enableButton(cancelBtn);
        // Last cell? Cross the lock icon as well
        if (cell.dataset.lastCell === "true") {
            crossCell(cell.nextElementSibling);
        }
        const pointsArray = countPoints();
        saveMove(cell);
        communicate(`Points per player: ${pointsArray}`); 

        // Ineligibility for previous cells in row
        const row = Array.from(cell.parentElement.children);
        const cellIndex = row.indexOf(cell);
        for (let i = 0; i < cellIndex; i++) {
            row[i].setAttribute("data-is-elegible-temp", "false");
            row[i].removeAttribute("data-is-elegible-w");
            row[i].removeAttribute("data-is-elegible-c");
        }

        // Ineligibility for previously elegible cells        
        removeElegibility(cell, cell.dataset.isElegibleW, cell.dataset.isElegibleC, cell.dataset.isElegibleP);

        let mainPlayerIndex = getMainPlayerIndex();
        if (playerMoves[mainPlayerIndex].length > 0) { enableButton(diceBtn) };
    }
}

const cancel = () => {
    disableButton(cancelBtn);
    playerMoves.forEach(player => {
        player.forEach(cell => {
            unCrossCell(cell);
            cells.forEach(cell => cell.removeAttribute("data-is-elegible-temp"));
        });
        getElegibleCells();
        resetPlayerMoves();
    })
}

diceBtn.addEventListener("click", newTurn);
cells.forEach(item => item.addEventListener("click", e => cross(e)));
cancelBtn.addEventListener("click", cancel);