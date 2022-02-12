/* 0 = Pawn, 1 = Knight, 2 = Bishop, 3 = Rook, 4 = Queen, 5 = King */
var pieceValue = {p: 100, n: 320,
    b: 330, r: 500,
    q: 900, k: 20000,
    P: 100, N: 320,
    B: 330, R: 500,
    Q: 900, K: 20000};                                         
var pawnTableW = [
0,  0,  0,  0,  0,  0,  0,  0,
50, 50, 50, 50, 50, 50, 50, 50,
10, 10, 20, 30, 30, 20, 10, 10,
5,  5, 10, 25, 25, 10,  5,  5,
0,  0,  0, 20, 20,  0,  0,  0,
5, -5,-10,  0,  0,-10, -5,  5,
5, 10, 10,-20,-20, 10, 10,  5,
0,  0,  0,  0,  0,  0,  0,  0];
var pawnTableB = [
0,  0,  0,  0,  0,  0,  0,  0,
5, 10, 10,-20,-20, 10, 10,  5,
5, -5,-10,  0,  0,-10, -5,  5,
0,  0,  0, 20, 20,  0,  0,  0,
5,  5, 10, 25, 25, 10,  5,  5,
10, 10, 20, 30, 30, 20, 10, 10,
50, 50, 50, 50, 50, 50, 50, 50,
0,  0,  0,  0,  0,  0,  0,  0];        
var knightTableW = [
-50,-40,-30,-30,-30,-30,-40,-50,
-40,-20,  0,  0,  0,  0,-20,-40,
-30,  0, 10, 15, 15, 10,  0,-30,
-30,  5, 15, 20, 20, 15,  5,-30,
-30,  0, 15, 20, 20, 15,  0,-30,
-30,  5, 10, 15, 15, 10,  5,-30,
-40,-20,  0,  5,  5,  0,-20,-40,
-50,-40,-30,-30,-30,-30,-40,-50];
var knightTableB = [
-50,-40,-30,-30,-30,-30,-40,-50,
-40,-20,  0,  5,  5,  0,-20,-40,
-30,  5, 10, 15, 15, 10,  5,-30,
-30,  0, 15, 20, 20, 15,  0,-30,
-30,  5, 15, 20, 20, 15,  5,-30,
-30,  0, 10, 15, 15, 10,  0,-30,
-40,-20,  0,  0,  0,  0,-20,-40,
-50,-40,-30,-30,-30,-30,-40,-50];
var bishopTableW = [
-20,-10,-10,-10,-10,-10,-10,-20,
-10,  0,  0,  0,  0,  0,  0,-10,
-10,  0,  5, 10, 10,  5,  0,-10,
-10,  5,  5, 10, 10,  5,  5,-10,
-10,  0, 10, 10, 10, 10,  0,-10,
-10, 10, 10, 10, 10, 10, 10,-10,
-10,  5,  0,  0,  0,  0,  5,-10,
-20,-10,-10,-10,-10,-10,-10,-20];
var bishopTableB = [
-20,-10,-10,-10,-10,-10,-10,-20,
-10,  5,  0,  0,  0,  0,  5,-10,
-10, 10, 10, 10, 10, 10, 10,-10,
-10,  0, 10, 10, 10, 10,  0,-10,
-10,  5,  5, 10, 10,  5,  5,-10,
-10,  0,  5, 10, 10,  5,  0,-10,
-10,  0,  0,  0,  0,  0,  0,-10,
-20,-10,-10,-10,-10,-10,-10,-20];
var rookTableW = [
0,  0,  0,  0,  0,  0,  0,  0,
5, 10, 10, 10, 10, 10, 10,  5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
0,  0,  0,  5,  5,  0,  0,  0];
var rookTableB = [
0,  0,  0,  5,  5,  0,  0,  0,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
-5,  0,  0,  0,  0,  0,  0, -5,
5, 10, 10, 10, 10, 10, 10,  5,
0,  0,  0,  0,  0,  0,  0,  0];
var queenTableW = [
-20,-10,-10, -5, -5,-10,-10,-20,
-10,  0,  0,  0,  0,  0,  0,-10,
-10,  0,  5,  5,  5,  5,  0,-10,
-5,  0,  5,  5,  5,  5,  0, -5,
0,  0,  5,  5,  5,  5,  0, -5,
-10,  5,  5,  5,  5,  5,  0,-10,
-10,  0,  5,  0,  0,  0,  0,-10,
-20,-10,-10, -5, -5,-10,-10,-20];
var queenTableB = [
-20,-10,-10, -5, -5,-10,-10,-20,
-10,  0,  5,  0,  0,  0,  0,-10,
-10,  5,  5,  5,  5,  5,  0,-10,
0,  0,  5,  5,  5,  5,  0, -5,
-5,  0,  5,  5,  5,  5,  0, -5,
-10,  0,  5,  5,  5,  5,  0,-10,
-10,  0,  0,  0,  0,  0,  0,-10,
-20,-10,-10, -5, -5,-10,-10,-20];
var kingTableW = [
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-20,-30,-30,-40,-40,-30,-30,-20,
-10,-20,-20,-20,-20,-20,-20,-10,
20, 20,  0,  0,  0,  0, 20, 20,
20, 30, 10,  0,  0, 10, 30, 20];
var kingTableB = [
20, 30, 10,  0,  0, 10, 30, 20,
20, 20,  0,  0,  0,  0, 20, 20,
-10,-20,-20,-20,-20,-20,-20,-10,
-20,-30,-30,-40,-40,-30,-30,-20,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30];

var tablesW = {P: pawnTableW, N: knightTableW,
 B: bishopTableW, R: rookTableW,
 Q: queenTableW,  K: kingTableW};
var tablesB = {p: pawnTableB, n: knightTableB,
 b: bishopTableB, r: rookTableB,
 q: queenTableB,  k: kingTableB};
var tableBasedOnColor = {w: tablesW, b: tablesB};        

function valueBasedOnFen(fen, color){
    var currentBoardPosition = 0;
    var whiteValue = 0;
    var blackValue = 0;
    for(var i = 0; i<fen.length; i++){
        var code = fen.charCodeAt(i);
        var character = fen.charAt(i);
        if(code == 32){
            //var turnVal = {w: -1, b: 1};

            return blackValue-whiteValue;
        }
        // 0-9
        if(code > 47 && code < 58){
            // this is numbers in fen so add to board position
            code -= 48;
            currentBoardPosition += code;
        }
        //A-Z
        if(code > 64 && code < 91){
            var color = 'w';
            var pieceVal = pieceValue[character];
            var piecePositionValue = tableBasedOnColor[color][character][currentBoardPosition];
            whiteValue += (pieceVal+piecePositionValue);
            currentBoardPosition++;
        }
        // a-z
        if(code > 96){
            var color = 'b';
            var pieceVal = pieceValue[character];
            var piecePositionValue = tableBasedOnColor[color][character][currentBoardPosition];
            blackValue += (pieceVal+piecePositionValue);
            currentBoardPosition++;
        }
    }
}

function evaluate(fen, blackToMove){
    var score = valueBasedOnFen(fen);
    if(blackToMove) {
		return score;
	} else {
		return -score;
	}
}