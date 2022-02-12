var pvTable = new Map();

function getPvLine(depth){
    // Need to work on this
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