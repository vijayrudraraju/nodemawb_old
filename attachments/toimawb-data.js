// building the parsing data structures

TOI.DATA.calcPartialHood = function(obj, array, hoodSize) {
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
    //console.log('calcHood end', obj, array, array.length);
};
TOI.DATA.calcCompleteHood = function(atom, firstType, secondType, targetSize) {
    var toi = TOI.getAtom;

    var firstObj = atom[firstType+'s'];
    var firstArr = atom[firstType+'hood'];
    this.calcPartialHood(firstObj,firstArr, targetSize);

    var secondPointer = atom[secondType+'hood'][0];
    if (secondPointer === undefined) {
        return;
    }
    var secondObj = toi(secondPointer)[firstType+'s'];
    if (firstArr.length < targetSize) {
        this.calcPartialHood(secondObj, firstArr, targetSize);
    }

    var thirdPointer = atom[secondType+'hood'][1];
    if (thirdPointer === undefined) {
        return;
    }
    var thirdObj = toi(thirdPointer)[firstType+'s'];
    if (firstArr.length < targetSize) {
        this.calcPartialHood(thirdObj, firstArr, targetSize);
    }

    var fourthPointer = atom[secondType+'hood'][2];
    if (fourthPointer === undefined) {
        return;
    }
    var fourthObj = toi(fourthPointer)[firstType+'s'];
    if (firstArr.length < targetSize) {
        this.calcPartialHood(fourthObj, firstArr, targetSize);
    }
};
TOI.DATA.calcNeighborhoods = function(docs) {
    var that = this;

    var LETTERHOODSIZE = 8;
    var WORDHOODSIZE = 3;
    var PARAGRAPHHOODSIZE = 1;

    _.each(docs, function(atom, i, list) {
        //console.log('letter',atom['_id'], atom);    
        that.calcCompleteHood(atom, 'letter', 'letter', LETTERHOODSIZE);
    });
    _.each(docs, function(atom, i, list) {
        //console.log('word',atom['_id'], atom);    
        that.calcCompleteHood(atom, 'word', 'word', WORDHOODSIZE);
    });
    _.each(docs, function(atom, i, list) {
        //console.log('paragraph',atom['_id'], atom);    
        that.calcCompleteHood(atom, 'paragraph', 'word', PARAGRAPHHOODSIZE);
    });

    console.log('initial parse complete',docs);
};



TOI.DATA.parseAlphabet = function(docs, letters) {

    var toi = TOI.getAtom;
    var dist = TOI.calcLinearDist;
    var sqDist = TOI.calcSquareDist;
    var update = TOI.updateDist;

    for (var i=0;i<letters.length;i++) {
        var thisLetter = letters[i];

        // perform higher level processing
        // 1(a) connect letters with simultaneously adjacent letters
        for (var j=1;j<=letters.length;j++) {
            // connect in forward direction
            if (i+j < letters.length) {
                update(toi(thisLetter), 'letters', letters[i+j], sqDist(j));
            }
            // connect in backwards direction
            if (i-j >= 0) {
                update(toi(thisLetter), 'letters', letters[i-j], sqDist(j));
            }
        }
        //console.log('letters[i]', docs[letters[i]]);
    }

};
TOI.DATA.parseWordset = function(docs, words) {

    var toi = TOI.getAtom;
    var dist = TOI.calcLinearDist;
    var sqDist = TOI.calcSquareDist;
    var update = TOI.updateDist;

    for (var i=0;i<words.length;i++) {
        var thisWord = words[i];

        // perform lower level processing
        this.parseAlphabet(docs, thisWord); 

        // perform higher level processing
        // iterate through letters
        for (var j=0;j<thisWord.length;j++) {
            var thisLetter = thisWord[j];

            // 1(a) connect this word to the letters it contains
            update(toi(thisWord), 'letters', thisLetter, dist(j+1));
            // 1(b) connect the letters it contains to the word
            update(toi(thisLetter), 'words', thisWord, sqDist(j+1));
        }

        // 2(a) connect words with closest simultaneously adjacent words
        for (var j=1;j<=10;j++) {
            // connect forwards
            if (i+j < words.length) {
                update(toi(thisWord), 'words', words[i+j], dist(j));
            }
            // connect backwords
            if (i-j >= 0) {
                update(toi(thisWord), 'words', words[i-j], dist(j));
            }
        }
    }
};
TOI.DATA.parseParagraphset = function(docs, paragraphs) {

    var toi = TOI.getAtom;
    var dist = TOI.calcLinearDist;
    var sqDist = TOI.calcSquareDist;
    var update = TOI.updateDist;

    for (var i=0;i<paragraphs.length;i++) {
        var thisPara = paragraphs[i];

        // perform lower level processing
        this.parseWordset(docs, thisPara); 

        // perform higher level processing
        // iterate through words
        for (var j=0;j<thisPara.length;j++) {
            var thisWord = thisPara[j];
            var firstLetter = thisWord[0];
            // 1(a) connect the paragraph to the firstLetter of the words it contains
            update(toi(thisPara), 'letters', firstLetter, dist(j+1));
            // 1(b) connect first letter of the words it contains to the paragraph
            update(toi(firstLetter), 'paragraphs', thisPara, dist(j+1));
            // 2(a) connect the paragraph to the words it contains
            update(toi(thisPara), 'words', thisWord, sqDist(j+1));
            // 2(b) connect words it contains to the paragraph
            update(toi(thisWord), 'paragraphs', thisPara, sqDist(j+1));
        }

        // 3(a) connect paragraphs with closest simultaneously adjacent paragraphs
        for (var j=1;j<=10;j++) {
            // connect in forward direction
            if (i+j < paragraphs.length) {
                update(toi(thisPara), 'paragraphs', paragraphs[i+j], dist(j));
            }
            // connect in backward direction
            if (i-j >= 0) {
                update(toi(thisPara), 'paragraphs', paragraphs[i-j], sqDist(j));
            }
        }
    }

};



// a letter is adjacent to at most 4 letters, 3 words, 1 paragraph
// a word is adjacent to at most 8 letters, 3 words, 1 paragraph
// a paragraph is adjacent to at most 8 letters, 3 words, 1 paragraph
TOI.DATA.INIT = [['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts']]; 
// the first pass through the initial data seed
console.log('parsing', TOI.DATA.INIT, 'into', TOI.DATA.DOCS);
TOI.DATA.parseParagraphset(TOI.DATA.DOCS, TOI.DATA.INIT);
console.log('generating neighborhoods', TOI.DATA.DOCS);
TOI.DATA.calcNeighborhoods(TOI.DATA.DOCS);
