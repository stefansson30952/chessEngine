var transposeTable = new Map();

function insertIntoTransposeTable(hash, move){
    transposeTable.set(hash, move);
}

function clearTransposeTable(){
    transposeTable.clear();
}