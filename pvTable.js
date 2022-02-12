var pvTable = new Map();

// needs to check for game over
function getPvLine(depth, hash){
    // Need to work on this
    var line = [];
    var depthCopy = depth;
    while(depth != 0){
        var move = pvTable.get(hash);
        if(move){
            console.log(move);
            line.push(move);
            var moveHash = move_Hash(move);
            hash = hash ^ moveHash;
        }
        depth--;
    }
    lineText = "Line at Depth "+depthCopy+" is: ";
    for(var i = 0; i<line.length; i++){
        lineText = lineText+line[i].san+ ", ";
    }

    return lineText;
}

function probePvTable(hash){
    if(pvTable.has(hash)){
        return pvTable.get(hash);
    }
    return NOMOVE;
}

function storePvMove(hash, move) {
    pvTable.set(hash, move);
}

function ClearPvTable(){
    pvTable.clear();
}