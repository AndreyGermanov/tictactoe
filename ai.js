/**
 * Class which implements Artificial Intelligence for Tic-Tac-Toe game, based on Minimax algorithm.
 */
function Ai() {

    /**
     * Clears game board
     */
    this.reset = () => {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
    }

    /**
     * Determines who is current player
     * @param board - Current game board
     * @returns "X" or "O"
     */
    this.player = (board=null) => {
        if (!board) { board = this.board }
        const x_count = board.map(row => row.filter(col => col === "X").length).reduce((s,s1)=>s+s1);
        const o_count = board.map(row => row.filter(col => col === "O").length).reduce((s,s1)=>s+s1);
        return o_count < x_count ? "O" : "X";
    }

    /**
     * Returns an array of coordinates of all possible moves for specified board
     * @param board - Current game board
     * @returns array [[row,col],[row,col] ...]
     */
    this.actions = (board= null) => {
        if (!board) { board = this.board }
        const res = [];
        for (let i in board) {
            for (let j in board[i]) {
                if (!board[i][j]) {
                    res.push([i,j])
                }
            }
        }
        return res;
    }

    /**
     * Returns a new game board after applying an action to it (make a move)
     * @param board - current board
     * @param action - action (coordinates to make a move [row,col])
     * @returns array - new board
     */
    this.result = (board = null, action ) => {
        if (!board) { board = this.board }
        const new_board = [];
        for (let i=0;i<3;i++) {
            new_board[i] = [];
            for (let j=0;j<3;j++) {
                new_board[i][j] = board[i][j];
            }
        }
        if (!action) { return new_board; }
        new_board[action[0]][action[1]] = this.player(board);
        return new_board
    }

    /**
     * Makes a move on current board for current player
     * @param action - array of coordinates [row,col]
     */
    this.make_move = (action) => {
        this.board = this.result(null,action);
    }

    /**
     * Check if specified cell is empty
     * @param row - Row
     * @param col - Column
     * @returns {boolean} - true if yes and false if no
     */
    this.is_empty = (row,col) => {
        return !this.board[row][col];
    }

    /**
     * Determines who is a winner, based on provided game board state.
     * @param board - Current game board
     * @returns "X", or "O" or null if nobody won
     */
    this.winner = (board = null) => {
        if (!board) { board = this.board }
        if (this.utility(board) === 1) {
            return "X";
        } else if (this.utility(board) === -1) {
            return "O";
        }
        return null;
    }

    /**
     * Returns true if current state of game board is terminal (either somebody won, or all cells filled and it's a tie)
     * @param board - Current game board
     * @returns {boolean} - True if state is terminal or False otherwise
     */
    this.terminal = (board = null) => {
        if (!board) { board = this.board }
        return this.winner(board) || this.actions(board).length === 0
    }

    /**
     * Returns cost of specified game board for minimax: 1 - if X wins, -1 if O wins or O if nobody wins on current board
     * @param board - Current board
     * @returns {number} - 1 - if X wins, -1 if O wins or O if nobody wins on current board
     */
    this.utility = (board = null) => {
        if (!board) { board = this.board }
        if (this.check_win("X", board)) {
            return 1
        } else if (this.check_win("O", board)) {
            return -1
        }
        return 0
    }

    /**
     * Checks if player "p" won based on state of provided game board
     * @param p - player : "X" or "O"
     * @param board - Current game board
     * @returns {boolean} - True if player won or false otherwise
     */
    this.check_win = (p, board = null) => {
        return ((board[0][0] === p && board[0][1] === p && board[0][2] === p) ||
            (board[1][0] === p && board[1][1] === p && board[1][2] === p) ||
            (board[2][0] === p && board[2][1] === p && board[2][2] === p) ||
            (board[0][0] === p && board[1][0] === p && board[2][0] === p) ||
            (board[0][1] === p && board[1][1] === p && board[2][1] === p) ||
            (board[0][2] === p && board[1][2] === p && board[2][2] === p) ||
            (board[0][0] === p && board[1][1] === p && board[2][2] === p) ||
            (board[0][2] === p && board[1][1] === p && board[2][0] === p))
    }

    /**
     * Returns coordinates of next optimal move for current player for specified game board
     * @param board - Current game board
     * @returns array - Coordinates of optimal move ([row,col])
     */
    this.minimax = (board= null) => {
        if (!board) { board = this.board }
        let act = null
        const p = this.player(board);
        if (p === "X") {
            let max_v = -9999999;
            for (let action of this.actions(board)) {
                const v = this.min_value(this.result(board,action));
                if (v > max_v) {
                    max_v = v;
                    act = action;
                }
            }
        } else if (p === "O") {
            let min_v = 9999999;
            for (let action of this.actions(board)) {
                const v = this.max_value(this.result(board,action));
                if (v < min_v) {
                    min_v = v;
                    act = action;
                }
            }
        }
        return act;
    }

    /**
     * Returns max value of final board for specified board, based on actions of other player
     * @param board - Current game board
     * @returns {number} - max value
     */
    this.max_value = (board) => {
        if (this.terminal(board)) {
            return this.utility(board)
        }
        let v = -99999999;
        for (let action of this.actions(board)) {
            v = Math.max(v,this.min_value(this.result(board,action)))
        }
        return v;
    }

    /**
     * Returns min value of final board for specified board, based on actions of other player
     * @param board - Current game board
     * @returns {number} - min value
     */
    this.min_value = (board) => {
        if (this.terminal(board)) {
            return this.utility(board)
        }
        let v = 99999999;
        for (let action of this.actions(board)) {
            v = Math.min(v,this.max_value(this.result(board,action)))
        }
        return v;
    }

}
