var SearchController = {};

SearchController.nodes;
SearchController.fh = 0;
SearchController.fhf = 0;
SearchController.timeAllowed;
SearchController.startTime;
SearchController.stop;

/* Minus dates gives miliseconds */
function checkIfTimeIsUp(){
    if(Date.now() - SearchController.startTime >= SearchController.timeAllowed){
        SearchController.stop = true;
    }
}

/* Trying to resolve any captures that could hapen to avoid horizon affect */
function quiescence(alpha, beta, hash, game, blackToMove){
    if ((SearchController.nodes % 2048) == 0) {
		checkIfTimeIsUp();
	}

    SearchController.nodes++;

    var score = evaluate(game.fen(), blackToMove);

    /* Standing Pat */
    if(score >= beta){
        return beta;
    }
    if(score > alpha){
        alpha = score;
    }

    var moves = generateCaptures(game);

    var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var move = NOMOVE;

    for(var moveNum = 0; moveNum<moves.length; moveNum++){
        /* Set the current move and get it's hash and make it */
        move = moves[moveNum];

        /* Get hash of the move */
        var moveHash = move_Hash(move);
        game.move(move.san);
        
        /* update hash with the move */
        hash = hash ^ moveHash;

        /* Recurse deeper */
        score = -quiescence(-beta, -alpha, hash, game, !blackToMove);

        /* Undo the made move */
        game.undo();

        /* unmove the move in the hash */
        hash = hash ^ moveHash;

        /* If time is up return zero */
        if(SearchController.stop == true) {
			return 0;
		}

        if(score > alpha){
            if(score >= beta){
                if(moveNum == 0){
                    /* Increase the fail high first value to show our move ordering is good */
                    SearchController.fhf++;
                }
                /* Update fail high counter */
                SearchController.fh++;
                return beta;
            }
            /* New score is alpha and update the best move */
            alpha = score;
			BestMove = move;
        }
    }

    if(alpha != OldAlpha) {
		/* Store PvMove */
        storePvMove(hash, BestMove);
	}

	return alpha;
}

function alphaBeta(alpha, beta, depth, hash, game, blackToMove){
    if ((SearchController.nodes % 2048) == 0) {
		checkIfTimeIsUp();
	}

    /* If depth is zero return the evaluation of the board */
    if(depth <= 0){
        return quiescence(alpha, beta, hash, game, blackToMove);
        //return evaluate(game.fen(), blackToMove);
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

        /* If time is up return zero */
        if(SearchController.stop == true) {
			return 0;
		}

        if(score > alpha){
            if(score >= beta){
                if(moveNum == 0){
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

function clearForSearch() {
    ClearPvTable();
    SearchController.nodes = 0;
	SearchController.fh = 0;
	SearchController.fhf = 0;
    SearchController.startTime = Date.now();
    SearchController.timeAllowed = 10000; // 10 seconds
    SearchController.stop = false;
}

function searchPosition(game){
    var bestMove = NOMOVE;
    var bestScore = -INFINITE;
    var startingHash = hash_fen(game.fen());
    var blackToMove = true;
    var depthToSearchTo = 5;

    clearForSearch();

    for(var currentDepth = 1; currentDepth<depthToSearchTo; currentDepth++){
        var bestScore = alphaBeta(-INFINITE, INFINITE, currentDepth, 
            startingHash, game, blackToMove);

        if(SearchController.stop == true) {
            console.log("Time Up");
            break;
        }
        console.log(getPvLine(currentDepth, startingHash));
         

        if(currentDepth != 1){
            console.log("Move Ordering is: "+(SearchController.fhf/SearchController.fh)*100 + " %");
        }

        bestMove = probePvTable(startingHash);    
    }
    game.move(bestMove.san);
}