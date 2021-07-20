function dangerMines(noOfMines, boardSize) { //call with difficulty level and No of columns
    let randArr = [];
    for (let i = 0; i < noOfMines; i++) {
        let randArrInner = [];
        randArrInner.push(Math.floor(Math.random()*boardSize));
        randArrInner.push(Math.floor(Math.random()*boardSize));
        randArr.push(randArrInner);
    }
    return randArr;
} 

//console.log(dangerMines(10 * 1.5, 8)); // remember you need to call with more than you need in case they target the same cell.

class Cell {
    constructor(rowIdx, colIdx) {
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
        this.hasMine = false;
        this.hint = 0; // this will also have to be moved to state model!!!
        this.open = false; // this is for undo? so this state will be pushed then upon opne. so this should not even be here... this for now nonexistant and soon to be in the boardState object model
    }

    open() {
        if (this.hasMine) {
            return 'X'; //testing for now
        } //otherwise we can call open on more cells around us....but then this should also check if a hint or a border cell? or not propogate to those?

        // else open this state which should call or expose hints? and then call an around funciton that will get passed this.row and colIDx and call .open() methods on those until border  etc...
    }

    close() {

    }

    placeMine() {
        //if it's contents empty then place a mine in cell and return 1
        if (!this.hasMine) {
            this.hasMine = true; // here we should call hints
            return 1;
        } else {
            return 0;
        }
    }
}

class BoardState {

}

class Worker {
    constructor(target) {
        this.target = target;
    }

    plant() {
        let ifSuccessful = cell[this.target[0]][this.target[1]].placeMine();
        return ifSuccessful;
    }
}

let board = {};

function controller() {
    let boardSize = 8,
        noOfMines = 10,
        seedsForMines = dangerMines(noOfMines * 1.5, boardSize);

    initBoard(boardSize);

    console.log(seedsForMines); //display testing

    supervisor(noOfMines, seedsForMines); // is this like init?This is from settings got to read that !! puts mines on board model `cell`

    const wholeBoard = document.getElementById('board');

    wholeBoard.addEventListener('click', moveRegistered);


}

function supervisor(plantingCells, randomIdxCells) {
    let i = 0;
    let successfulAssignment = 1;
    while (successfulAssignment < plantingCells) { // second part is safety for now
        let worker = new Worker(randomIdxCells[i])
        let success = worker.plant();
        successfulAssignment = successfulAssignment + success; // I may have to track success cases in another variable and i for moving through the array because upon failure it is not assigning workers new targets.  so after duplication it fails.
        i++;
        // randomIdxCells.forEach( pair => console.log(cell[pair[0]][pair[1]]));
    }
}

let cell = [];

function initBoard(noOfColumns) {
    for (let i = 0; i < noOfColumns; i++ ) {
        cell[i] = [];
        for (let j = 0; j < noOfColumns; j++) {
            cell[i][j] = new Cell(i, j);
        }
    }
}

controller();

function moveRegistered(mouseEvent) {
    let whereClicked = mouseEvent.target.getAttribute('id'),
        clickedCol = whereClicked[1],
        clickedRow = whereClicked[0];

    let mine = cell[clickedRow][clickedCol].open();
    mouseEvent.target.innerText = mine;

} 

function lookAround(row, col, cb) {
    for (let i = row - 1; i < row + 1; i++) {
        for (let j = col + 1; col < col + 1; j++ ) {// remember to escape self?
            if (!((i === row)&&(j === col))) {
                cell[i][j];
            }
        }
    }
}
