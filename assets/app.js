class RackState {
    //	todo: if you go back to a previous rack state and a move is made the future rack states should be deleted.  like new game you could undo, but after you make one move you can't undo to previous game same with normal undo redo can't undo once make a move and push redo to go forward to previous game's state.
    static #turns = 0;
	
	constructor(turn, rack) {
        this.turn = turn;
		this.rack = rack; // matrix with 0 empty 1 p1 2 p2
		RackState.#turns++;
	}
    
	isCellCaptured(row, col) {
        return this.rack[row][col];
	}
    
	captureCell(row, col, captor) {
        let turn2 = new RackState(RackState.whatTurnIsIt() + 1, turn1.rack); // so turn1 should rep the current turn turn2 is new one...
		if (captor === 'goldenrod') {
            turn2.rack[row][col] = 1;
		} else if (captor === 'blue') {
            turn2.rack[row][col] = 2;
		}
		console.log(turn2);
	}
    
	static whatTurnIsIt() {
        return this.#turns;
	}
    
	static undo() {
		//move to oprevious state and then rerender every cell that is non zero in that rack state
    }
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.el = document.getElementById(`${this.row}${this.col}`);
	}

	dropHere(chipColor) { // this needs turn
		// remember to hadnle rackState
		//if filled return -1;
		//get state
		// console.log('hi');
		// console.log(this.row, this.col);
		if (turn1.isCellCaptured(this.row, this.col)) { // is this really an array? or like an object with many objects? they first key could be like an array then where it is the value and turn #
			return 0; // this is a fail can't drop here can we return false?
		} else {
			this.renderCell(chipColor)// render this change too...
			turn1.captureCell(this.row, this.col, chipColor) // so is it redundant to have turn in rackState but also be passed it when methods are being called? or i guess the controller will set the state in rackState and pass the arguments to all functions and methods
			return 1;
		}
		// 	//this.isThereAWinner(chipColor); // should be done by controller. // spaghetti testing
		// 	return 1;
		// }
	}
	
	renderCell(color) {
		this.el.setAttribute('style', `background-color: ${color}`);
	}
	
	//	This should be done by controller.
	// isThereAWinner(color) {
		// if (n === 0) {
			// return
			// }
			// direction(?row, ?col, this.row, this.col) {
				// direction(?row, ?col) {
					// 
					// }
					// }
					// }
				}
				
//	Init
//	Opening state and init cells
let initBoardArr = [];

for (let i = 0; i < 6; i++) {
    initBoardArr[i] = new Array(7).fill(0);
};

let turn1 = new RackState(1, initBoardArr), // this is causing a serious PROBLEM!! when you try to mod one spot it does the spot in every array!!
	cell = [];


const wholeRack = document.getElementById('rack');

wholeRack.addEventListener('click', controller);

let whereClicked = '',
	clickedCol = '',
	rackCols = 7,
	rackRows = 6; // what is going on? this initiates cell watch out for other calls

function controller(mouseEvent) {
	
    initCells(rackRows, rackCols);
	
	whereClicked = mouseEvent.target.getAttribute('id');
	clickedCol = parseInt(whereClicked[1]);
	
    dropChip(rackRows - 1, clickedCol, RackState.whatTurnIsIt())
}


function initCells(noOfRows, noOfColumns) {
    for (let i = 0; i < noOfRows; i++ ) {
        cell[i] = [];
        for (let j = 0; j < noOfColumns; j++) {
            cell[i][j] = new Cell(i, j);
        }
    }
}

// controller();

function moveRegistered(mouseEvent) { // starting to delete this for flow?
}

function dropChip(lowestRowIdx, colClicked, chipColor) { // so call with game board size, event clickcol, and whos turn it is or chipcolor?
	if (chipColor % 2) { // feels like spaghetti
		chipColor = 'goldenrod';
	} else {
		chipColor = 'blue';
	}

	// cell[lowestRowIdx][colClicked].dropHere(chipColor);
	// can we recurse here too? call a method on bottom in col, and that method if 
	let cellEmpty = 1; //assumes empty
    let j = 0;
	while ((cellEmpty)&&(j<20)&&(lowestRowIdx >= 0)) { // put safety in (&&(j<20)) hopefully stops indexing out of bounds
		let cellFilled = 0;
		console.log(lowestRowIdx, colClicked);
		cellFilled = cell[lowestRowIdx][colClicked].dropHere(chipColor);
		cellEmpty = cellEmpty - cellFilled; //wasCellFilled()
		lowestRowIdx = lowestRowIdx - 1; //moveUp() NOT STOPPING AT 0 goes below
		j++; // safety
	}
}


// win logic
// this should take any cell and return an array of vectors(arrays)
// The vectors should be the location such taht when you get the contents if every is the same then that contents is the winner.

function cardinalAround(refCellRowIdx, refCellColIdx) { // really this should be called like possibleWinCells
	const unitVectors = { //  these are summing on top basically
		right: [0, 1], // so for left and down, etc... we can multiply these principals by -1
		up: [-1, 0],
		diagUpRight: [-1, 1],
		  diagDownRight: [1, 1]
		};
		//mirroredDirections = pr.map();// how to do *-1 on it?
	const scaledVectors = {};

	//Object.keys(unitVectors).map((key) => scaledVectors[key] = unitVectors[key] * i)
	for (const uVector in unitVectors) {
		let scalingArr = [];
		for (let i = 0; i < 4; i++) {
			let scalingPoint = [];
			for (let j = 0; j < 2; j++) {
				scalingPoint.push(unitVectors[uVector][j] * i)
			}
			scalingArr.push(scalingPoint);
		}
		scaledVectors[uVector] = scalingArr;
	}
	// console.log(scaledVectors);
	let cellsToBeChecked = [];
	for (vector in scaledVectors) {
		let posArr = [];
		cellsToBeChecked.push(scaledVectors[vector].map((translation) => {
			// console.log(translation);
			// limit border, return only if inbounds, second filter for length > 3
			posArr = [];
			posArr[0] = refCellRowIdx + translation[0];
			posArr[1] = refCellRowIdx + translation[1];
			if ((posArr[0] >= 0)&&(posArr[0] < rackRows)&&(posArr[1] >= 0)&&(posArr[1] < rackCols)) {
				return posArr;
			}
		})); //so when checking for every first off limit this maps output and check length to eliminate out of bounds or borders duplication 
	}
	let checkCells = cellsToBeChecked.map( (array) => array.filter( (pos) => typeof pos === 'object'));
	let validCheckCells = checkCells.filter( array => array.length === 4 );
	console.log(validCheckCells);
}
