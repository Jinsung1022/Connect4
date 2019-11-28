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

var div_array = [button_div1, button_div2, button_div3, button_div4, button_div5, button_div6, button_div7];
var stack_array = [stack1, stack2, stack3, stack4, stack5, stack6, stack7];
var board = new Array(6);
for (var i = 0; i < 7; i++) {
    board[i] = []
}
for (var i = 0; i < 7; i++){
    for (var j = 0; j < 8; j++) {
        board[i][j] = 0;
    }
}

function check_match(var1, var2, var3, var4) {
    return ((var1 != 0) && (var1 == var2) && (var1 == var3) && (var1 == var4));
}

function convert_index(r, c) {
    var val = (r*7) + (c+1);
    return val;
}

function check_win(index, player) {
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
    window.board[row][column] = player;

    // Downward
    for (r = 0; r < 3; r++)
        for (c = 0; c < 7; c++)
            if (check_match(window.board[r][c], window.board[r+1][c], window.board[r+2][c], window.board[r+3][c])){
                document.getElementById("hole"+convert_index(r, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+1, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+2, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+3, c)).style.backgroundColor = 'pink';
                return window.board[r][c];
            }

    // Right
    for (r = 0; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (check_match(window.board[r][c], window.board[r][c+1], window.board[r][c+2], window.board[r][c+3])){
                document.getElementById("hole"+convert_index(r, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r, c+1)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r, c+2)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r, c+3)).style.backgroundColor = 'pink';
                return window.board[r][c];
            }

    // Down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++)
            if (check_match(window.board[r][c], window.board[r+1][c+1], window.board[r+2][c+2], window.board[r+3][c+3])){
                document.getElementById("hole"+convert_index(r, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+1, c+1)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+2, c+2)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r+3, c+3)).style.backgroundColor = 'pink';
                return window.board[r][c];
            }

    // Down-left   
    for (r = 3; r < 6; r++)
        for (c = 0; c < 4; c++)
            if (check_match(window.board[r][c], window.board[r-1][c+1], window.board[r-2][c+2], window.board[r-3][c+3])){
                document.getElementById("hole"+convert_index(r, c)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r-1, c+1)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r-2, c+2)).style.backgroundColor = 'pink';
                document.getElementById("hole"+convert_index(r-3, c+3)).style.backgroundColor = 'pink';
                return window.board[r][c];
            }
        
    return 0;
}

function after_win(player) {
    if (player == 1) {
        document.getElementById("vic").innerHTML = "PLAYER1 WINS";
        document.getElementById("vic").style.color = 'yellow';
    }
    else {
        document.getElementById("vic").innerHTML = "PLAYER2 WINS";
        document.getElementById("vic").style.color = 'blue';
    }
    for (var i = 1; i < 8; i++) {
        document.getElementById("b"+i).disabled = true;
    }
}

function add_hole(count) {
    window.div_array[count].addEventListener('click', function() {
        if (window.stack_array[count] > count) {
            if (turn == 0) {
                document.getElementById("hole"+(window.stack_array[count])).style.backgroundColor='yellow';
                document.getElementById("t1").innerHTML = "2";
                document.getElementById("t1").style.color='blue';
                turn = 1;
                end = check_win(window.stack_array[count], 1);
                if (end != 0) {
                    after_win(1);
                    //window.location.reload(false);
                }
            }
            else {
                document.getElementById("hole"+(window.stack_array[count])).style.backgroundColor='blue';
                document.getElementById("t1").innerHTML = "1";
                document.getElementById("t1").style.color='yellow';
                turn = 0;
                end = check_win(window.stack_array[count], 2);
                if (end != 0) {
                    after_win(2);
                    //window.location.reload(false);
                }
            }
                window.stack_array[count] -= 7;
        }
    })
}

function main() {
    for (var i = 0; i < 7; i++) {
        add_hole(i);
    }
}

main();
