/**
 * Class which implements UI and UX for Tic-Tac-Toe game
 * @constructor
 */
function App() {

    /**
     * Initializer. Starting AI, setup screen and event listeners for screen items
     */
    this.init = () => {
        this.currentPlayer = "X";
        this.Ai = new Ai();
        this.Ai.reset();
        this.setupScreen();
        this.setListeners();
        this.isThinking = false;
    }

    /**
     * Setup game board size based on current browser window size
     */
    this.setupScreen = () => {
        const min = Math.min(window.innerWidth,window.innerHeight);
        const board = document.querySelector("#board");
        board.style.width = min/2+"px";
        board.style.height = min/2+"px";
    }


    /**
     * Sets event listeners for user interface elements
     */
    this.setListeners = () => {
        window.addEventListener("resize",this.setupScreen);
        const cells = document.querySelectorAll(".cell");
        for (let cell of cells) {
            cell.addEventListener("mouseover",(e) => {
                if (e.target.id.search("cell") === -1 || this.Ai.terminal() || this.isThinking) { return }
                const [row,col] = this.getCordsFromId(e.target.id);
                if (this.Ai.is_empty(row,col)) {
                    e.target.classList.add("hovered_cell")
                }
            })
            cell.addEventListener("mouseout",(e) => {
                if (e.target.id.search("cell") === -1 ) { return }
                e.target.classList.remove("hovered_cell")
            })
            cell.addEventListener("click",(e) => {
                if (e.target.id.search("cell") === -1 || this.Ai.terminal() || this.isThinking) { return }
                const [row,col] = this.getCordsFromId(e.target.id);
                if (this.Ai.is_empty(row,col)) {
                    this.humanMove(row,col);
                }
            })
        }
        document.querySelectorAll(".playerType").forEach(item => {
            item.addEventListener("click",(e) => {
                document.querySelectorAll(".playerType").forEach(item => item.classList.remove("selected"))
                this.currentPlayer = e.target.id.split("_").pop();
                e.target.classList.add("selected")
            })
        })
        document.querySelectorAll(".mode").forEach(item => {
            item.addEventListener("click",(e) => {
                document.querySelectorAll(".mode").forEach(item => item.classList.remove("mode_selected"))
                this.Ai.mode = e.target.id.split("_").pop();
                e.target.classList.add("mode_selected")
            })
        })

        document.querySelector(".start_btn").addEventListener("click",()=> {
            this.startGame();
        });
    }

    /**
     * Implements a move on specified cell when user clicks on that cell
     * @param row - Row coordinate (0-2)
     * @param col - Column coordinate (0-2)
     */
    this.humanMove = (row,col) => {
        let player = this.Ai.player(this.Ai.board);
        this.Ai.make_move([row,col]);
        this.drawMove(row,col,player);
        if (this.Ai.terminal()) {
            setTimeout(()=> {
                this.finishGame(this.Ai.winner());
            },1000)
            return
        }
        this.computerMove();
    }

    /**
     * Implements computer move, by calculating coordinates of optimal move
     */
    this.computerMove = () => {
        this.isThinking = true;
        setTimeout(()=> {
            const player = this.Ai.player(this.Ai.board);
            const action = this.Ai.minimax();
            this.Ai.make_move(action);
            this.drawMove(action[0],action[1],player);
            this.isThinking = false;
            if (this.Ai.terminal()) {
                setTimeout(()=> {
                    this.finishGame(this.Ai.winner());
                },1000)
            }
        },100)
    }

    /**
     * Draws "X" or "O" on a cell with specified coordinates
     * @param row - Row coordinate (0-2)
     * @param col - Column coordinate (0-2)
     * @param player - Player symbol to draw: "X" or "O"
     */
    this.drawMove = (row,col,player) => {
        const child = document.createElement("img")
        child.setAttribute("src","assets/"+player.toLowerCase()+".svg");
        child.setAttribute("width","70%");
        child.setAttribute("height","70%");
        const cell = document.querySelector("#cell_"+row+"_"+col);
        cell.appendChild(child);
    }

    /**
     * Using ID of cell html element, extracts coordinates from this ID
     * @param id - ID string
     * @returns array in format [row,col]
     */
    this.getCordsFromId = (id) => {
        const cords = id.split("_");
        cords.shift();
        return cords;
    }

    this.startGame = () => {

    }

    /**
     * Based on provided "winner" finishes the game, clear game board and shows the result
     * @param winner - Winner of the game: "X", "O" or null, if it's a tie
     */
    this.finishGame = (winner) => {
        const cells = document.querySelectorAll(".cell");
        for (let cell of cells) {
            cell.innerHTML = "";
        }
        this.Ai.reset();
        let start_panel = document.querySelector(".start_panel");
        let finishDiv = document.querySelector("#draw");
        let board = document.querySelector("#board");
        if (winner === this.currentPlayer) {
            finishDiv = document.querySelector("#you_win");
        } else if (winner !== null) {
            finishDiv = document.querySelector("#you_fail");
        }
        finishDiv.style.display = "flex";
        board.style.display = "none";
        setTimeout(() => {
            finishDiv.style.display = "none";
            start_panel.style.display = "flex";
        }, 3000)
    }

    /**
     *
     */
    this.startGame = () => {
        document.querySelector(".start_panel").style.display = "none";
        document.querySelector("#board").style.display = "flex";
        if (this.currentPlayer === "O") {
            this.computerMove();
        }
    }
}
