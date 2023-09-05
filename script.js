const Player = (symbol, isAI = false) => ({ symbol, isAI });

const Cell = (i) => {
    let _symbol = i;

    const addSymbol = (symbol) => {
        _symbol = symbol;
    };

    const getSymbol = () => _symbol;

    const isAvailable = () => (_symbol !== 'O' && _symbol !== 'X');

    return { addSymbol, getSymbol, isAvailable };
}

//Board controls
const Board = () => {
    const cells = Array.from({ length: 9}, (_, i) => Cell(i));

    const getBoard = () => cells.map(cell => cell.getSymbol());

    const makeMove = (player, index) => {

        if (typeof player === 'number'){
            cells[index].addSymbol(player);
            return
        }

        if (!cells[index].isAvailable()) return;

        cells[index].addSymbol(player);
    };

    const emptyCells = () => {
        return cells.filter(cell => cell.isAvailable()).map(cell => cell.getSymbol());
    }

    const clearBoard = () => {
        cells.forEach((cell, i) => cell.addSymbol(i));
        printBoard();
    }

    const printBoard = () => {
            console.log(cells.reduce((rows, key, index) => (index % 3 == 0 ? rows.push([key.getSymbol()]) 
            : rows[rows.length-1].push(key.getSymbol())) && rows, []));
    };

    return { getBoard, makeMove, emptyCells, clearBoard, printBoard};
};

const AI = () => {
    const makeAIMove = (board, player) => {
        const _symbol = player.symbol
        const bestMove = minimax(board, _symbol);

        board.makeMove(_symbol, bestMove.index);
    }

    const minimax = (newBoard, player) => {
        const availSpots = newBoard.emptyCells();
        const availSpots_length = availSpots.length;
        const _board = newBoard.getBoard();

        if (gameController.checkForWin(_board, player) && player === 'X'){
            return { score: -10 };
        } else if (gameController.checkForWin(_board, player) && player === 'O'){
            return { score: 10 };
        } else if (gameController.checkForTie(_board)) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots_length; i++){
            let move = {};

            move.index = availSpots[i];

            newBoard.makeMove(player, availSpots[i])

            if (player === 'O'){
                let result = minimax(newBoard, 'X');
                move.score = result.score
            } else {
                let result = minimax(newBoard, 'O');
                move.score = result.score
            }

            newBoard.makeMove(move.index, availSpots[i]);

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

const gameController = (() => {
    const board = Board();
    const ai = AI();
    const huPlayer = Player('X');
    const aiPlayer = Player('O', true);
    
    let activePlayer = huPlayer;

    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === huPlayer ? aiPlayer : huPlayer;
    };

    const getActivePlayer = () => activePlayer;

    const _printBoard = () => {
        board.printBoard();
        screenController.updateBoard();
    };
    
    const playRound = async (position) => {
        let _hu = huPlayer.symbol;
        let _ai = aiPlayer.symbol;
        let _board;

        
        if(board.emptyCells().includes(position)) {
            board.makeMove(_hu, position);
            _board = board.getBoard()
            _switchPlayerTurn();
            _printBoard();

            if(checkForWin(_board, _hu)) {
                await _sleep(250 + (Math.random() * 250));
                _printBoard();
                screenController.showResult(-1);
                console.log(`Player ${_hu} wins!`);
                return;
            } else if (checkForTie(_board)) {
                await _sleep(250 + (Math.random() * 250));
                _printBoard();
                screenController.showResult(0);
                console.log('IS A TAY')
                return;
            } else {
                await _sleep(500 + (Math.random() * 250));
                ai.makeAIMove(board, aiPlayer);
                _switchPlayerTurn();
                _board = board.getBoard()
                _printBoard()       

                if(checkForWin(_board, _ai)) {
                    await _sleep(250 + (Math.random() * 250));
                    _printBoard();
                    screenController.showResult(1);
                    console.log(`Player ${_ai} wins!`);
                    return;
                }
                else if (checkForTie(_board)) {
                    await _sleep(250 + (Math.random() * 250));
                    _printBoard();
                    screenController.showResult(0);
                    return;
                }
            }
        } else console.log('Cell Taken!');
    };

    const checkForWin = (board, player) => {
        return (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        );
    };

    const checkForTie = (board) => {
        if(checkForWin(board, huPlayer) || checkForWin(board, aiPlayer)) return false;

        return board.every((cell, i) => cell != i);
    }

    return { playRound, getActivePlayer, getBoard: board.getBoard, checkForWin, checkForTie, clearBoard: board.clearBoard };  
})();

const screenController = (() => {
    const screenCells = document.querySelectorAll('.cell');
    const restart = document.querySelector('.restart');
    const playerDisplay = document.getElementById('player');
    const resultModal = document.querySelector('.result');
    const resultPara = document.querySelector('.result-p');
    const overLay = document.querySelector('.overlay');

    const exitModal = () => {
        resultModal.classList.remove('active');
        overLay.classList.remove('active');
        restartBoard();
    }

    const restartBoard = () => {
        gameController.clearBoard();
        updateBoard();
    }

    const updateBoard = () => {
        let _board = gameController.getBoard();
        screenCells.forEach((cell, index) => {
        cell.innerHTML = typeof _board[index] === 'number' ? "" : _board[index];
        });
    }

    const showResult = (result) => {
        if(result == 0) resultPara.innerHTML = 'IS A TAY!';
        if(result == -1) resultPara.innerHTML = 'Player X wins!';
        if(result == 1) resultPara.innerHTML = 'Player O wins!';
        resultModal.classList.add('active');
        overLay.classList.add('active');
    }

    const _init = (() => {
        overLay.onclick = exitModal;

        screenCells.forEach((cell, index) => {
            cell.dataset.cell = index;
            cell.addEventListener('click', gameController.playRound.bind(cell, index));
        });
    
        restart.addEventListener('click', restartBoard);
    })();

    updateBoard();

    return { updateBoard, showResult };
})();

// const ScreenController = (() => {
//     const cells = document.querySelectorAll('.cell');
//     const playerDisplay = document.getElementById('player');

//     cells.forEach((cell, index) => {
//         cell.dataset.cell = index;
//         cell.addEventListener('click', clickHandleBoard);
//     });

//     const updateScreen = () => {
//         const currentBoard = gameController.getBoard();

//         cells.forEach((cell, index) => {
//             cell.innerHTML = typeof currentBoard[index] === 'number' ? "" : currentBoard[index];
//             if(typeof currentBoard[index] !== 'number')  cell.removeEventListener('click', clickHandleBoard);
//         })
//         playerDisplay.innerHTML = gameController.getActivePlayer().symbol;
//     };

//     function clickHandleBoard(e) {
//         const index = parseInt(e.target.dataset.cell);
//         const _player = gameController.getActivePlayer();
//         gameController.playRound(index);
//         updateScreen();
//         e.target.removeEventListener('click', clickHandleBoard);
//     }

//     function displayWinner(player) {
//         console.log(player + " WINS!");
//     }

//     function endGame(){
//         cells.forEach(cell => cell.removeEventListener('click', clickHandleBoard));
//     }

//     updateScreen();

//     return { displayWinner }

// })();