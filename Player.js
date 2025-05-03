  class Player {
    constructor(playerId, isMain) {
        this.playerId = playerId;
        this.isMain = isMain;
      }
    
    mainSwitcher(player) {
      return player.isMain ? false : true;
    }
  }

  class PlayerScoreSheet extends Player {
    constructor(playerId, isMain, nbOfCheckedCellPerLine, pointsArray) {
      super(playerId, isMain);
      this.nbOfCheckedCellPerLine = nbOfCheckedCellPerLine;
      this.pointsArray = pointsArray;
    }
    
    // TODO: add here update function of nbOfCheckedCellPerLine

    // TODO: add here update function of pointsArray
  }

  class PlayerSelection extends Player {
    constructor(playerId, isMain, cellMove1, cellMove2) {
      super(playerId, isMain);
      this.cellMove1 = cellMove1;
      this.cellMove2 = cellMove2;
    } 
  }

export { Player, PlayerSelection, PlayerScoreSheet };