var MVVALVATable = initMMVLVATable();
var killerMoveTable = [];

function generateMoves(game, hash, ply){
    var moveList = game.moves({verbose: true});
    var scoredMoveList = createScoredMoveList(moveList);
    
    /* Set the score of the pv move */
    var pvMove = probePvTable(hash);
    if(pvMove != NOMOVE){
        for(var i = 0; i<scoredMoveList.length; i++){
            if(scoredMoveList[i].move.san == pvMove.san){
                scoredMoveList[i].score = 100000000; // score of a pv Move
            }
        }
    }

    transposeMoveOrdering(hash, scoredMoveList);

    MVVLVA(scoredMoveList); // give score by MVVLVA

    //killerMoveOrdering(scoredMoveList, ply);

    return scoredMoveList;
}

function generateCaptures(game, hash){
    var moveList = game.moves({verbose: true});
    var capMoveList = [];
    for(var i = 0; i<moveList.length; i++){
        if(moveList[i].captured){
            capMoveList.push(moveList[i]);
        }
    }
    var scoredMoveList = createScoredMoveList(capMoveList);
    
    // /* Set the score of the pv move */
    var pvMove = probePvTable(hash);
    if(pvMove != NOMOVE){
        for(var i = 0; i<scoredMoveList.length; i++){
            if(scoredMoveList[i].move == pvMove){
                scoredMoveList[i].score = 10000000; // score of a pv Move
            }
        }
    }

    transposeMoveOrdering(hash, scoredMoveList);

    MVVLVA(scoredMoveList); // give score by MVVLVA

    return scoredMoveList;
}

function transposeMoveOrdering(hash, scoredMoveList){
    if(transposeTable.has(hash)){
        var transposeMove = transposeTable.get(hash);
        for(var i = 0; i<scoredMoveList.length; i++){
            if(scoredMoveList[i].move.san == transposeMove.san){
                scoredMoveList[i].score = Math.max(10000000, scoredMoveList[i].score); // score a transpose move
            }
        }
    }
}

function MVVLVA(moveList){
    for(var i = 0; i<moveList.length; i++){
        if(moveList[i].move.captured){
            moveList[i].score = MVVALVATable[moveList[i].move.captured][moveList[i].move.piece]+1000000;
        }
    }
}

function killerMoveOrdering(moveList, ply){
    var killerMoves = killerMoveTable[ply];
    for(var i = 0; i<killerMoves.length; i++){
        var move = killerMoves[i];
        for(var j = 0; j<moveList.length; j++){
            if(moveList[i].move.san == move.san){
                moveList[i].score = 10000-i;
                break;
            }
        }
    }
}

function createScoredMoveList(moveList){
    var scoredMoveList = [];
    for(var i = 0; i<moveList.length; i++){
        scoredMoveList.push({move: moveList[i], score: 0})
    }
    return scoredMoveList
}

/* Maybe don't need to sort because on the first few it will stop */
function getNextMove(moveList){
    var bestMove = moveList[0].move;
    var bestScore = moveList[0].score;
    var position = 0;
    for(var i = 0; i<moveList.length; i++){
        if(moveList[i].score > bestScore){
            bestScore = moveList[i].score;
            bestMove = moveList[i].move;
            position = i;
        }
    }
    moveList.splice(position, 1);
    return bestMove;
}

function initMMVLVATable(){
    // Do not include king you can never capture it
    // [captured piece][captured by]
    var pieceNum = {q: 5, r: 4, b: 3, n: 2, p: 1}
    var table = {q: [], r: [], b: [], n: [], p: []}

    var pieceArray = ['q','r','b','n','p'];

    for(var i = 0; i<5; i++){
        var capturedPiece = pieceArray[i];
        for(var j = 0; j<5; j++){
            var takingPiece = pieceArray[j];
            table[capturedPiece][takingPiece] = pieceNum[capturedPiece]*20-pieceNum[takingPiece];
        }
    }
    return table;
}

function initKillerMoveTable(){
    for(var i = 0; i<maxDepth; i++){
        var moveArray = [];
        killerMoveTable[i] = moveArray;
    }
}

function updateKillerMoveTable(ply, move){
    if(move.captured){
        return;
    }

    if(killerMoveTable[ply].length){
        if(killerMoveTable[ply].length == 2){
            var newSecondMove = killerMoveTable[ply].shift();
            killerMoveTable[ply][0] = move;
            killerMoveTable[ply][1] = newSecondMove;
        }
        else{
            killerMoveTable[ply].unshift(move);
        }
    }
    else{
        killerMoveTable[ply].push(move);
    }
}