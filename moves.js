var capValue = {q: 20000, r: 10000, b: 5000, n: 3000, p: 1000};
var takenByValue = {q: 100, r: 50, b: 30, n: 20, p: 10};

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