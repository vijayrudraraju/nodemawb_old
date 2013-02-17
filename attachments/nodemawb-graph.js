Toi.modules.graph = function(box) {
    function createDoc(docs, atom) {
        docs[atom] = { _id:atom, letterhood:[], wordhood:[], paragraphhood:[], letters:{}, words:{}, paragraphs:{} };    
        return docs[atom];
    }
    function getAtom(docs, atom) {
        if (!docs.hasOwnProperty(atom)) {
            return createDoc(docs, atom);
        } else {
            return docs[atom];
        }
    }

    function calcPartialHood(obj, array, hoodSize) {
        //console.log('calcHood begin', obj, array, array.length);
        var pairs = _.pairs(obj);
        var sortedPairs = _.sortBy(pairs, function(innerEl, innerI, innerList) {
            return innerEl[1];
        }).reverse();

        var currentLength = array.length;
        var iterLength = hoodSize;
        if (sortedPairs.length < hoodSize) {
            iterLength = sortedPairs.length;
        }
        for (var i=currentLength;i<iterLength;i++) {
            array[i] = sortedPairs[i-currentLength][0];
        }
        // problem words: in(short), tool(duplicates)
        //console.log('calcHood end', obj, array, array.length);
    }
    function calcCompleteHood(docs, atom, firstType, secondType, targetSize) {
        var firstObj = atom[firstType+'s'];
        var firstArr = atom[firstType+'hood'];
        calcPartialHood(firstObj,firstArr, targetSize);
        atom[firstType+'hood'] = _.union(firstArr);

        var secondPointer = atom[secondType+'hood'][0];
        if (secondPointer === undefined) {
            if (firstArr.length < targetSize) {
                console.log('second try',firstType,atom,firstArr);
            }
            return;
        }
        var secondObj = getAtom(docs,secondPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(secondObj, firstArr, targetSize);
            atom[firstType+'hood'] = _.union(firstArr);
            firstArr = atom[firstType+'hood'];
        }

        var thirdPointer = atom[secondType+'hood'][1];
        if (thirdPointer === undefined) {
            if (firstArr.length < targetSize) {
            }
            return;
        }
        var thirdObj = getAtom(docs,thirdPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(thirdObj, firstArr, targetSize);
            atom[firstType+'hood'] = _.union(firstArr);
            firstArr = atom[firstType+'hood'];
        }

        var fourthPointer = atom[secondType+'hood'][2];
        if (fourthPointer === undefined) {
            if (firstArr.length < targetSize) {
                console.log('fourth try',firstType,atom,firstArr);
            }
            return;
        }
        var fourthObj = getAtom(docs,fourthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(fourthObj, firstArr, targetSize);
            atom[firstType+'hood'] = _.union(firstArr);
            firstArr = atom[firstType+'hood'];
        }

        var fifthPointer = atom[secondType+'hood'][3];
        if (fifthPointer === undefined) {
            if (firstArr.length < targetSize) {
                console.log('fifth try',firstType,atom,firstArr);
            }
            return;
        }
        var fifthObj = getAtom(docs,fifthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(fifthObj, firstArr, targetSize);
            atom[firstType+'hood'] = _.union(firstArr);
            firstArr = atom[firstType+'hood'];
        }

        var sixthPointer = atom[secondType+'hood'][4];
        if (sixthPointer === undefined) {
            if (firstArr.length < targetSize) {
                console.log('sixth try',firstType,atom,firstArr);
            }
            return;
        }
        var sixthObj = getAtom(docs,sixthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(sixthObj, firstArr, targetSize);
            atom[firstType+'hood'] = _.union(firstArr);
            firstArr = atom[firstType+'hood'];
        }

        if (firstArr.length < targetSize) {
            console.log('after sixth try',firstType,atom,firstArr);
        }
    }
    box.calcNeighborhoods = function(docs) {
        var that = this;

        var LETTERHOODSIZE = 9;
        var WORDHOODSIZE = 6;
        var PARAGRAPHHOODSIZE = 1;

        // calculate letterhoods for every atom
        _.each(docs, function(atom, i, list) {
            //console.log('letter',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'letter', 'letter', LETTERHOODSIZE);
        });
        // calculate wordhoods 
        _.each(docs, function(atom, i, list) {
            //console.log('word',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'word', 'word', WORDHOODSIZE);
        });
        // calculate paragraphhoods
        _.each(docs, function(atom, i, list) {
            //console.log('paragraph',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'paragraph', 'word', PARAGRAPHHOODSIZE);
        });

        console.log('initial parse complete',docs);
    };
};
