var SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function alphaBeta(alpha, beta, depth, hash, game, blackToMove){
    /* If depth is zero return the evaluation of the board */
    if(depth <= 0){
        return evaluate(game.fen(), blackToMove);
    }

    /* Increase total nodes visited */
    SearchController.nodes++;

    /* Check Rep() Fifty Move Rule */ 

    /* set the starting score to negative infinity */
    var score = -INFINITE;

    /* Get all legal moves */
    //var moves = game.moves({verbose: true});

    /* Get all legal ordered moves */
    var moves = generateMoves(game, hash);

    /* Starting best move is no move */
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var move = NOMOVE;

    /* Get PvMove */
	/* Order PvMove */

    for(var moveNum = 0; moveNum<moves.length; moveNum++){
        /* Set the current move and get it's hash and make it */
        move = moves[moveNum];

        /* Get hash of the move */
        var moveHash = move_Hash(move);
        game.move(move.san);
        
        /* update hash with the move */
        hash = hash ^ moveHash;

        /* Recurse deeper */
        score = -alphaBeta(-beta, -alpha, depth-1, hash, game, !blackToMove);

        /* Undo the made move */
        game.undo();

        /* unmove the move in the hash */
        hash = hash ^ moveHash;

        if(score > alpha){
            if(score >= beta){
                if(moveNum){
                    /* Increase the fail high first value to show our move ordering is good */
                    SearchController.fhf++;
                }
                /* Update fail high counter */
                SearchController.fh++;
                /* Update Killer Moves */
                return beta;
            }
            /* New score is alpha and update the best move */
            alpha = score;
			BestMove = move;
			/* Update History Table */
        }
    }

    /* Check if current position is in check mate */
    if(game.in_checkmate()){
        if(blackToMove){
            return MATE;
        }
        else{
            return -MATE;
        }
    }

    if(alpha != OldAlpha) {
		/* Store PvMove */
        storePvMove(hash, BestMove);
	}

	return alpha;
}

function ClearForSearch() {
    ClearPvTable();
    SearchController.nodes = 0;
	SearchController.fh = 0;
	SearchController.fhf = 0;
}

function searchPosition(game){
    ClearForSearch();

    var bestMove = NOMOVE;
    var bestScore = -INFINITE;
    var depthToSearchTo = 1;
    var startingHash = hash_fen(game.fen());
    var blackToMove = true;

    var bestScore = alphaBeta(-INFINITE, INFINITE, depthToSearchTo, 
        startingHash, game, blackToMove);

    bestMove = probePvTable(startingHash);

    console.log("Nodes Searched: "+ SearchController.nodes);

    game.move(bestMove.san);

    console.log(bestMove);
}