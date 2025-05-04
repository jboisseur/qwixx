  class Player {
    constructor(playerId, isMain, nbCC, moves) {
        this.playerId = playerId; // number
        this.isMain = isMain; // boolean
        this.nbCC = nbCC; // nbCC stands for number of crossed cells (array)
        this.moves = moves;
      }
    
    mainSwitcher(player) {
      return player.isMain ? false : true;
    }

    update_nbCC(nbCC, rowIndex, className) {
      if (className == "checkCell") {
        nbCC[rowIndex] += 1;
      }

      else if (className == "allowedCell" || className == "allowCellColorLine" || className == "minus5" || className == "allowedCell allowCellColorLine") {
        nbCC[rowIndex] -= 1;
      }
    }

    reset_moves() {
      return { 
        "cellMove1": { cell: null, class: null },
        "cellMove2": { cell: null, class: null }
      };
    }
  }

export { Player };