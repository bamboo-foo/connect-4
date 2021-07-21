class RackState {
    
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
        let turn2 = new RackState(RackState.whatTurnIsIt() + 1, turn1.rack);
		if (captor === 'red') {
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
		
    }
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
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
			console.log('cell is free');
			return 1;
		}
        //    turn1.captureCell(this.row, this.col, chipColor) // so is it redundant to have turn in rackState but also be passed it when methods are being called? or i guess the controller will set the state in rackState and pass the arguments to all functions and methods
		// 	this.renderCell(chipColor)// render this change too...
		// 	//this.isThereAWinner(chipColor); // should be done by controller. // spaghetti testing
		// 	return 1;
		// }
	}
	
	renderCell(color) {
		cell[this.row][this.col].setAttribute('style', `background-color: ${color}`);
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
		chipColor = 'red';
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
