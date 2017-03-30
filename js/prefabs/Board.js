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

  this.RESERVE_ROW = 5;

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
