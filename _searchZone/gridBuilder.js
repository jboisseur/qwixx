class Cell {
    constructor(location, value, color, status) {
        this.location = location,
        this.value = value,
        this.color = color,
        this.status = status
    }
}

class Row {
    constructor(rowId, order, color) {
        this.rowId = rowId,
        this.order = order,
        this.color = color
    }

    get cells() {
        return this.buildRow();
    }
    
    buildRow() {
        let cells = {};

        if (this.order == "asc") {
            for (let i = 0; i <= 10; i++) {
                let j = new Cell(i, i + 2, this.color, 0);
                cells[i] = j;
            }           
        }

        else {
            for (let i = 10; i >= 0; i--) {
                let j = new Cell(10 - i, i + 2, this.color, 0);
                cells[i] = j;
            }
        }

        return cells
    };
}

class Grid {
    constructor(gridId, rows) {
        this.gridId = gridId
        this.rows = rows
    }

    get grid() {
        return this.buildGrid();
    }

    buildGrid() {
        let grid = {};

        grid["gridId"] = this.gridId;

        for (let i = 0; i < this.rows.length; i++) {
            grid["row_" + (i + 1)] = new Row(i, this.rows[i][0], this.rows[i][1]).cells;            
        }

        return grid;
    }
}

// instanciation
const grid_1 = new Grid(1, [["asc", "red"], ["desc", "green"]]);
console.log(grid_1.grid);

// Montage de l'arbre correspondant
let grid = document.getElementById("grid");
let row = document.createElement("div");
grid.appendChild(row);
let cellElement = document.createElement("span");
let cellContent = document.createTextNode("CELL ONE");
row.appendChild(cellElement);
cellElement.appendChild(cellContent);
document.body.insertBefore(row, grid);

/* objet Grid à construire
let grid = {
    id: 1,

    row_1 : {
        cell_1 : {
            value: 2,
            color: red,
            status: 0
        }
    },
    row_2 : ,
    row_3 : ,
    row_4 : 
}*/