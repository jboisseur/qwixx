const asc = "2,3,4,5,6,7,8,9,10,11,12", dsc = "12,11,10,9,8,7,6,5,4,3,2";
const r = "red", y = "yellow", g = "green", b = "blue";

const grids = [
    {
        name: "standard",
        structure: [
            { numbers: asc, colors: Array(11).fill(r) },
            { numbers: asc, colors: Array(11).fill(y) },
            { numbers: dsc, colors: Array(11).fill(g) },
            { numbers: dsc, colors: Array(11).fill(b) }      
        ]
    },
    {
        name: "rainbow",
        structure: [
            { numbers: asc, colors: [y, y, y, b, b, b, g, g, g, r, r] },
            { numbers: asc, colors: [r, r, g, g, g, g, b, b, y, y, y] },
            { numbers: dsc, colors: [b, b, b, y, y, y, r, r, r, g, g] },
            { numbers: dsc, colors: [g, g, r, r, r, r, y, y, b, b, b] }      
        ]
    },
    {
        name: "bingo",
        structure: [
            { numbers: "10,6,2,8,3,4,12,5,9,7,11", colors: Array(11).fill(r) },
            { numbers: "9,12,4,6,7,2,5,8,11,3,10", colors: Array(11).fill(y) },
            { numbers: "8,2,10,12,6,9,7,4,5,11,3", colors: Array(11).fill(g) },
            { numbers: "5,7,11,9,12,3,8,10,2,6,4", colors: Array(11).fill(b) }      
        ]
    }
]  

class Grid {
    constructor(gridName) {
        this.gridName = gridName;
    }
    
    generateGrid(playerSheetNumber = 0) {
        // getData
        const gridIndex = grids.findIndex((element) => element.name == this.gridName);        
        const data = grids[gridIndex].structure;
        const playZone = document.getElementById("playZone");
        
        // Create table
        const grid = document.createElement("div");
        grid.setAttribute("id", `playerSheet${playerSheetNumber}`);
        grid.setAttribute("class", "playersheet-wrapper");
        playZone.insertAdjacentElement("beforeend", grid);
    
        // Create table head
        const tableHeader = document.createElement("div");
        tableHeader.setAttribute("contenteditable", "true");
        tableHeader.setAttribute("id", `playerName${playerSheetNumber}`);
        tableHeader.setAttribute("spellcheck", false);
        tableHeader.setAttribute("class", "table-header");
        tableHeader.textContent = "Enter your name";
        grid.appendChild(tableHeader);
        
        // Create and populate cells for each row
        for (let i = 0; i < 4; i++) {
    
          // Create rows
          const row = document.createElement("div");
          row.setAttribute("class", `grid-row`);
    
          // Create cells  
          const numbersArray = data[i].numbers.split(",");

          for (let j = 0; j < numbersArray.length; j++) {
            // Cell container
            const cellContainer = document.createElement("div");
            cellContainer.setAttribute("class", `${data[i].colors[j]}-bg cell-container`); 

            // Cell
            const cell = document.createElement("div");
            cell.setAttribute("class", `cell ${data[i].colors[j]}-light-bg ${data[i].colors[j]}-border ${data[i].colors[j]}-text`); 
            cell.textContent = numbersArray[j];
            
            // Attach Cells
            row.appendChild(cellContainer);
            cellContainer.appendChild(cell);
          };

          // Create lock cell
            // Lock cell container
            const lockContainer = document.createElement("div");
            lockContainer.setAttribute("class", `${data[i].colors[data[i].colors.length - 1]}-bg cell-container`); 

            // Lock cell
            const lock = document.createElement("div");
            lock.setAttribute("class", `lock-icon ${data[i].colors[data[i].colors.length - 1]}-text-light`);
            lock.innerHTML = '<i class="fa-solid fa-unlock"></i>';

            // Attach Lock Cell
            row.appendChild(lockContainer);
            lockContainer.appendChild(lock);

          // Attach row
          grid.appendChild(row);
        }       
    
        // Add malus row
        const penaltyRow = document.createElement("div");
        penaltyRow.setAttribute("class", "penalty-row-container");
        for (let i = 1; i < 5; i++) {
            const penaltyCell = document.createElement("div");
            penaltyCell.setAttribute("class", "cell white-bg grey-border");
            penaltyRow.appendChild(penaltyCell);
        }

        grid.appendChild(penaltyRow);
        
        return grid;
      }
}

export { Grid };