const Player = (name, symbol) => {
    return { name, symbol };
};


const Board = () => {
    const board = new Array(9);

    for(let i=0; i<board.length; i++)
        board[i] = Cell();

    const getBoard = () => board;

    const placeSymbol = (player, index) => {
        if(!board[index].isAvailable()) return;
        board[index].addSymbol(player);
    };

    const printBoard = () => {
        console.log(board.reduce((rows, key, index) => (index % 3 == 0 ? rows.push([key.getValue()]) 
        : rows[rows.length-1].push(key.getValue())) && rows, []));
    };

    return { getBoard, placeSymbol, printBoard };
};

const Cell = () => {
    let _symbol = 0;

    const addSymbol = (symbol) => {
        _symbol = symbol;
    };

    const getValue = () => _symbol;

    const isAvailable = () => {
        return _symbol ? false : true;
    };

    return { addSymbol, getValue, isAvailable };
}

const GameController = () => {
    const player_one = Player('player 1', 'X');
    const player_two = Player('player 2', 'O');

    const board = Board();

    let activePlayer = player_one;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player_one ? player_two : player_one;
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    const playRound = (index) => {
        board.placeSymbol(getActivePlayer().symbol, index);
    
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
    
        switchPlayerTurn();
        printNewRound();
    };
    
    printNewRound();
    
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };  
}

const game = GameController();