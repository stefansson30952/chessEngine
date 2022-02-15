var zorbristTable = init_zorbist();
var opponentColor = 'w';


function init_zorbist(){
    var zorbistArray = [];
        
    var checkArray = [];
    for(var i = 0; i<64; i++){
        var array = [];
        for(var j = 0; j<12; j++){
            var hashValue = Math.random()*9007199254740991;
            while(checkArray.includes(hashValue)){
                console.log("Got similar Value");
                hashValue = Math.random()*9007199254740991;
            }
            array.push(hashValue);
            checkArray.push(hashValue);
        }
        zorbistArray.push(array);
    }

    return zorbistArray;
}

function hash_fen(fen){
    var currentBoardPosition = 0;
    var hash = 0;

    var pieceToNumber = {P: 0, N: 1, B: 2, R: 3, Q: 4, K: 5,
                     p: 6, n: 7, b: 8, r: 9, q: 10, k: 11}

    for(var i = 0; i<fen.length; i++){
        var code = fen.charCodeAt(i);
        var character = fen.charAt(i);
        if(code == 32){
            return hash;
        }
        // 0-9
        if(code > 47 && code < 58){
            // this is numbers in fen so add to board position
            code -= 48;
            currentBoardPosition += code;
        }
        //A-Z
        if(code > 64 && code < 91){
            var pieceNumber = pieceToNumber[character];
            var pieceHash = zorbristTable[currentBoardPosition][pieceNumber];
            hash = hash ^ pieceHash;
            currentBoardPosition++;
        }
        // a-z
        if(code > 96){
            var pieceNumber = pieceToNumber[character];
            var pieceHash = zorbristTable[currentBoardPosition][pieceNumber];
            hash = hash ^ pieceHash;
            currentBoardPosition++;
        }
    }
    return hash;
}

function move_Hash(move){
    var fromPosition = boardToNumber(move.from);
    var toPosition = boardToNumber(move.to);
    var piece = move.piece;
    var pieceToNumber = {w: {p: 0, n: 1, b: 2, r: 3, q: 4, k: 5}, 
                        b: {p: 6, n: 7, b: 8, r: 9, q: 10, k: 11}};
    var hash = 0;

    var fromHash = zorbristTable[fromPosition][pieceToNumber[move.color][piece]];
    var toHash = zorbristTable[toPosition][pieceToNumber[move.color][piece]];
    hash = hash ^ fromHash ^ toHash;

    if(move.captured){
        var captureHash = zorbristTable[toPosition][pieceToNumber[opponentColor][move.captured]];
        hash = hash ^ captureHash;
    }
    return hash;
}

function boardToNumber(boardPosition){
    var letterValue = boardPosition.charCodeAt(0)-97;
    var numberValue = boardPosition.charCodeAt(1)-49;
    var array = [7, 6, 5, 4, 3, 2, 1, 0];
    return letterValue + array[numberValue]*8;
}