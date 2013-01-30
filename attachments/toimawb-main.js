function Toi() {
    // turning arguments into an array
    var args = Array.prototype.slice.call(arguments),
        // the last argument is the callback
        callback = args.pop(),
        // modules can be passed as an array or as individual parameters
        modules = (args[0] && typeof args[0] === 'string') ? args : args[0],
        i;

    // make sure the function is called
    // as a constructor
    if (!(this instanceof Toi)) {
        return new Toi(modules, callback);
    }
    
    // add properties to this as needed:
    // REPLACE
    this.a = 1;
    this.b = 2;

    // now add modules to the core 'this' object
    // no modules or "*" both mean "use all modules"
    if (!modules || modules==='*') {
        modules = [];
        for (i in Toi.modules) {
            if (Toi.modules.hasOwnProperty(i)) {
               modules.push(i);
            }
        }
    }

    // initialize the required modules
    for (i=0;i<modules;i+=1) {
        Toi.modules[modules[i]](this);
    }

    // call the callback
    callback(this);
};
Toi.prototype = {
    name:'nodemawb',
    starter:[['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts']],
    version:'0.1',
    getName:function() {
        return this.name;
    }
};
Toi.modules.config = function(box) {
    box.types = {};
    box.types.letter = {totalNum:9,xDivNum:3,yDivNum:3};
    box.types.word = {totalNum:6,xDivNum:2,yDivNum:3};
};
Toi.modules.dom = function(box) {
    //box.body = document.getElementById('app-bdy'); 
    //box.frame = document.getElementById('app-frm'); 
    //box.stack = document.getElementById('app-lttr-stck'); 
    box.face = document.getElementsByClassName('face');

    box.faceObjArr = [];
    box.faceObjTextArr = [];

    var cellWidth = box.face.offsetWidth/6,
        cellHeight = this.frame.offsetHeight/3,
        pos = [
        {x:0,y:0},{x:cellWidth,y:0},{x:cellWidth*2,y:0},{x:cellWidth*3,y:0},{x:cellWidth*4,y:0},{x:cellWidth*5,y:0},
        {x:0,y:cellHeight},{x:cellWidth,y:cellHeight},{x:cellWidth*2,y:cellHeight},{x:cellWidth*3,y:cellHeight},{x:cellWidth*4,y:cellHeight},{x:cellWidth*5,y:cellHeight},
        {x:0,y:cellHeight*2},{x:cellWidth,y:cellHeight*2},{x:cellWidth*2,y:cellHeight*2},{x:cellWidth*3,y:cellHeight*2},{x:cellWidth*4,y:cellHeight*2},{x:cellWidth*5,y:cellHeight*2},
        ];

    box.createFace = function() {
        for (var i=0;i<9;i++) {
            this.faceObjArr[i] = document.createElement('div');
            this.faceObjTextArr[i] = document.createElement('p');
            this.faceObjArr[i].appendChild(faceObjTextArr[i]);
        }
    };
    box.configFace = function() {
    };
    box.setText = function(el, text) {
        el.innerHTML = text;
    }
    box.clearText = function(el) {
        el.innerHTML = '';
    };
    box.setPos = function(el, index) {
        el.style.left = pos[index].x+'px';
        el.style.top = pos[index].y+'px';
        el.style.display = 'block';
    };
    box.clearPos = function(el) {
        el.style.left = 0;
        el.style.top = 0;
        el.style.display = 'none';
    }
    box.clearFrame = function() {
        for (var i=0;i<that.faceObjTextArr.length;i++) {
            clearText(that.faceObjTextArr[i]);
        }
    };
    box.setType = function(el, type) {
        //console.log('setType',el.childNodes[0]);
        var padding = 2+8,
            innerPadding = 6,
            innerEl = el.childNodes[0];
        switch(type) {
            case 'marker':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'marker';

                innerEl.style.width = cellWidth-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-marker';
                break;
            case 'paragraph':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight*2-padding+'px';
                el.className = 'paragraph';

                innerEl.style.width = cellWidth*2-padding-innerPadding+'px';
                innerEl.style.height = cellHeight*2-padding-innerPadding+'px';
                innerEl.className = 'inner-paragraph';
                break;
            case 'word':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'word';

                innerEl.style.width = cellWidth*2-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-word';
                break;
            case 'letter':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'letter';

                innerEl.style.width = cellWidth-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-letter';
                break;
        }
        el.className += ' face-obj';
        innerEl.className += ' inner-face-obj';
    };
    box.setFace = function(index) {
        var letterCount = 0;
        var wordCount = 0;
        var paragraphCount = 0;

        var frameConfig = TOI.CONFIG.frameConfigs[((TOI.STATE.view+1)*9)+index];
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
    };
};
Toi.modules.database = function(box) {
    box.docs = {};
};
Toi.modules.process = function(box) {
    function createDoc(docs, atom) {
        if (atom === undefined) {
            atom.clear();
        }
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

    box.calcPartialHood = function(obj, array, hoodSize) {
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
    box.calcCompleteHood = function(atom, firstType, secondType, targetSize) {
        //var toi = TOI.getAtom;

        var firstObj = atom[firstType+'s'];
        var firstArr = atom[firstType+'hood'];
        this.calcPartialHood(firstObj,firstArr, targetSize);

        var secondPointer = atom[secondType+'hood'][0];
        if (secondPointer === undefined) {
            return;
        }
        var secondObj = getAtom(secondPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(secondObj, firstArr, targetSize);
        }

        var thirdPointer = atom[secondType+'hood'][1];
        if (thirdPointer === undefined) {
            return;
        }
        var thirdObj = getAtom(thirdPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(thirdObj, firstArr, targetSize);
        }

        var fourthPointer = atom[secondType+'hood'][2];
        if (fourthPointer === undefined) {
            return;
        }
        var fourthObj = getAtom(fourthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(fourthObj, firstArr, targetSize);
        }
    };
    box.calcNeighborhoods = function(docs) {
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
};
Toi.modules.parse = function(box) {
    function createDoc(docs, atom) {
        /*
        if (atom === undefined) {
            atom.clear();
        }
        */
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

    box.parseAlphabet = function(docs, letters) {
        //var toi = TOI.getAtom;
        //var dist = TOI.calcLinearDist;
        //var sqDist = TOI.calcSquareDist;
        //var update = TOI.updateDist;

        for (var i=0;i<letters.length;i++) {
            var thisLetter = letters[i];

            // perform higher level processing
            // 1(a) connect letters with simultaneously adjacent letters
            for (var j=1;j<=letters.length;j++) {
                // connect in forward direction
                if (i+j < letters.length) {
                    updateDist(getAtom(thisLetter), 'letters', letters[i+j], calcSquareDist(j));
                }
                // connect in backwards direction
                if (i-j >= 0) {
                    updateDist(getAtom(thisLetter), 'letters', letters[i-j], calcSquareDist(j));
                }
            }
            //console.log('letters[i]', docs[letters[i]]);
        }

    };
    box.parseWordset = function(docs, words) {

        //var toi = TOI.getAtom;
        //var dist = TOI.calcLinearDist;
        //var sqDist = TOI.calcSquareDist;
        //var update = TOI.updateDist;

        for (var i=0;i<words.length;i++) {
            var thisWord = words[i];

            // perform lower level processing
            this.parseAlphabet(docs, thisWord); 

            // perform higher level processing
            // iterate through letters
            for (var j=0;j<thisWord.length;j++) {
                var thisLetter = thisWord[j];

                // 1(a) connect this word to the letters it contains
                updateDist(getAtom(thisWord), 'letters', thisLetter, calcLinearDist(j+1));
                // 1(b) connect the letters it contains to the word
                updateDist(getAtom(thisLetter), 'words', thisWord, calcSquareDist(j+1));
            }

            // 2(a) connect words with closest simultaneously adjacent words
            for (var j=1;j<=10;j++) {
                // connect forwards
                if (i+j < words.length) {
                    updateDist(getAtom(thisWord), 'words', words[i+j], calcLinearDist(j));
                }
                // connect backwords
                if (i-j >= 0) {
                    updateDist(getAtom(thisWord), 'words', words[i-j], calcLinearDist(j));
                }
            }
        }
    };
    box.parseParagraphset = function(docs, paragraphs) {

        //var toi = TOI.getAtom;
        //var dist = TOI.calcLinearDist;
        //var sqDist = TOI.calcSquareDist;
        //var update = TOI.updateDist;

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
                updateDist(getAtom(thisPara), 'letters', firstLetter, calcLinearDist(j+1));
                // 1(b) connect first letter of the words it contains to the paragraph
                updateDist(getAtom(firstLetter), 'paragraphs', thisPara, calcLinearDist(j+1));
                // 2(a) connect the paragraph to the words it contains
                updateDist(getAtom(thisPara), 'words', thisWord, calcSquareDist(j+1));
                // 2(b) connect words it contains to the paragraph
                updateDist(getAtom(thisWord), 'paragraphs', thisPara, calcSquareDist(j+1));
            }

            // 3(a) connect paragraphs with closest simultaneously adjacent paragraphs
            for (var j=1;j<=10;j++) {
                // connect in forward direction
                if (i+j < paragraphs.length) {
                    updateDist(getAtom(thisPara), 'paragraphs', paragraphs[i+j], calcLinearDist(j));
                }
                // connect in backward direction
                if (i-j >= 0) {
                    updateDist(getAtom(thisPara), 'paragraphs', paragraphs[i-j], calcSquareDist(j));
                }
            }
        }
    };
};
Toi.modules.event = function(box) {
    // access to the Toi prototype if needed:
    // box.constructor.prototype.m = 'mmm';
    box.attachEvent = function() {};
    box.detatchEvent = function() {}; 
};
Toi.modules.ajax = function(box) {
    box.makeRequest = function() {};
    box.getResponse = function() {};
};
Toi('*', function(box) {
    console.log(box);
});

//!TOI.MAIN.body = document.getElementById('app-bdy'); 
//!TOI.MAIN.frame = document.getElementById('app-frm'); 
//!TOI.MAIN.stack = document.getElementById('app-lttr-stck'); 
TOI.MAIN.data = TOI.DATA.DOCS;



TOI.MAIN.initDom = function() {
    var arr = [];
    for (var i=0;i<9;i++) {
        this.divArr[i] = document.createElement('div');
        arr[i] = document.createElement('div');
        this.pArr[i] = document.createElement('p');
        this.divArr[i].appendChild(arr[i]);
        arr[i].appendChild(this.pArr[i]);
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
        console.log('setType',el.childNodes[0]);
        var padding = 2+8;
        var innerEl = el.childNodes[0];
        var innerPadding = 6;
        switch(type) {
            case 'marker':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'marker';

                innerEl.style.width = cellWidth-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-marker';
                break;
            case 'paragraph':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight*2-padding+'px';
                el.className = 'paragraph';

                innerEl.style.width = cellWidth*2-padding-innerPadding+'px';
                innerEl.style.height = cellHeight*2-padding-innerPadding+'px';
                innerEl.className = 'inner-paragraph';
                break;
            case 'word':
                el.style.width = cellWidth*2-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'word';

                innerEl.style.width = cellWidth*2-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-word';
                break;
            case 'letter':
                el.style.width = cellWidth-padding+'px';
                el.style.height = cellHeight-padding+'px';
                el.className = 'letter';

                innerEl.style.width = cellWidth-padding-innerPadding+'px';
                innerEl.style.height = cellHeight-padding-innerPadding+'px';
                innerEl.className = 'inner-letter';
                break;
        }
        el.className += ' frame-obj';
        innerEl.className += ' inner-frame-obj';
    }
    function setPos(el, index) {
        el.style.left = pos[index].x+'px';
        el.style.top = pos[index].y+'px';
        that.frame.appendChild(el);
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

    var getView = function() {
        return TOI.STATE.view;
    };
    var setView = function(num) {
        TOI.STATE.view = num;
        
        var el = document.getElementsByClassName('marker')[0];
        el.className = 'frame-obj marker';
        var innerEl = el.childNodes[0];
        switch (num) {
            case 0:
                innerEl.className = 'inner-frame-obj inner-marker';
                break;
            case 1:
                innerEl.className = 'inner-frame-obj inner-marker option one';
                break;
            case 2:
                innerEl.className = 'inner-frame-obj inner-marker option two';
                break;
            case 3:
                innerEl.className = 'inner-frame-obj inner-marker option three';
                break;
        }
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
        el.className = 'frame-obj marker';

        var innerEl = el.childNodes[0];
        innerEl.className = 'inner-frame-obj inner-marker option one';

        //setText(innerEl.childNodes[0],'#');

        TOI.STATE.sequence += str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var setSpaceTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        if (el === undefined) {
            return;
        }
        el.className = 'frame-obj marker';

        var innerEl = el.childNodes[0];
        innerEl.className = 'inner-frame-obj inner-marker option two';

        //setText(innerEl.childNodes[0],'_');

        TOI.STATE.sequence += ' '+str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var setLineTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        if (el === undefined) {
            return;
        }
        el.className = 'frame-obj marker';

        var innerEl = el.childNodes[0];
        innerEl.className = 'inner-frame-obj inner-marker option three';

        //setText(innerEl.childNodes[2],'.');

        TOI.STATE.sequence += '<br>'+str.replace(/,/g,' ');
        setStack(TOI.STATE.sequence);
    };
    var unsetTypeWrite = function(str) {
        var el = document.getElementsByClassName('marker')[0];
        el.className = 'frame-obj marker';

        var innerEl = el.childNodes[0];
        innerEl.className = 'inner-frame-obj inner-marker';

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

        var frameConfig = TOI.CONFIG.frameConfigs[((TOI.STATE.view+1)*9)+index];
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
    function clearText(el) {
        el.innerHTML = '';
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
        var pointer = that.divArr[TOI.CONFIG.posMappings[lastIndex][index][0]].childNodes[0].childNodes[0].innerHTML.replace(/ /g,','); 

        if (index !== lastIndex) {
            setContext(index, pointer);
            setStack(TOI.STATE.sequence+'<span class="red">'+pointer.replace(/,/g,' ')+'</span>');
        } else {
            console.log('debug indexes', lastIndex, index, pointer);
            var pos = TOI.CONFIG.posMappings[lastIndex][index][0];
            console.log('debug type', pos, that.divArr[pos], pointer);
            if (document.getElementsByClassName('inner-marker option').length === 0) {
                setView(1);
            } else if (document.getElementsByClassName('inner-marker option one').length > 0) {
                setView(2);
            } else if (document.getElementsByClassName('inner-marker option two').length > 0) {
                setView(0);
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

    window.scrollTo(0,1);
};



TOI.MAIN.start();
