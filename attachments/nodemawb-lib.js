function Toi() {
    // turning arguments into an array
    var args = Array.prototype.slice.call(arguments),
        // the last argument is the callback
        callback = args.pop(),
        // modules can be passed as an array or as individual parameters
        modules = (args[0] && typeof args[0] === 'string') ? args[0] : args,
        i;

    //console.log('args[0]',args[0]);
    //console.log('arguments',arguments,'args',args,'callback',callback,'modules',modules,'this',this);

    // make sure the function is called
    // as a constructor
    if (!(this instanceof Toi)) {
        return new Toi(modules, callback);
    }
    
    // add properties to this as needed:
    // REPLACE
    this.a = 1;
    this.b = 2;

    //console.log('modules',modules,'Toi.modules',Toi.modules);

    // now add modules to the core 'this' object
    // no modules or "*" both mean "use all modules"
    if (!modules || modules==='*') {
        modules = [];
        for (i in Toi.modules) {
            if (Toi.modules.hasOwnProperty(i)) {
               modules.push(i);
            }
        }
        //console.log('new modules',modules);
    }

    // initialize the required modules
    for (i=0;i<modules.length;i++) {
        //console.log('Toi.modules[modules[i]]',Toi.modules[modules[i]]);
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
Toi.modules = {};
Toi.modules.dom = function(box) {
    var face = document.getElementsByClassName('face')[0],
        body = document.getElementsByClassName('body')[0],
        canvas = document.getElementsByClassName('canvas')[0],
        typePtr = 'letter',
        faceTypes = {letter:{numCols:3,numRows:3},word:{numCols:2,numRows:3}},
        faceObjArr = [],
        faceObjTextArr = [],
        maxNumCells = 18,
        maxNumCols = 6,
        maxNumRows = 3,
        faceWidth = face.offsetWidth,
        faceHeight = face.offsetHeight,
        cellWidth = faceWidth/maxNumCols,
        cellHeight = faceHeight/maxNumRows,
        faceCellPos = new Array();

    function forEachFaceItem(arr,rows,cols,func) {
        //console.log('forEachFaceItem',arr,func);
        for (var i=0;i<rows;i++) {
            for (var j=0;j<cols;j++) {
                func(arr[(i*cols)+j],i,j,(i*cols)+j,arr);
            }
        }
    }

    (function generateFaceCellPositions(arr) {
        arr.length = maxNumRows*maxNumCols;
        forEachFaceItem(arr,maxNumRows,maxNumCols,function(item,row,col,index,thisArr){
            thisArr[index] = {x:col*cellWidth,y:row*cellHeight};
        });
    }(faceCellPos));

    box.createFace = function() {
        face.innerHTML = '';
        for (var i=0;i<maxNumCells;i++) {
            faceObjArr[i] = document.createElement('div');
            faceObjTextArr[i] = document.createElement('p');
            faceObjArr[i].appendChild(faceObjTextArr[i]);
            face.appendChild(faceObjArr[i]);
        }
    };
    box.clearFace = function() {
        for (var i=0;i<faceObjArr.length;i++) {
            this.clearFaceObjPos(faceObjArr[i]);
            this.clearFaceObjText(faceObjTextArr[i]);
        }
    };
    box.setFace = function(pointer, data) {
        var objCount = 0,
            numRows = faceTypes[typePtr]['numRows'], 
            numCols = faceTypes[typePtr]['numCols'], 
            objWidth = faceWidth/numCols;

        this.clearFace();

        //console.log('box.setFace',objWidth,cellWidth);

        forEachFaceItem(faceObjTextArr,numRows,numCols,
                function(item,row,col,calcIndex) {
                    box.setFaceObjText(item,data[pointer][typePtr+'hood'][calcIndex]);
                });
        forEachFaceItem(faceObjArr,numRows,numCols,
                function(item,row,col,calcIndex) {
                    // calc correspondance b/w cells and objs
                    box.setFaceObjPos(item,calcIndex*(objWidth/cellWidth));
                });
    };
    box.updateFace = function(xIn,yIn) {
        // figure out position from mousePosition
        var x = Math.floor((xIn-canvas.offsetLeft+body.scrollLeft) / cellWidth);
        var y = Math.floor((yIn-canvas.offsetTop+body.scrollTop) / cellHeight);

        // calculate index based on position
        var index = x+(3*y);
    };

    box.setFaceObjText = function(el, text) {
        el.innerHTML = text;
    }
    box.clearFaceObjText = function(el) {
        el.innerHTML = '';
    };

    box.setFaceObjPos = function(el, cellIndex) {
        el.style.left = faceCellPos[cellIndex].x+'px';
        el.style.top = faceCellPos[cellIndex].y+'px';
        el.style.display = 'block';
    };
    box.clearFaceObjPos = function(el) {
        el.style.left = 0;
        el.style.top = 0;
        el.style.display = 'none';
    };

    box.setFaceType = function(type) {
        typePtr = type;

        var padding = 2+8,
            innerPadding = 6,
            numCols = faceTypes[typePtr]['numCols'],
            numRows = faceTypes[typePtr]['numRows'],
            objWidth = faceWidth/numCols,
            objHeight = faceHeight/numRows;

        console.log('box.setFaceType',typePtr,faceObjArr,faceTypes,numCols,numRows);

        /* set sizes of face objs */
        forEachFaceItem(faceObjArr,numRows,numCols,
                function(item) {
                    item.style.width = objWidth-padding+'px';
                    item.style.height = objHeight-padding+'px';
                    item.className = type+' face-obj';
                });
        forEachFaceItem(faceObjTextArr,numRows,numCols,
                function(item) {
                    item.style.width = objWidth-padding-innerPadding+'px';
                    item.style.height = objHeight-padding-innerPadding+'px';
                    item.className = 'inner-'+type+' inner-face-obj';
                });
    };
};
Toi.modules.database = function(box) {
    box.docs = {};
};
Toi.modules.process = function(box) {
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
    box.calcCompleteHood = function(docs, atom, firstType, secondType, targetSize) {

        var firstObj = atom[firstType+'s'];
        var firstArr = atom[firstType+'hood'];
        this.calcPartialHood(firstObj,firstArr, targetSize);

        var secondPointer = atom[secondType+'hood'][0];
        if (secondPointer === undefined) {
            return;
        }
        var secondObj = getAtom(docs,secondPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(secondObj, firstArr, targetSize);
        }

        var thirdPointer = atom[secondType+'hood'][1];
        if (thirdPointer === undefined) {
            return;
        }
        var thirdObj = getAtom(docs,thirdPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(thirdObj, firstArr, targetSize);
        }

        var fourthPointer = atom[secondType+'hood'][2];
        if (fourthPointer === undefined) {
            return;
        }
        var fourthObj = getAtom(docs,fourthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            this.calcPartialHood(fourthObj, firstArr, targetSize);
        }
    };
    box.calcNeighborhoods = function(docs) {
        var that = this;

        var LETTERHOODSIZE = 9;
        var WORDHOODSIZE = 6;
        var PARAGRAPHHOODSIZE = 1;

        _.each(docs, function(atom, i, list) {
            //console.log('letter',atom['_id'], atom);    
            that.calcCompleteHood(docs, atom, 'letter', 'letter', LETTERHOODSIZE);
        });
        _.each(docs, function(atom, i, list) {
            //console.log('word',atom['_id'], atom);    
            that.calcCompleteHood(docs, atom, 'word', 'word', WORDHOODSIZE);
        });
        _.each(docs, function(atom, i, list) {
            //console.log('paragraph',atom['_id'], atom);    
            that.calcCompleteHood(docs, atom, 'paragraph', 'word', PARAGRAPHHOODSIZE);
        });

        console.log('initial parse complete',docs);
    };
};
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

    box.parseAlphabet = function(docs, letters) {
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

    };
    box.parseWordset = function(docs, words) {

        for (var i=0;i<words.length;i++) {
            var thisWord = words[i];

            // perform lower level processing
            this.parseAlphabet(docs, thisWord); 

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
    };
    box.parseParagraphset = function(docs, paragraphs) {

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
Toi.modules.event = function(box) {
};
Toi.modules.ajax = function(box) {
    box.makeRequest = function() {};
    box.getResponse = function() {};
};
Toi('*', function(box) {
    console.log(box,box.starter);
    box.createFace();
    box.setFaceType('letter');
    box.parseParagraphset(box.docs,box.starter);
    box.calcNeighborhoods(box.docs);

    var frameMouseClickFunc = function(ev) {
        console.log(ev);
        box.updateFace(ev.position[0].x,ev.position[0].y);
    };
    var frameMouseMoveFunc = function(ev) {
        box.updateFace(ev.x,ev.y);
    };

    var hammer = new Hammer(document.getElementsByClassName('canvas')[0]);
    hammer.ontap = frameMouseClickFunc;

    function setContext(pointer) {
        //setPointer(pointer); 
        box.setFace(pointer,box.docs);
    }

    // initial state
    setContext('toimawb');
});
