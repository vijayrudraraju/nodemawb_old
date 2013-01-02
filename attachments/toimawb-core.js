var TOI = {
    'DEBUG':{},
    'TIME':[0],
    'CONFIG':{
        'numPoints': 9,
        'frameTypes': [],
        'calcFrameConfigs': {},
        'calcPosMappings': {},
        'frameConfigs': {},
        'posMappings': {}
    },
    'createDoc':{},
    'getAtom':{},
    'calcLinearDist':{},
    'calcSquareDist':{},
    'updateDist':{},
    'DATA':{
        'calcPartialHood':{},
        'calcCompleteHood':{},
        'calcNeighborhoods':{},
        'parseAlphabet':{},
        'parseWordset':{},
        'parseParagraphset':{},
        'process':{},
        'INIT':[],
        'TRAIL':[],
        'DOCS':{}
    },
    'MAIN':{
        'divArr':[],
        'pArr':[],
        'stackArr':[],
        'body':{},
        'frame':{},
        'stack':{},
        'data':{},
        'start':{}
    },
    'STATE':{
        'sequence':'',
        'pointer':'',
        'index':0,
    }
};



// the different frame types are constructed from these arrays
TOI.CONFIG.frameTypes[0] = ['marker0','word0','word0','letter0','paragraph0','paragraph0','letter1','paragraph0','paragraph0'];
TOI.CONFIG.frameTypes[1] = ['letter0','marker0','letter1','paragraph0','paragraph0','letter2','paragraph0','paragraph0','letter3'];
TOI.CONFIG.frameTypes[2] = ['word0','word0','marker0','paragraph0','paragraph0','letter0','paragraph0','paragraph0','letter1'];
TOI.CONFIG.frameTypes[3] = ['letter0','word0','word0','marker0','word1','word1','letter1','word2','word2'];
TOI.CONFIG.frameTypes[4] = ['letter0','letter1','letter2','letter3','marker0','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes[5] = ['word0','word0','letter0','word1','word1','marker0','word2','word2','letter1'];
TOI.CONFIG.frameTypes[6] = ['letter0','paragraph0','paragraph0','letter1','paragraph0','paragraph0','marker0','word0','word0'];
TOI.CONFIG.frameTypes[7] = ['letter0','paragraph0','paragraph0','letter1','paragraph0','paragraph0','letter2','marker0','letter3'];
TOI.CONFIG.frameTypes[8] = ['paragraph0','paragraph0','letter0','paragraph0','paragraph0','letter1','word0','word0','marker0'];
TOI.CONFIG.calcFrameConfigs = function() {
    var returnArr = [];

    for (var index=0;index<this.frameTypes.length;index++) {
        returnArr.push([]);

        var frameType = this.frameTypes[index];
        var frameConfig = returnArr[index];

        var capturedObjects = [];
        var objCount = 0;

        for (var i=0;i<frameType.length;i++) {
            var captured = false;
            for (var j=0;j<capturedObjects.length;j++) {
                if (frameType[i] === capturedObjects[j]) {
                    captured = true;
                    break;
                }
            }
            if (!captured) {
                frameConfig.push([frameType[i].slice(0,frameType[i].length-1),i]);
                capturedObjects.push(frameType[i]);
                objCount++;
            }
        }

    }
    return returnArr;
};
TOI.CONFIG.calcPosMappings = function() {
    var returnArr = [];

    for (var i in this.frameConfigs) {
        //console.log('calcPosMappings',i,this.frameConfigs[i]);
        returnArr[i] = [];
        for (var j in this.frameConfigs[i]) {
            //console.log(j,this.frameConfigs[i][j]);
            var pointer = this.frameConfigs[i][j];
            var jInt = parseInt(j);
            if (pointer[0] === 'marker') {
                returnArr[i][pointer[1]] = [jInt,'marker'];    
            } else if (pointer[0] === 'letter') {
                returnArr[i][pointer[1]] = [jInt,'letter'];    
            } else if (pointer[0] === 'word') {
                returnArr[i][pointer[1]] = [jInt,'word'];    
                returnArr[i][pointer[1]+1] = [jInt,'word'];    
            } else if (pointer[0] === 'paragraph') {
                returnArr[i][pointer[1]] = [jInt,'paragraph'];    
                returnArr[i][pointer[1]+1] = [jInt,'paragraph'];    
                returnArr[i][pointer[1]+3] = [jInt,'paragraph'];    
                returnArr[i][pointer[1]+3+1] = [jInt, 'paragraph'];    
            }
        }
    }
    return returnArr;
};
TOI.CONFIG.frameConfigs = TOI.CONFIG.calcFrameConfigs();
TOI.CONFIG.posMappings = TOI.CONFIG.calcPosMappings();



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
TOI.DATA.process = function(docs, paragraphs) {
    console.log('parsing', paragraphs, 'into', docs);
    TOI.DATA.parseParagraphset(docs, paragraphs);
};
TOI.DATA.process(TOI.DATA.DOCS, TOI.DATA.INIT);
TOI.DATA.calcNeighborhoods(TOI.DATA.DOCS);



TOI.MAIN.body = document.getElementById('app-bdy'); 
TOI.MAIN.frame = document.getElementById('app-frm'); 
TOI.MAIN.stack = document.getElementById('app-stck'); 
TOI.MAIN.data = TOI.DATA.DOCS;



TOI.MAIN.initDom = function() {
    for (var i=0;i<9;i++) {
        this.divArr[i] = document.createElement('div');
        this.pArr[i] = document.createElement('p');
        this.divArr[i].appendChild(this.pArr[i]);
    }
    this.stackArr.push(document.createElement('p'));
    this.stack.appendChild(this.stackArr[0]);
};
TOI.MAIN.start = function() {
    var that = this;



    this.initDom();
        


    var cellNumber = 3;
    var cellWidth = this.frame.offsetWidth/cellNumber;
    var cellHeight = this.frame.offsetHeight/cellNumber;
    var pos = [
    {x:0,y:0},{x:cellWidth,y:0},{x:cellWidth*2,y:0},
    {x:0,y:cellHeight},{x:cellWidth,y:cellHeight},{x:cellWidth*2,y:cellHeight},
    {x:0,y:cellHeight*2},{x:cellWidth,y:cellHeight*2},{x:cellWidth*2,y:cellHeight*2},
    ];



    function setType(el, type) {
        var padding = 2+20;
        switch(type) {
            case 'marker':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'marker';
                break;
            case 'paragraph':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight*2-padding+'px';
                el.className = 'paragraph';
                break;
            case 'word':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'word';
                break;
            case 'letter':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'letter';
                break;
        }
        el.className += ' frame-obj';
    }
    function setPos(el, index) {
        el.style.left = pos[index].x+'px';
        el.style.top = pos[index].y+'px';
        that.frame.appendChild(el);
    }
    function clearText(el) {
        el.innerHTML = '';
    }
    function setText(el, text, invisible) {
        if (invisible) {
            el.style.display = 'none';
        } else {
            el.style.display = 'block';
        }
        el.innerHTML = text;
    }



    var getPointer = function() {
        return TOI.STATE.pointer;
    };
    var setPointer = function(str) {
        TOI.STATE.pointer = str;
    };
    var getIndex = function() {
        return TOI.STATE.index;
    };
    var setIndex = function(num) {
        TOI.STATE.index = num;
    };
    var setStack = function(str) {
        TOI.MAIN.stackArr[0].innerHTML = str;
    };



    var setTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        if (el === undefined) {
            return;
        }
        el.className = 'frame-obj marker option one';

        TOI.STATE.sequence += str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var setSpaceTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        if (el === undefined) {
            return;
        }
        el.className = 'frame-obj marker option two';

        TOI.STATE.sequence += ' '+str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var setLineTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        if (el === undefined) {
            return;
        }
        el.className = 'frame-obj marker option three';

        TOI.STATE.sequence += '<br>'+str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var unsetTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        el.className = 'frame-obj marker';

        setStack(TOI.STATE.sequence+'<span class="red">'+str.replace(/,/g,' ')+'</span>');
    };
    var whiteoutType = function(str) {
        console.log('before','whiteoutType',TOI.STATE.sequence);

        // trim last atom
        var i = TOI.STATE.sequence.lastIndexOf(str.replace(/,/g,' '));
        if (i !== -1) {
            TOI.STATE.sequence = TOI.STATE.sequence.slice(0, i);
        }

        // trim space
        TOI.STATE.sequence = TOI.STATE.sequence.trim();

        // trim line break
        var j = TOI.STATE.sequence.lastIndexOf('<br>');
        if (j !== -1 && j >= TOI.STATE.sequence.length-4) {
            TOI.STATE.sequence = TOI.STATE.sequence.slice(0, j);
        }

        console.log('after','whiteoutType',TOI.STATE.sequence);
    };



    function setFrame(index) {
        var letterCount = 0;
        var wordCount = 0;
        var paragraphCount = 0;

        var frameConfig = TOI.CONFIG.frameConfigs[index];
        var pointer = getPointer();

        clearFrame();

        for (var i=0;i<frameConfig.length;i++) {
            setType(that.divArr[i],frameConfig[i][0]);             

            if (frameConfig[i][0] === 'letter') {
                setText(that.pArr[i],that.data[pointer]['letterhood'][letterCount]);
                letterCount++;
            } else if (frameConfig[i][0] === 'word') {
                setText(that.pArr[i],that.data[pointer]['wordhood'][wordCount]);
                wordCount++;
            } else if (frameConfig[i][0] === 'paragraph') {
                setText(that.pArr[i],that.data[pointer]['paragraphhood'][paragraphCount].replace(/,/g,' '));
                paragraphCount++;
            } else if (frameConfig[i][0] === 'marker') {
                setText(that.pArr[i],pointer.replace(/,/g,' '),true);
            }

            setPos(that.divArr[i],frameConfig[i][1]);
        }

        setIndex(index);
    }
    function clearFrame() {
        that.frame.innerHTML = '';
        for (var i=0;i<that.pArr.length;i++) {
            clearText(that.pArr[i]);
        }
    }


    var frameMouseClickFunc = function(ev) {
        console.log(ev);
        updateFrame(ev.position[0].x,ev.position[0].y);
    };
    var frameMouseMoveFunc = function(ev) {
        updateFrame(ev.x,ev.y);
    };
    var updateFrame = function(xIn,yIn) {
        // figure out position from mousePosition
        var x = Math.floor((xIn-that.frame.offsetLeft+that.body.scrollLeft) / cellWidth);
        var y = Math.floor((yIn-that.frame.offsetTop+that.body.scrollTop) / cellHeight);

        // calculate index based on position
        var index = x+(3*y);
        var lastIndex = getIndex();
        var pointer = that.divArr[TOI.CONFIG.posMappings[lastIndex][index][0]].childNodes[0].innerHTML.replace(/ /g,','); 

        if (index !== lastIndex) {
            setContext(index, pointer);
            setStack(TOI.STATE.sequence+'<span class="red">'+pointer.replace(/,/g,' ')+'</span>');
        } else {
            if (document.getElementsByClassName('marker option').length === 0) {
                setTypeWrite(pointer);      
            } else if (document.getElementsByClassName('marker option one').length > 0) {
                whiteoutType(pointer);
                setSpaceTypeWrite(pointer);      
            } else if (document.getElementsByClassName('marker option two').length > 0) {
                whiteoutType(pointer);
                setLineTypeWrite(pointer);      
            } else {
                whiteoutType(pointer);
                unsetTypeWrite(pointer);      
            }
        }
    };


    //this.frame.addEventListener('mousemove', frameMouseMoveFunc);
    //this.frame.addEventListener('click', frameMouseClickFunc);
    var hammer = new Hammer(document.getElementById('app-frm'));
    hammer.ontap = frameMouseClickFunc;

    function setContext(index, pointer) {
        setPointer(pointer); 
        setFrame(index);
    }

    // initial state
    setContext(0,'toimawb');
    setStack('<span class="red">'+'toimawb'+'</span>');
};



TOI.MAIN.start();
