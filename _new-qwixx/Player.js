class Player {
    constructor(gridId, name, isMain, moves) {
        this.gridId = gridId; // string
        this.name = name; // string
        this.isMain = isMain; // boolean
        this.moves = moves; // array
    }

    displayPlayerName(location, name) {
        return location.innerText = name;
    }

    becomeMain(player) {
        return player.isMain = true;
    }

    removeMain(player) {
        return player.isMain = false;
    }

    resetMoves() {
        return moves = [];
    }
}
export { Player };