// core operations

TOI.createDoc = function(docs, atom) {
    if (atom === undefined) {
        atom.clear();
    }
    docs[atom] = { _id:atom, letterhood:[], wordhood:[], paragraphhood:[], letters:{}, words:{}, paragraphs:{} };    
    return docs[atom];
};
TOI.getAtom = function(atom) {
    if (!TOI.DATA.DOCS.hasOwnProperty(atom)) {
        return TOI.createDoc(TOI.DATA.DOCS, atom);
    } else {
        return TOI.DATA.DOCS[atom];
    }
};
TOI.calcLinearDist = function(i) {
    return 1/Math.pow(i,1);
};
TOI.calcSquareDist = function(i) {
    return 1/Math.pow(i,2);
};
TOI.updateDist = function(atom, type, connection, newDist) {
    //console.log('updateDist', atom, type, connection, newDist);
    if (!atom[type].hasOwnProperty(connection)) {
        atom[type][connection] = newDist;
    } else {
        atom[type][connection] += newDist;
    }
};
