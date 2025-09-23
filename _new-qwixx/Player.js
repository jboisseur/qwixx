class Player {
    constructor(gridId, name, isMain) {
        this.gridId = gridId; // string
        this.name = name; // string
        this.isMain = isMain; // boolean
    }

    displayPlayerName(location, name) {
        return location.innerText = name;
    }
}
export { Player };