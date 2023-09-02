const Player = (symbol, isAI = false) => {
    const _symbol = symbol;

    const getSymbol = () => _symbol;

    return { getSymbol, isAI};
};

const emptyCells = (board) => {
    return board.filter(cell => cell.isAvailable()).map(cell => cell.getSymbol());
}

const AI = () => {
    const makeAIMove = (board, player) => {
        const _symbol = player.getSymbol()
        const bestMove = minimax(board.getBoard(), _symbol);

        board.makeMove(_symbol, bestMove.index);
    }

    const minimax = (newBoard, player) => {
        const availSpots = emptyCells(newBoard);
        const availSpots_length = availSpots.length;

        if (gameController.checkForWin(newBoard, player) && player === 'X'){
            return { score: -10 };
        } else if (gameController.checkForWin(newBoard, player) && player === 'O'){
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots_length; i++){
            let move = {};
            move.index = newBoard[availSpots[i]].getSymbol();

            newBoard[availSpots[i]].addSymbol(player);

            if (player === 'O'){
                let result = minimax(newBoard, 'X');
                move.score = result.score
            } else {
                let result = minimax(newBoard, 'O');
                move.score = result.score
            }

            newBoard[availSpots[i]].addSymbol(move.index);

            moves.push(move);
        }

        let bestMove;
        let moves_length = moves.length;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves_length; i++){
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }

        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves_length; i++){
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    return { makeAIMove }

};

//Board controls
const Board = () => {
    const board = new Array(9);
    let boardLength = board.length;

    for(let i=0; i<boardLength; i++)
        board[i] = Cell(i);

    const getBoard = () => board;

    const makeMove = (player, index) => {
        if(!board[index].isAvailable()) return;

        board[index].addSymbol(player);
    };

    const printBoard = () => {
            console.log(board.reduce((rows, key, index) => (index % 3 == 0 ? rows.push([key.getSymbol()]) 
            : rows[rows.length-1].push(key.getSymbol())) && rows, []));
    };

    return { getBoard, makeMove, printBoard, emptyCells };
};

const Cell = (i) => {
    let _symbol = i;

    const addSymbol = (symbol) => {
        _symbol = symbol;
    };

    const getSymbol = () => _symbol;

    const isAvailable = () => {
        return _symbol == 'O' || _symbol == 'X' ? false : true;
    };

    return { addSymbol, getSymbol, isAvailable };
}

const gameController = (() => {
    const board = Board();
    const ai = AI();
    const huPlayer = Player('X');
    const aiPlayer = Player('O', true);
    
    let activePlayer = huPlayer;

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === huPlayer ? aiPlayer : huPlayer;
    };

    const getActivePlayer = () => activePlayer;

    const _printBoard = () => {
        board.printBoard();
    };
    
    const playRound = (position) => {
        const player = getActivePlayer();
        board.makeMove(player.getSymbol(), position);
        if(checkForWin(board.getBoard(), player.getSymbol())) {
            _printBoard();
            console.log(`Player ${player.getSymbol()} wins!`);
            return;
        }
        _switchPlayerTurn();
        

        ai.makeAIMove(board, getActivePlayer());
        _switchPlayerTurn();
        _printBoard();
    };

    // const checkWinner = () => {
    //     if(checkForWin(board.getBoard(), player.getSymbol())) {
    //         _printBoard();
    //         console.log(`Player ${player.getSymbol()} wins!`);
    //         return;
    //     }
    // }

    const checkForWin = (board, player) => {
        return (
            (board[0].getSymbol() == player && board[1].getSymbol() == player && board[2].getSymbol() == player) ||
            (board[3].getSymbol() == player && board[4].getSymbol() == player && board[5].getSymbol() == player) ||
            (board[6].getSymbol() == player && board[7].getSymbol() == player && board[8].getSymbol() == player) ||
            (board[0].getSymbol() == player && board[3].getSymbol() == player && board[6].getSymbol() == player) ||
            (board[1].getSymbol() == player && board[4].getSymbol() == player && board[7].getSymbol() == player) ||
            (board[2].getSymbol() == player && board[5].getSymbol() == player && board[8].getSymbol() == player) ||
            (board[0].getSymbol() == player && board[4].getSymbol() == player && board[8].getSymbol() == player) ||
            (board[2].getSymbol() == player && board[4].getSymbol() == player && board[6].getSymbol() == player)
        );
    };

    _printBoard();
    
    return { playRound, getActivePlayer, getBoard: board.getBoard, checkForWin };  
})();

/* For DOM Interface
const ScreenController = () => {
    const game = GameController();
    const cells = document.querySelectorAll('.cell');
    const playerDisplay = document.getElementById('player');

    cells.forEach((cell, index) => {
        cell.dataset.cell = index;
        cell.addEventListener('click', clickHandleBoard);
    });

    const updateScreen = () => {
        const currentBoard = game.getBoard();

        cells.forEach((cell, index) => {
            cell.innerHTML = currentBoard[index].getSymbol() ? currentBoard[index].getSymbol() : "";
        })
        playerDisplay.innerHTML = game.getActivePlayer().getName();
    };

    function clickHandleBoard(e) {
        const index = parseInt(e.target.dataset.cell);
        const _player = game.getActivePlayer();
        game.playRound(index);
        updateScreen();
        e.target.removeEventListener('click', clickHandleBoard);
        if(game.checkForWin(_player)){
            console.log(`${_player.getName()} won!`);
            endGame();
        }
    }

    function endGame(){
        cells.forEach(cell => cell.removeEventListener('click', clickHandleBoard));
    }

    updateScreen();

};
*/



