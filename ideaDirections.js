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
		let turn2 = new RackState(RackState.whatTurnIsIt() + 1, turn1);
		if (captor === 'red') {
			turn2.rack[row][col] = 1;
		} else if (captor === 'blue') {
			turn2.rack[row][col] = 2;
		}
		
	}

	static whatTurnIsIt() {
		return this.#turns;
	}

	static undpo() {
		
	}
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.filled = false;// rack states
	}

	dropHere(chipColor) { // this needs turn
		// remember to hadnle rackState
		//if filled return -1;
		//get state
		if (turn1.isCellCaptured(this.row, this.col)) { // is this really an array? or like an object with many objects? they first key could be like an array then where it is the value and turn #
			return 0; // this is a fail can't drop here can we return false?
		} else {
			turn1.captureCell(this.row, this.col, chipColor) // so is it redundant to have turn in rackState but also be passed it when methods are being called? or i guess the controller will set the state in rackState and pass the arguments to all functions and methods
			this.renderCell(chipColor)// render this change too...
			this.isThereAWinner(chipColor); // should be done by controller.
			return 1;
		}
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


function cardinalAround(centralRow, centralCol) {
	const principalDirctions = { //  these are summing on top basically
		right: [0, 1], // so for left and down, etc... we can multiply these principals by -1
		up: [-1, 0],
		diagUpRight: [-1, 1],
		  diagDownRight: [1, 1]
		},
		mirroredDirections = principalDirections.map();// how to do *-1 on it?
		
}
	
	// So below is some idea of how to take ordinal? vector and scale them 
	
let myDirArr = Object.values(principalDirections);
let scaledVectors = myDirArr.map((direction) => {
	let s = 0;
	let ourArrCells = [];
    while (s < 4) {
		ourArrCells.push(direction.map( pos => pos * s));
        s++;
    };
    return ourArrCells;
});

// I am thinking of splitting below reusing allowing a cb and calling it going up.  so you can see if to fill a cell or to animate a chip dropping through

function dropChip(lowestRow, colClicked, chipColor) { // so call with game board size, event clickcol, and whos turn it is or chipcolor?
	if (chipColor % 2) {
		chipColor = 'red';
	} else {
		chipColor = 'blue';
	}
	// can we recurse here too? call a method on bottom in col, and that method if 
	let cellEmpty = 1; //assumes empty
	while ((cellEmpty)&&(j<20)) { // put safety in (&&(j<20))
		let cellFilled = 0;
		cellFilled = cell[lowestRow][colClicked].dropHere(chipColor);
		cellEmpty = cellEmpty + cellFilled; //wasCellFilled()
		lowestRow = lowestRow - 1; //moveUp()
		j++; // safety
	}
}

function direction(row, col, ogRow, ogCol) { //this is part of a is there a win? part of a turn though. it gets tested right away.
	//so the og's are optional and if given then establish the directions to call from considering which cardinal you are on
}

function controller() {
    let rackCols = 7,
        rackRows = 6;

    initCells(rackRows, rackCols);
	
	let turn1 = new RackState(1, Array(6).fill(Array(7).fill(0)));

    const wholeRack = document.getElementById('rack');

    wholeRack.addEventListener('click', moveRegistered);


}

let cell = [];

function initCells(noOfRows, noOfColumns) {
    for (let i = 0; i < noOfRows; i++ ) {
        cell[i] = [];
        for (let j = 0; j < noOfColumns; j++) {
            cell[i][j] = new Cell(i, j);
        }
    }
}

function moveRegistered(mouseEvent) {
    let whereClicked = mouseEvent.target.getAttribute('id'),
        clickedCol = whereClicked[1];

	dropChip(rackRows, clickedCol, RackState.whatTurnIsIt());

    // let mine = cell[clickedRow][clickedCol].dropChip(); // throwback it's mine tho (the cell)
    // mouseEvent.target.innerText = mine;
} 

