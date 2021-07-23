class RackState {
    //	todo: if you go back to a previous rack state and a move is made the future rack states should be deleted.  like new game you could undo, but after you make one move you can't undo to previous game same with normal undo redo can't undo once make a move and push redo to go forward to previous game's state.
    static #turns = -1;
	
	constructor(turn, rack) {
        this.turn = turn;
		this.rack = rack; // matrix with 0 empty 1 p1 2 p2
		RackState.#turns++;
	}
    
	isCellCaptured(row, col) {
        return this.rack[row][col];
	}
    
	captureCell(row, col, captor) {
		let previousRack = turn[RackState.whatTurnIsIt()].rack.map( row => row.map( cell => cell));
		// console.log('in captureCell' + RackState.whatTurnIsIt())
		// console.log(previousRack)
        turn[RackState.whatTurnIsIt() + 1] = new RackState(RackState.whatTurnIsIt() + 1, previousRack); // so turn1 should rep the current turn turn2 is new one...
		// console.log('after turn assignment creation new state' + RackState.whatTurnIsIt())
		if (captor === 'goldenrod') {
			// console.log('in if statement' + RackState.whatTurnIsIt())
            turn[RackState.whatTurnIsIt()].rack[row][col] = 1;
		} else if (captor === 'blue') {
            turn[RackState.whatTurnIsIt()].rack[row][col] = 2;
		}
		//console.log(turn2);
	}
    
	static whatTurnIsIt() {
        return this.#turns;
	}
    
	static undo() {
		//move to oprevious state and then rerender every cell that is non zero in that rack state
		this.#turns = this.#turns - 1;
    }

	static redo() {
		//move to oprevious state and then rerender every cell that is non zero in that rack state
		this.#turns = this.#turns + 1;
    }
}

let turn = [];

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
		if (turn[RackState.whatTurnIsIt()].isCellCaptured(this.row, this.col)) { // is this really an array? or like an object with many objects? they first key could be like an array then where it is the value and turn #
			return 0; // this is a fail can't drop here can we return false?
		} else {
			this.renderCell(chipColor)// render this change too...
			turn[RackState.whatTurnIsIt()].captureCell(this.row, this.col, chipColor)
			cardinalAround(this.row, this.col) // so is it redundant to have turn in rackState but also be passed it when methods are being called? or i guess the controller will set the state in rackState and pass the arguments to all functions and methods
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

let cell = [];

turn[0] = new RackState(0, initBoardArr);
// Object.freeze(turn[0].rack);
// console.log(turn[0].rack[5])


const wholeRack = document.getElementById('rack'),
	  undoEl = document.getElementById('undo'), //pop while length > 1
	  redoEl = document.getElementById('redo'),
	  newGameEl = document.getElementById('ng');


wholeRack.addEventListener('click', controller);
undoEl.addEventListener('click', handleUndo);
redoEl.addEventListener('click', handleRedo);
// newGameEl.addEventListener('click', handleNG);

redoEl.disabled = true;

let whereClicked = '',
	clickedCol = '',
	rackCols = 7,
	rackRows = 6; // what is going on? this initiates cell watch out for other calls

function controller(mouseEvent) {
	
    initCells(rackRows, rackCols);
	
	whereClicked = mouseEvent.target.getAttribute('id');
	clickedCol = parseInt(whereClicked[1]);
	console.log(RackState.whatTurnIsIt());
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


function handleUndo(mouseEvt) {
	// turn.pop();
	RackState.undo();
	reRender() // .disable set it to false but then true again if there is no more like turn[RackState.whatTurn + what turn it is ] is undefined then redisable redo 
	redoEl.disabled = false;
}

function handleRedo(mouseEvt) {
	// turn.pop();
	if (RackState.whatTurnIsIt() < turn.length - 1) {
		RackState.redo();
		reRender()
	}
}
// controller();
function reRender() {
	for (let i = 0; i < 6; i++ ) {
	// cell[i] = [];
		for (let j = 0; j < 7; j++) {
			// console.log(cell)
			switch(turn[RackState.whatTurnIsIt()].rack[i][j]) {
				case 0:	
					cell[i][j].renderCell('rgb(49, 42, 42)');
					break;
				case 1:	
					cell[i][j].renderCell('goldenrod');
					break;
				case 2:	
					cell[i][j].renderCell('blue');
					break;
			} 
		}
	}
}

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
		//console.log(lowestRowIdx, colClicked);
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
		let scalingArr = [],
			scaleFactor = 3;

		//  The unit vectors are scaled in both directions
		for (let i = scaleFactor * -1; i <= scaleFactor; i++) {
			let scalingPoint = [];

			// j helps you set up the x,y of each point in the scaled vector
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
			posArr[1] = refCellColIdx + translation[1];
			if ((posArr[0] >= 0)&&(posArr[0] < rackRows)&&(posArr[1] >= 0)&&(posArr[1] < rackCols)) {
				return posArr;
			}
		})); //so when checking for every first off limit this maps output and check length to eliminate out of bounds or borders duplication 
	}

	let checkCells = cellsToBeChecked.map( (array) => array.filter( (pos) => typeof pos === 'object'));
//	let validCheckCells = checkCells.filter( array => array.length === 4 ); um we need those cells, what if three, so ref plus 2 right, and .... 1 left!
	//console.log(checkCells); // now map a new return where you go to the cells in question and call the isCellCaptured method on the cell, but no it must return whoCaptured because we mut check or simply if every() then get the DOM nodes and change their color or whatevs
	let capturedDirections = checkCells.map( (direction) => {
		// let whoCapturedCells = direction.map( (cell) => {
		// 	let row = cell[0],
		// 		col = cell[1];

		// 	return turn1.isCellCaptured[row][col];
		// }) 

		// Warning loss of index, which cell will you highlight?
		
		// fix warning

		let cellNCapture = direction.map( cell => {
			let row = cell[0],
				col = cell[1];
	
			cell.push(turn[RackState.whatTurnIsIt()].isCellCaptured(row, col));
			return cell;
		})

		
		return cellNCapture;
	})
	
	let possibleWinningArrays = [];
	capturedDirections.forEach( direction => {
		//console.log(direction);
		for (let i = 0; i < direction.length - 3; i++) {
			possibleWinningArrays = (direction.slice(i, i + 4));
			//console.log(possibleWinningArrays)
			
			// possibleWinningArrays.every( cell => console.log(cell))

			if (possibleWinningArrays.every( cell => (cell[2] === 1))) {
				//console.log(possibleWinningArrays)
				winner(1, possibleWinningArrays);
			} else if (possibleWinningArrays.every( cell => (cell[2] === 2))) {
				winner(2, possibleWinningArrays);
			}
		}
	})
}

function winner(winningPlayer, winningCells) {
	wholeRack.removeEventListener('click', controller);
	undoEl.removeEventListener('click', handleUndo);
	winningCells.forEach( circle => cell[circle[0]][circle[1]].renderCell('green'));
	
	const messageEl = document.querySelector('.message');

	messageEl.innerText = (`Player ${winningPlayer} has won !!!`);
	// delete event listener on rack
}