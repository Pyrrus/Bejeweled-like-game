var Match3 = Match3 || {};

Match3.Board = function(state, rows, cols, blockVariations) {

  this.state = state;
  this.rows = rows;
  this.cols = cols;
  this.blockVariations = blockVariations;

  //main grid
  this.grid = [];

  for(var i = 0; i < rows; i++) {
    this.grid.push([]);

    for(var j = 0; j < cols; j++) {
      this.grid[i].push(0);
    }
  }

  //reserve grid on the top, for when new blocks are needed
  this.reserveGrid = [];

  this.RESERVE_ROW = rows;

  for(var i = 0; i < this.RESERVE_ROW; i++) {
    this.reserveGrid.push([]);

    for(var j = 0; j < cols; j++) {
      this.reserveGrid[i].push(0);
    }
  }

  this.populateGrids();
  this.populateReserveGrid();

  this.consoleLog();

};


Match3.Board.prototype.populateGrids = function() {
  var Variations;

  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      Variations = Math.floor(Math.random() * this.blockVariations) + 1;
      this.grid[i][j] = Variations;
    }
  }
};

Match3.Board.prototype.populateReserveGrid = function() {
  var Variations;

  for(var i = 0; i < this.RESERVE_ROW; i++) {
    for(var j = 0; j < this.cols; j++) {
      Variations = Math.floor(Math.random() * this.blockVariations) + 1;
      this.reserveGrid[i][j] = Variations;
    }
  }
};

Match3.Board.prototype.consoleLog =  function() {
  
  var stringOuput = '';

  for(var i = 0; i < this.RESERVE_ROW; i++) {
    stringOuput += '\n';
    for(var j = 0; j < this.cols; j++) {
      stringOuput += ' ' + this.reserveGrid[i][j];
    }
  }

  stringOuput += '\n';
  stringOuput += '\n';

  for(var i = 0; i < this.rows; i++) {
     stringOuput += '\n';
    for(var j = 0; j < this.cols; j++) {
      stringOuput += ' ' + this.grid[i][j];
    }
  }

  console.log(stringOuput);
};

// swapping blocks
Match3.Board.prototype.swapping = function(at, target) {
  var holder = this.grid[target.row][target.col];
  this.grid[target.row][target.col] = this.grid[at.row][at.col];
  this.grid[at.row][at.col] = holder;

  this.consoleLog();
};

// check if blocks are adjacent
Match3.Board.prototype.checkAdjacent = function(at, target) {
  var diffRow = Math.abs(at.row - target.row);
  var diffCol = Math.abs(at.col - target.col);

  var isAdjactent = (diffRow == 1 && diffCol === 0) || (diffRow == 0 && diffCol === 1);

  return isAdjactent;
};


// check if chained
Match3.Board.prototype.isChained = function(block) {
  var isChained = false;
  var variations = this.grid[block.row][block.col];
  var row = block.row;
  var col = block.col;

  // left
  if (variations == this.grid[row][col - 1] && variations == this.grid[row][col - 2]) {
    isChained = true;
  }

  // right
  if (variations == this.grid[row][col + 1] && variations == this.grid[row][col + 2]) {
    isChained = true;
  }

  // up
  if (this.grid[row - 2]) {
    if (variations == this.grid[row - 1][col] && variations == this.grid[row - 2][col]) {
      isChained = true;
    }
  }
  

  // down
  if (this.grid[row + 2]) {
    if (variations == this.grid[row + 1][col] && variations == this.grid[row + 2][col]) {
      isChained = true;
    }
  }

  // center - hor
  if (variations == this.grid[row][col - 1] && variations == this.grid[row][col + 1]) {
    isChained = true;
  }

  // center - ver
  if (this.grid[row + 1] && this.grid[row - 1]) {
    if (variations == this.grid[row + 1][col] && variations == this.grid[row - 1][col]) {
      isChained = true;
    }
  }

  return isChained;
};


// find all chains
Match3.Board.prototype.findAllChain = function() {
  var chained = [];

  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      if (this.isChained({row: i, col: j})) {
        chained.push({row: i, col: j});
      }
    }
  }

  return chained;
};

// clear chain
Match3.Board.prototype.clearChains = function() {
  var chainedBlocks = this.findAllChain();

  chainedBlocks.forEach(function(block) {
    this.grid[block.row][block.col] = 0;
  }, this);
};

// drop blocks when zero in main block
Match3.Board.prototype.dropBlock = function(atRow, targetRow, col) {
  this.grid[targetRow][col] = this.grid[atRow][col];
  this.grid[atRow][col] = 0;
};

// drop reserve blocks when zero in main block
Match3.Board.prototype.dropReserveBlock = function(atRow, targetRow, col) {
  this.grid[targetRow][col] = this.reserveGrid[atRow][col];
  this.reserveGrid[atRow][col] = 0;
};

// update blocks when fill in empty slots
Match3.Board.prototype.updateGrid = function() {
  var foundBlock;

  for (var i = this.rows - 1; i >= 0; i--) {
    for(var j = 0; j < this.cols; j++) {
      if (this.grid[i][j] === 0) {
        foundBlock = false;


        for (k = i - 1; k >= 0; k--) {
          if (this.grid[k][j] > 0) {
            this.dropBlock(k, i, j);
            foundBlock = true;
            break;
          }
        }

        if (!foundBlock) {
          for (k = this.RESERVE_ROW - 1; k >= 0; k--) {
            if (this.reserveGrid[k][j] > 0) {
              this.dropReserveBlock(k, i, j);
              break;
            }
          }
        }
      }
    }
  }

  this.populateReserveGrid();
};