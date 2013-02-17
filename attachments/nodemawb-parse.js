Toi.modules.parse = function(box) {
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
    function updateDist(atom, type, connection, newDist) {
        //console.log('updateDist', atom, type, connection, newDist);
        if (!atom[type].hasOwnProperty(connection)) {
            atom[type][connection] = newDist;
        } else {
            atom[type][connection] += newDist;
        }
    }
    function calcLinearDist(i) {
        return 1/Math.pow(i,1);
    }
    function calcSquareDist(i) {
        return 1/Math.pow(i,2);
    }

    function parseAlphabet(docs, letters) {
        for (var i=0;i<letters.length;i++) {
            var thisLetter = letters[i];
            var thisAtom;

            // perform higher level processing
            // 1(a) connect letters with simultaneously adjacent letters
            for (var j=1;j<=letters.length;j++) {
                // connect in forward direction
                if (i+j < letters.length) {
                    updateDist(getAtom(docs,thisLetter), 'letters', letters[i+j], calcSquareDist(j));
                }
                // connect in backwards direction
                if (i-j >= 0) {
                    updateDist(getAtom(docs,thisLetter), 'letters', letters[i-j], calcSquareDist(j));
                }
            }
            //console.log('letters[i]', docs[letters[i]]);
        }

    }
    function parseWordset(docs, words) {

        for (var i=0;i<words.length;i++) {
            var thisWord = words[i];
            if (thisWord === '') {
                continue;
            }

            // perform lower level processing
            parseAlphabet(docs, thisWord); 

            // perform higher level processing
            // iterate through letters
            for (var j=0;j<thisWord.length;j++) {
                var thisLetter = thisWord[j];

                // 1(a) connect this word to the letters it contains
                updateDist(getAtom(docs,thisWord), 'letters', thisLetter, calcLinearDist(j+1));
                // 1(b) connect the letters it contains to the word
                updateDist(getAtom(docs,thisLetter), 'words', thisWord, calcSquareDist(j+1));
            }

            // 2(a) connect words with closest simultaneously adjacent words
            for (var j=1;j<=10;j++) {
                // connect forwards
                if (i+j < words.length) {
                    updateDist(getAtom(docs,thisWord), 'words', words[i+j], calcLinearDist(j));
                }
                // connect backwords
                if (i-j >= 0) {
                    updateDist(getAtom(docs,thisWord), 'words', words[i-j], calcLinearDist(j));
                }
            }
        }
    }
    box.parseParagraphset = function(docs, paragraphs) {

        for (var i=0;i<paragraphs.length;i++) {
            var thisPara = paragraphs[i];
            if (thisPara.length < 2) {
                continue;
            }

            // perform lower level processing
            parseWordset(docs, thisPara); 

            // perform higher level processing
            // iterate through words
            for (var j=0;j<thisPara.length;j++) {
                var thisWord = thisPara[j];
                var firstLetter = thisWord[0];
                // 1(a) connect the paragraph to the firstLetter of the words it contains
                updateDist(getAtom(docs,thisPara), 'letters', firstLetter, calcLinearDist(j+1));
                // 1(b) connect first letter of the words it contains to the paragraph
                updateDist(getAtom(docs,firstLetter), 'paragraphs', thisPara, calcLinearDist(j+1));
                // 2(a) connect the paragraph to the words it contains
                updateDist(getAtom(docs,thisPara), 'words', thisWord, calcSquareDist(j+1));
                // 2(b) connect words it contains to the paragraph
                updateDist(getAtom(docs,thisWord), 'paragraphs', thisPara, calcSquareDist(j+1));
            }

            // 3(a) connect paragraphs with closest simultaneously adjacent paragraphs
            for (var j=1;j<=10;j++) {
                // connect in forward direction
                if (i+j < paragraphs.length) {
                    updateDist(getAtom(docs,thisPara), 'paragraphs', paragraphs[i+j], calcLinearDist(j));
                }
                // connect in backward direction
                if (i-j >= 0) {
                    updateDist(getAtom(docs,thisPara), 'paragraphs', paragraphs[i-j], calcSquareDist(j));
                }
            }
        }
    };
};
