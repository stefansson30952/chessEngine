var MVVALVATable = initMMVLVATable();

function generateMoves(game, hash){
    var moveList = game.moves({verbose: true});
    var scoredMoveList = createScoredMoveList(moveList);
    
    /* Set the score of the pv move */
    var pvMove = probePvTable(hash);
    if(pvMove != NOMOVE){
        for(var i = 0; i<scoredMoveList.length; i++){
            if(scoredMoveList[i].move == pvMove){
                scoredMoveList[i].score = 100000; // score of a pv Move
            }
        }
    }

    /* Return ordered move list based on score */
    return orderMovesBasedOnScore(scoredMoveList);
}

function generateCaptures(game){
    var moveList = game.moves({verbose: true});
    var capMoveList = [];
    for(var i = 0; i<moveList.length; i++){
        if(moveList[i].captured){
            capMoveList.push(moveList[i]);
        }
    }
    return capMoveList;
}

function MVVLVA(moveList){
    for(var i = 0; i<moveList.length; i++){
        if(moveList[i].move.captured){
            moveList[i].score = capValue[moveList[i].move.captured]-takenByValue[moveList[i].piece]; 
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
function orderMovesBasedOnScore(moveList){
    var orderedList = [];
    while(moveList.length){
        var score = moveList[0].score;
        var bestMove = moveList[0].move;
        var bestMoveSpot = 0;
        for(var i = 0; i<moveList.length; i++){
            if(moveList[i].score > score){
                score = moveList[i].score;
                bestMove = moveList[i].move;
                bestMoveSpot = i;
            }
        }
        orderedList.push(bestMove);
        moveList.splice(bestMoveSpot, 1);
    }
    return orderedList
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