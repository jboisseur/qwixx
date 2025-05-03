const grids = [
    {
        name: "classicGrid",
        architecture: [
            { numbers: "2,3,4,5,6,7,8,9,10,11,12", color: "red" },
            { numbers: "2,3,4,5,6,7,8,9,10,11,12", color: "yellow" },
            { numbers: "12,11,10,9,8,7,6,5,4,3,2", color: "green" },
            { numbers: "12,11,10,9,8,7,6,5,4,3,2", color: "blue" }      
        ],
        rules: ""
    }
]  

class Grid {
    constructor(gridName) {
        this.gridName = gridName;
    }
    
    generateGrid(playerSheetNumber = 0) {
        // getData
        const gridIndex = grids.findIndex((element) => element.name == this.gridName);
        const data = grids[gridIndex].architecture;
        
        // Create table
        const grid = document.createElement("table");
        grid.setAttribute("id", `playerSheet${playerSheetNumber}`);
        
    
        // Create table head
        const tableHeader = grid.createTHead();
        const th = document.createElement("th");
        th.setAttribute("scope", "colgroup");
        th.setAttribute("colspan", "11");
        th.setAttribute("contenteditable", "true");
        th.setAttribute("id", `playerName${playerSheetNumber}`);
        th.setAttribute("spellcheck", false);
        th.textContent = "Enter your name"
        tableHeader.appendChild(th);
        
        // Create and populate cells for each row
        for (let i = 0; i < 4; i++) {
    
          // Create rows
          grid.insertRow();
          const rows = grid.rows;
          rows[i].setAttribute("class", `${data[i].color}bg`); // add row background color
    
          // Create cells  
          const row = data[i].numbers.split(",");
          row.forEach( (item, index) => {     
            rows[i].insertCell();
            const cell = rows[i].cells[index];
            // add number
             cell.innerHTML = item;
            // add color cell.style.backgroundColor = `var(--${data[i].color})`;
            })
        }
    
        // Add malus row
        grid.insertRow();
        const rows = grid.rows;
        const lastRowIndex = rows.length - 1;
        rows[lastRowIndex].insertCell();
        rows[lastRowIndex].cells[0].setAttribute("colspan", "7");
    
        for (let i = 1; i < 5; i++) {
            rows[lastRowIndex].insertCell();
            rows[lastRowIndex].cells[i].innerHTML = "-5";
        }
        
        return grid;
      }
}

export { Grid };