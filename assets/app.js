class RackState {
    static #turns = -1;
	static #wasLastTurnUndo = false;
	
	constructor(turn, rack) {
        this.turn = turn;
		this.rack = rack; 
		RackState.#turns++;
	}
    
	isCellCaptured(row, col) {
        return this.rack[row][col];
	}
    
	captureCell(row, col, captor) {
		let previousRack = turn[RackState.whatTurnIsIt()].rack.map( row => row.map( cell => cell));
		
        turn[RackState.whatTurnIsIt() + 1] = new RackState(RackState.whatTurnIsIt() + 1, previousRack); 
		if (captor === 'goldenrod') {
			turn[RackState.whatTurnIsIt()].rack[row][col] = 1;
			RackState.wasUndo();
		} else if (captor === '#2596be') {
            turn[RackState.whatTurnIsIt()].rack[row][col] = 2;
			RackState.wasUndo();
		}
	}
    
	static whatTurnIsIt() {
        return this.#turns;
	}
    
	static undo() {
		this.#turns = this.#turns - 1;
		this.#wasLastTurnUndo = true;
    }

	static redo() {
		this.#turns = this.#turns + 1;
    }

	static wasUndo() {
		this.#wasLastTurnUndo = false;
	}

	static getUndo() {
		return this.#wasLastTurnUndo;
	}
}

let turn = [];

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.el = document.getElementById(`${this.row}${this.col}`);
	}

	dropHere(chipColor) { 
		if (turn[RackState.whatTurnIsIt()].isCellCaptured(this.row, this.col)) { 
			return 0; 
		} else {
			this.renderCell(chipColor)
			turn[RackState.whatTurnIsIt()].captureCell(this.row, this.col, chipColor)
			cardinalAround(this.row, this.col) 
			return 1;
		}
	}
	
	renderCell(color, win) {
		this.el.setAttribute('style', `background-color: ${color}`);
		if (win) {
			this.el.setAttribute('style', `background-color: ${color}; background-image: linear-gradient(45deg, black, ${color}), linear-gradient(-45deg, black, ${color}); background-size: 9px 9px; background-repeat: repeat`)
		}
	}
	
}
				
//	Init
//	Opening state and init cells
let initBoardArr = [];

for (let i = 0; i < 6; i++) {
    initBoardArr[i] = new Array(7).fill(0);
};

let cell = [];

turn[0] = new RackState(0, initBoardArr);


const wholeRack = document.getElementById('rack'),
	  undoEl = document.getElementById('undo'), 
	  redoEl = document.getElementById('redo'),
	  newGameEl = document.getElementById('ng');


wholeRack.addEventListener('click', controller);
undoEl.addEventListener('click', handleUndo);
redoEl.addEventListener('click', handleRedo);
newGameEl.addEventListener('click', handleNG);

redoEl.disabled = true;

let whereClicked = '',
	clickedCol = '',
	rackCols = 7,
	rackRows = 6; 

function controller(mouseEvent) {
	
    initCells(rackRows, rackCols);
	
	whereClicked = mouseEvent.target.getAttribute('id');
	clickedCol = parseInt(whereClicked[1]);
	console.log(RackState.whatTurnIsIt());
	if (RackState.getUndo()) {
		while(turn.length > RackState.whatTurnIsIt() + 1) {
			turn.pop();
		}
	}

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
	if (RackState.whatTurnIsIt() > 0) {
		RackState.undo();
		reRender()  
		redoEl.disabled = false;
	}
}

function handleRedo(mouseEvt) {
	if (RackState.whatTurnIsIt() < turn.length - 1) {
		RackState.redo();
		reRender()
	}
}

function reRender() {
	for (let i = 0; i < 6; i++ ) {

		for (let j = 0; j < 7; j++) {
			
			switch(turn[RackState.whatTurnIsIt()].rack[i][j]) {
				case 0:	
					cell[i][j].renderCell('rgb(49, 42, 42)');
					break;
				case 1:	
					cell[i][j].renderCell('goldenrod');
					break;
				case 2:	
					cell[i][j].renderCell('#2596be');
					break;
			} 
		}
	}
}

function moveRegistered(mouseEvent) { 
}

function dropChip(lowestRowIdx, colClicked, chipColor) { 
	if (chipColor % 2) { 
		chipColor = 'goldenrod';
	} else {
		chipColor = '#2596be';
	}

	let cellEmpty = 1; 
    let j = 0;
	while ((cellEmpty)&&(j<20)&&(lowestRowIdx >= 0)) { // put safety in (&&(j<20)) 
		let cellFilled = 0;
		cellFilled = cell[lowestRowIdx][colClicked].dropHere(chipColor);
		cellEmpty = cellEmpty - cellFilled; 
		lowestRowIdx = lowestRowIdx - 1; 
		j++; 
	}
}


function cardinalAround(refCellRowIdx, refCellColIdx) { 
	const unitVectors = { 
		right: [0, 1], 
		up: [-1, 0],
		diagUpRight: [-1, 1],
		diagDownRight: [1, 1]
	};
		
	const scaledVectors = {};

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
	let cellsToBeChecked = [];
	for (vector in scaledVectors) {
		let posArr = [];
		cellsToBeChecked.push(scaledVectors[vector].map((translation) => {
			// limit border, return only if inbounds, second filter for length > 3
			posArr = [];
			posArr[0] = refCellRowIdx + translation[0];
			posArr[1] = refCellColIdx + translation[1];
			if ((posArr[0] >= 0)&&(posArr[0] < rackRows)&&(posArr[1] >= 0)&&(posArr[1] < rackCols)) {
				return posArr;
			}
		})); 
	}

	let checkCells = cellsToBeChecked.map( (array) => array.filter( (pos) => typeof pos === 'object'));

	let capturedDirections = checkCells.map( (direction) => {

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
		for (let i = 0; i < direction.length - 3; i++) {
			possibleWinningArrays = (direction.slice(i, i + 4));
			

			if (possibleWinningArrays.every( cell => (cell[2] === 1))) {
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
	winningCells.forEach( circle => {
		cell[circle[0]][circle[1]].renderCell('var(--bgnd-light)', true);

	})
	
	const messageEl = document.querySelector('.message');

	messageEl.innerText = (`Player ${winningPlayer} has won !!!`);
}

function handleNG() {
	location.reload();
}