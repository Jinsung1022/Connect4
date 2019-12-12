let turn = 0;
let finished = false;
let stack1 = 36;
let stack2 = 37;
let stack3 = 38;
let stack4 = 39;
let stack5 = 40;
let stack6 = 41;
let stack7 = 42;

var toAdd = document.createDocumentFragment();
for (var j=0; j < 42; j= j + 7){
    for (var i=1; i < 8; i++){
        var newDiv = document.createElement('div');
        newDiv.id = 'hole'+(i + j);
        newDiv.className = "hole";
        toAdd.appendChild(newDiv);
        
    }
    newBr = document.createElement('br');
    toAdd.appendChild(newBr);
}
document.getElementById("board").appendChild(toAdd);

const button_div1 = document.getElementById("b1");
const button_div2 = document.getElementById("b2");
const button_div3 = document.getElementById("b3");
const button_div4 = document.getElementById("b4");
const button_div5 = document.getElementById("b5");
const button_div6 = document.getElementById("b6");
const button_div7 = document.getElementById("b7");
var button_divr = document.getElementById("r");

var div_array = [button_div1, button_div2, button_div3, button_div4, button_div5, button_div6, button_div7];
var stack_array = [stack1, stack2, stack3, stack4, stack5, stack6, stack7];
var board = new Array(6);
for (var i = 0; i < 7; i++) {
    board[i] = []
}
for (var i = 0; i < 6; i++){
    for (var j = 0; j < 7; j++) {
        board[i][j] = 0;
    }
}

function reset() {
    window.location.reload();
}

function Move() {
    this.row = 0;
    this.col = 0;
}

class Connectfour {

    constructor() {
        this.index;
        this.player;
    }

    init() {
        for (var i = 0; i < 7; i++) {
            this.add_hole(i);
        }
    }

    check_match(var1, var2, var3, var4) {
        return ((var1 != 0) && (var1 == var2) && (var1 == var3) && (var1 == var4));
    }

    /**
     * Given row & column of the hole, returns the index of the hole.
     * @param {int} r Row # of the hole
     * @param {int} c Column # of the hole
     * @retruns {int} Returns the index of the hole.
     */
    convert_index(r, c) {
        var val = (r*7) + (c+1);
        console.log(val, r, c);
        return val;
    }

    evaluate_block(block, player) {
        var score = 0;
        var opp_player = player;
        if (player == 1) {
            opp_player = 2;
        }
        var player_count = 0;
        var opp_count = 0;
        var  empty_count = 0;
        for (var i = 0; i < block.length; i++){
            if (block[i] == player)
                player_count++;
            else if (block[i] == opp_player)
                opp_count++;
            else
                empty_count++;
        }
        // Player has connected 4, 3, 2.
        if (player_count == 4) {
            score += 100;
        }
        else if (player_count == 3) {
            score += 5;
        }
        else if (player_count == 2) {
            score += 2;
        }
        // Opposite player has 3 dots connected. Need to block it.
        if (opp_count == 3) {
            score = -4;
        }
        return score;
    }

    count_scores(board, player) {
        var score = 0;

        var center_count = 0;
        for (var i = 0; i < 6; i++) {
            if (board[i][3] == player) {
                center_count++;
            }
        }
        score += (center_count * 3);

        // Horizontal Score
        for (var i = 0; i < 6; i++) {
            var row_array = [];
            for (var j = 0; j < 7; j++) {
                row_array.push(board[i][j]);
            }
            for (var k = 0; k < 4; k++) {
                var block = row_array.slice(k, k+4);
                score += this.evaluate_block(block, player);
            }
        }

        // Vertical score
        for (var i = 0; i < 7; i++) {
            var col_array = [];
            for (var j = 0; j < 6; j++) {
                col_array.push(board[j][i]);
            }
            for (var k = 0; k < 4; k++) {
                var block = col_array.slice(k, k+4);
                score += this.evaluate_block(block, player);
            }
        }

        // Positive Diagonal score
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                var block = [];
                for (var k = 0; k < 4; k++) {
                    block.push(board[i+k][j+k]);
                }
                score += this.evaluate_block(block, player);
            }
        }

        // Negative Diagonal score
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                var block = [];
                for (var k = 0; k < 4; k++) {
                    block.push(board[i+3-k][j+k]);
                }
                score += this.evaluate_block(block, player);
            }
        }
        return score;
    }

    /**
     * Change the index of the "board" to the given player #
     * DOES NOT change the visual rep.
     * @param {Array} board 
     * @param {int} index Index of the hole. (1 ~ 42)
     * @param {int} player # of player
     */
    place_dot(bd, index, player) {
        var row = 0;
        var column = 0;
        if (index%7 == 0) {
            row = Math.floor(index/7) - 1
            column = 6;
        }
        else {
            row = Math.floor(index/7)
            column = index%7 - 1;
        }
        bd[row][column] = player;
    }

    /** 
     * Checks if a given player has won
     * @param {int} index  Index of the placed hole.
     * @param {int} player Player checked for winning.
     * @param {str} mode Whether it is called during simulation or real game.
     * @returns {int} Returns whether someone has won.
    */
    check_win(board, player, mode) {
        // Downward
        for (var r = 0; r < 3; r++)
            for (var c = 0; c < 7; c++)
                if (this.check_match(board[r][c], board[r+1][c], board[r+2][c], board[r+3][c])){
                    /**
                    if (mode == 'real') {
                        document.getElementById("hole"+this.convert_index(r, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+1, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+2, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+3, c)).style.backgroundColor = 'orange';
                    }
                    */
                    if (board[r][c] == player)
                        return true;
                }

        // Right
        for (r = 0; r < 6; r++)
            for (c = 0; c < 4; c++)
                if (this.check_match(board[r][c], board[r][c+1], board[r][c+2], board[r][c+3])){
                    /**
                    if (mode == 'real') {
                        document.getElementById("hole"+this.convert_index(r, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r, c+1)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r, c+2)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r, c+3)).style.backgroundColor = 'orange';
                    }
                    */
                    if (board[r][c] == player)
                        return true;
                }

        // Down-right
        for (r = 0; r < 3; r++)
            for (c = 0; c < 4; c++)
                if (this.check_match(board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3])){
                    /**
                    if (mode == 'real') {
                        document.getElementById("hole"+this.convert_index(r, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+1, c+1)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+2, c+2)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r+3, c+3)).style.backgroundColor = 'orange';            
                    }
                    */
                    if (board[r][c] == player)
                        return true;
                }

        // Down-left   
        for (r = 3; r < 6; r++)
            for (c = 0; c < 4; c++)
                if (this.check_match(board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3])){
                    /**
                    if (mode == 'real') {
                        document.getElementById("hole"+this.convert_index(r, c)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r-1, c+1)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r-2, c+2)).style.backgroundColor = 'orange';
                        document.getElementById("hole"+this.convert_index(r-3, c+3)).style.backgroundColor = 'orange';
                    }
                    */
                    if (board[r][c] == player)
                        return true;
                }
            
        return false;
    }

    /**
     * Given the player number, Labels the victory texts.
     * @param {int} player Winner's player #
     */
    after_win(player) {
        console.log(this.findColEmpty(board).length == 0);
        if (this.findColEmpty(board).length == 0) {
            document.getElementById("vic").innerHTML = "IT'S A DRAW!";
            document.getElementById("vic").style.color = 'lightgreen';
        }
        else if (player == 1) {
            document.getElementById("vic").innerHTML = "PLAYER1 WINS";
            document.getElementById("vic").style.color = 'yellow';
        }
        else {
            document.getElementById("vic").innerHTML = "PLAYER2 WINS";
            document.getElementById("vic").style.color = 'skyblue';
        }
        for (var i = 1; i < 8; i++) {
            document.getElementById("b"+i).disabled = true;
        }
    }

    /**
     * Sets up the button so that when pressed, sets down the corresponding color
     * @param {} count Index of the stack(column)
     */
    add_hole(count) {
        var self = this;

        window.div_array[count].addEventListener('click', function() {
            if (window.stack_array[count] > count) {
                if (turn == 0) {
                    document.getElementById("hole"+(window.stack_array[count])).style.backgroundColor='yellow';
                    document.getElementById("t1").innerHTML = "2";
                    document.getElementById("t1").style.color='skyblue';
                    turn = 1;
                    self.index = window.stack_array[count];
                    self.player = 1;
                    self.place_dot(board, window.stack_array[count], 1);
                    var end = self.check_win(board, 1, 'real');
                    if (self.findColEmpty(board).length == 0) {
                        self.after_win(1);
                    }
                    if (end != false) {
                        self.after_win(1);
                        //window.location.reload(false);
                    }
                }
                /**
                else {
                    document.getElementById("hole"+(window.stack_array[count])).style.backgroundColor='skyblue';
                    document.getElementById("t1").innerHTML = "1";
                    document.getElementById("t1").style.color='yellow';
                    turn = 0;
                    self.index = window.stack_array[count];
                    self.player = 2;
                    self.place_dot(board, window.stack_array[count], 2);
                    var end = self.check_win(board, 2, 'real');
                    if (self.findColEmpty(board).length == 0) {
                        self.after_win(2);
                    }
                    if (end != false) {
                        self.after_win(2);
                    }
                }
                */
                    window.stack_array[count] -= 7;
                    if (!(self.check_win(board, 1, 'sim'))) {
                        self.ai_move();
                    }
            }
        })
    }

    ai_move() {
        var self = this;
        if (turn == 1){
            var col_num;
            var pnum;
            var value;
            let b_copy = JSON.parse(JSON.stringify(board));
            value = self.minimax(b_copy, 4, -999999999999999, 999999999999999, 2);
            col_num = value[0];
            pnum = value[1];
            document.getElementById("hole"+(window.stack_array[col_num])).style.backgroundColor='skyblue';
            document.getElementById("t1").innerHTML = "1";
            document.getElementById("t1").style.color='yellow';
            turn = 0;
            self.index = window.stack_array[col_num];
            self.player = 2;
            self.place_dot(board, window.stack_array[col_num], 2);
            var end = self.check_win(board, 2, 'real');
            if (self.findColEmpty(board).length == 0) {
                self.after_win(2);
            }
            if (end != false) {
                self.after_win(2);
                //window.location.reload(false);
            }
        }
            window.stack_array[col_num] -= 7;
    }

    /**
     * Finds out if a column is filled
     * @param {Array} board 
     * @returns {Array} Array containing whether the column is filled.
     */
    findColEmpty(board) {
        var valid = [];
        for (var i = 0; i < 7; i++) {
            if (board[0][i] == 0)
                valid.push(i);
        }
        return valid;
    }

    /**
     * Given the column,
     * returns the index of the row in which the dot would be dropped to.
     * @param {Array} board 
     * @param {int} col Column to be checked on where the dot should be placed.
     */
    findRowOpen(board, col) {
        for (var i = 5; i > -1; i--) {
            if (board[i][col] == 0) {
                return i;
            }
        }
    }

    game_over(board, player) {
        return ((this.findColEmpty(board)).length == 0 || this.check_win(board, player, 'sim'));
    }
    
    minimax(bd, depth, alpha, beta, maxPlayer) {
        var self = this;
        var valid_location = this.findColEmpty(bd);
        var player;
        // Since we check if the game is over from the previous move,
        // If maxPlayer, player = 1
        if (maxPlayer == true) {
            player = 1;
        }
        else {
            player = 2;
        }
        var is_terminal = this.game_over(bd, player);
        if (depth == 0 || is_terminal) {
            if (is_terminal) {
                if (this.check_win(bd, 2, 'sim')) {
                    return [null, 10000];
                }
                else if (this.check_win(bd, 1, 'sim')) {
                    return [null, -10000];
                }
                else {
                    return [null, 0];
                }
            }
            else {
                return [null, this.count_scores(bd, 2)];
            }
        }
        if (maxPlayer) {
            //console.log("performing minmax: max");
            var value = -999999999999999;
            var best_col;
            for (var i = 0; i < (valid_location).length; i++) {
                var row_num = this.findRowOpen(bd, valid_location[i]);
                var b_copy = JSON.parse(JSON.stringify(bd));
                var index = this.convert_index(row_num, valid_location[i]);
                this.place_dot(b_copy, index, 2);
                //console.log(b_copy[5], b_copy[4]);
                var new_score;
                var given;
                given = this.minimax(b_copy, depth-1, alpha, beta, false);
                new_score = given[1];
                console.log("new_score < value", new_score, value);
                if (new_score > value) {
                    value = new_score
                    best_col = valid_location[i];
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
            console.log("best_col and value", best_col, value)
            return [best_col, value];
        }
        else {
            //console.log("performing minmax: min");
            var value = 999999999999999;
            var best_col;
            for (var i = 0; i < (valid_location).length; i++) {
                var row_num = this.findRowOpen(bd, valid_location[i]);
                var b_copy = JSON.parse(JSON.stringify(bd));
                var index = this.convert_index(row_num, valid_location[i])
                this.place_dot(b_copy, index, 1);
                //console.log(b_copy[5], b_copy[4]);
                var new_score;
                var given;
                given = this.minimax(b_copy, depth-1, alpha, beta, true);
                new_score = given[1];
                console.log("new_score < value", new_score, value);
                if (new_score < value) {
                    value = new_score;
                    best_col = valid_location[i];
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
            console.log("best_col and value", best_col, value)
            return [best_col, value];

        }
        

    }
}


function main() {
    /**
    var sheeps = new Array(4);
    for (var i = 0; i < 5; i++) {
        sheeps[i] = []
    }
    for (var i = 0; i < 5; i++){
        for (var j = 0; j < 3; j++) {
            sheeps[i][j] = 'sheep';
        }
    }
    let cloneSheeps = JSON.parse(JSON.stringify(sheeps));
    cloneSheeps[2][2] = 'wolf';
    console.log("original", sheeps[2][2]);
    console.log("cloned", cloneSheeps[2][2]);
    */

    console.log(window.button_divr);
    button_divr.addEventListener('click', function() {
        reset();
    })
    var c4 = new Connectfour();
    c4.init();
}

main();
