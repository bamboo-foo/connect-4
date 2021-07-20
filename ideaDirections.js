function dropChip(botRow, colClicked, chipColor) { // so call with game board size, event clickcol, and whos turn it is or chipcolor?
	// can we recurse here too? call a method on bottom in col, and that method if 
	let cellEmpty = 1; //assumes empty
	while (cellEmpty) { // put safety in (&&(j<20))
		let cellFilled = 0;
		cellFilled = cell[botRow][colClicked].dropHere(chipColor);
		cellEmpty = cellEmpty + cellFilled; //wasCellFilled()
		botRow = botRow - 1; //moveUp()
		// j++; safety
	}
}

function direction(row, col, ogRow, ogCol) { //this is part of a is there a win? part of a turn though. it gets tested right away.
	//so the og's are optional and if given then establish the directions to call from considering which cardinal you are on
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.filled = false;// rack states
	}

	dropHere(chipColor) {
		// remember to hadnle rackState
		//if filled return -1;
		//get state
		if (rackState[rackState.length - 1].isCellCaptured(this.row, this.col)) { // is this really an array? or like an object with many objects? they first key could be like an array then where it is the value and turn #
			return 0; // this is a fail can't drop here can we return false?
		} else {
			rackState[rackState.length - 1].captureCell(this.row, this.col, chipColor) // so is it redundant to have turn in rackState but also be passed it when methods are being called? or i guess the controller will set the state in rackState and pass the arguments to all functions and methods
			this.renderCell(chipColor)// render this change too...
			this.isThereAWinner(chipColor); // should be done by controller.
			return 1;
		}
	}

	renderCell(color) {
		cell[this.row][this.col].setAttribute('style', `background-color: ${color}`);
	}

	//	This should be done by controller.
	isThereAWinner(color) {
		if (n === 0) {
			return 
		}
		direction(?row, ?col, this.row, this.col) {
			direction(?row, ?col) {
				
			}
		}
	}
}

function cardinalAround(centralRow, centralCol) {
	const principalDirctions = { //  these are summing on top basically
		  right: [0, 1], // so for left and down, etc... we can multiply these principals by -1
		  up: [-1, 0],
		  diagUpRight: [-1, 1],
		  diagDownRight: [1, 1]
	},
		  mirroredAxis = principalDirections.map();// how to do *-1 on it?
	
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
    return `${Object.keys(direction)}: ${ourArrCells};`
});
