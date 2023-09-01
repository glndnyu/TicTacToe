const Player = (name, symbol) => {
    const moves = [];
    const _name = name;
    const _symbol = symbol;

    const addMoves = (position) => {
        moves.push(position);
    };

    const getMoves = () => moves;

    const getName = () => _name;

    const getSymbol = () => _symbol;

    return { addMoves, getMoves, getName, getSymbol };
};


const Board = () => {
    const board = new Array(9);
    let boardLength = board.length;

    for(let i=0; i<boardLength; i++)
        board[i] = Cell();

    const getBoard = () => board;

    const placeSymbol = (player, index) => {
        if(!board[index].isAvailable()) return;

        board[index].addSymbol(player);
    };

    const printBoard = () => {
        console.log(board.reduce((rows, key, index) => (index % 3 == 0 ? rows.push([key.getSymbol()]) 
        : rows[rows.length-1].push(key.getSymbol())) && rows, []));
    };

    return { getBoard, placeSymbol, printBoard };
};

const Cell = () => {
    let _symbol = 0;

    const addSymbol = (symbol) => {
        _symbol = symbol;
    };

    const getSymbol = () => _symbol;

    const isAvailable = () => {
        return _symbol ? false : true;
    };

    return { addSymbol, getSymbol, isAvailable };
}

const GameController = () => {
    const board = Board();
    const player_one = Player('player 1', 'X');
    const player_two = Player('player 2', 'O');
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                            [0, 3, 6], [1, 4, 7], [2, 5, 8],
                            [0, 4, 8], [2, 4, 6]];
    let activePlayer = player_one;

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === player_one ? player_two : player_one;
    };

    const getActivePlayer = () => activePlayer;

    const _printNewRound = () => {
        board.printBoard();

        console.log(`${getActivePlayer().getName()}'s turn.`);
    };
    
    const playRound = (position) => {
        const player = getActivePlayer();

        board.placeSymbol(player.getSymbol(), position);

        player.addMoves(position);

        _switchPlayerTurn();
        _printNewRound();
    };

    const checkForWin = (player) => {
        const moves = player.getMoves().sort((a,b) => a - b);

        for (const combination of winningCombinations) {
            if (combination.every(cellIndex => moves.includes(cellIndex))) {
              return true;
            }
        }
        return false;
    };
    
    _printNewRound();
    
    return { playRound, getActivePlayer, getBoard: board.getBoard, checkForWin };  
}

const ScreenController = () => {
    const game = GameController();
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, index) => {
        cell.dataset.cell = index;
        cell.addEventListener('click', clickHandleBoard);
    });

    const updateScreen = () => {
        const currentBoard = game.getBoard();

        console.log('hello')

        cells.forEach((cell, index) => {
            cell.innerHTML = currentBoard[index].getSymbol() ? currentBoard[index].getSymbol() : ""
        })
    };

    function clickHandleBoard(e) {
        const index = parseInt(e.target.dataset.cell);
        const _player = game.getActivePlayer();
        game.playRound(index)
        updateScreen();
        e.target.removeEventListener('click', clickHandleBoard)
        if(game.checkForWin(_player)){
            console.log(`${_player.getName()} won!`)
            endGame()
        }
    }

    function endGame(){
        cells.forEach(cell => cell.removeEventListener('click', clickHandleBoard))
    }

};

ScreenController();

