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

        if(_checkForWin(player)) return;

        _switchPlayerTurn();
        _printNewRound();
    };

    const _checkForWin = (player) => {
        const moves = player.getMoves().sort((a,b) => a - b);
        console.log(player.getName(), moves)

        for (const combination of winningCombinations) {
            if (combination.every(cellIndex => moves.includes(cellIndex))) {
              alert(`Congrats, you have won! ${player.getName()}`);
              return true;
            }
        }
        return false;
    };
    
    _printNewRound();
    
    return { playRound, getActivePlayer, getBoard: board.getBoard };  
}

const ScreenController = (() => {
    const game = GameController();
    const cells = document.querySelectorAll('.cell')

    cells.forEach((cell, index) => {
        cell.dataset.cell = index;
        cell.addEventListener('click', () => game.playRound(parseInt(cell.dataset.cell)));
    });
})();

