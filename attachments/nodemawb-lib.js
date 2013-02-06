/* Layers :
    dom -> indexing ->
*/
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
    version:'0.1',
    getName:function() {
        return this.name;
    }
};
String.prototype.replaceAt = function(index, character) {
    return this.substr(0,index) + character + this.substr(index+character.length);
}
Toi.modules = {};
Toi.modules.dom = function(box) {
    var body = document.getElementsByClassName('body')[0],
        face = document.getElementsByClassName('face')[0],
        buffer = document.getElementsByClassName('buffer')[0],
        miniBuffer = document.getElementsByClassName('mini-buffer')[0],
        toggle = document.getElementsByClassName('toggle')[0],
        dom = {
            'face':{
                name:'face',
                root:face,
                width:face.offsetWidth,
                height:face.offsetHeight,
                cellWidth:0,
                cellHeight:0,
                types:{letter:{rows:3,cols:3},word:{rows:3,cols:2}},
                rows:3,
                cols:6,
                div:[],
                p:[],
                grid:[]
            },
            'mini-buffer':{
                name:'mini-buffer',
                root:miniBuffer,
                width:miniBuffer.offsetWidth,
                height:miniBuffer.offsetHeight,
                cellWidth:0,
                cellHeight:0,
                types:{letter:{rows:1,cols:8},word:{rows:1,cols:3}},
                selectedObjIndex:4,
                rows:1,
                cols:8,
                div:[],
                p:[],
                grid:[]
            }
        };

    function forEachCell(arr,rows,cols,func) {
        //console.log('forEachCell',arr,func);
        // func takes item, row, col, index, array
        for (var i=0;i<rows;i++) {
            for (var j=0;j<cols;j++) {
                func(arr[(i*cols)+j],i,j,(i*cols)+j,arr);
            }
        }
    }

    function generateDomSet(domArrange) {
        domArrange['root'].innerHTML = '';
        for (var i=0;i<domArrange['rows']*domArrange['cols'];i++) {
            domArrange['div'][i] = document.createElement('div');
            domArrange['p'][i] = document.createElement('p');
            domArrange['div'][i].appendChild(domArrange['p'][i]);
            domArrange['root'].appendChild(domArrange['div'][i]);
        }
    }
    function clearDomSet(domArrange) {
        for (var i=0;i<domArrange['div'].length;i++) {
            clearDiv(domArrange['div'][i]);
            clearP(domArrange['p'][i]);
        }
    }

    function selectEl(el) {
        el.className += ' selected';
    }
    function deselectEl(el) {
        var arr = el.className.split(' ');
        for (var i=0;i<arr.length;i++) {
            if (arr[0] !== 'selected') {
                el.className += ' '+arr[0];
            }
        }
    }
    function setDiv(el, x, y, name, type) {
        //console.log('arr',arr);
        el.style.left = x+'px';
        el.style.top = y+'px';
        el.style.display = 'block';
        el.className = name+'-obj outer '+type;
    }
    function clearDiv(el) {
        el.style.left = 0;
        el.style.top = 0;
        el.style.display = 'none';
    }
    function selectP(el) {
        el.className += 'selected';
    }
    function setP(el, name, type) {
        el.className = ''+name+'-obj inner inactive '+type;
    }
    function setPText(el, text) {
        //console.log('debug',el, text);
        el.innerHTML = text;
    }
    function getPText(index, name) {
        return dom[name]['p'][index].innerHTML;
    }
    function clearP(el) {
        el.innerHTML = '';
    }

    function populateGrid(domArrange) {
        domArrange['cellWidth'] = domArrange['width']/domArrange['cols'];
        domArrange['cellHeight'] = domArrange['height']/domArrange['rows'];
        domArrange['cellWidth'] = domArrange['width']/domArrange['cols'];
        domArrange['cellHeight'] = domArrange['height']/domArrange['rows'];

        domArrange['grid'].length = domArrange['rows']*domArrange['cols'];
        forEachCell(domArrange['grid'],domArrange['rows'],domArrange['cols'],function(item,row,col,index,thisArr){
            thisArr[index] = {x:col*domArrange['cellWidth'],y:row*domArrange['cellHeight']};
        });
    }

    function setDomArrangement(domArrange, stateArrange) {
        var type = stateArrange['type'],
            numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'], 
            objWidth = domArrange['width']/numCols,
            objHeight = domArrange['height']/numRows;
        //console.log(objWidth,objHeight,domArrange['cellWidth'],domArrange['cellHeight']);

        clearDomSet(domArrange);

        // set positions
        forEachCell(domArrange['div'],numRows,numCols,
                function(item,row,col,calcIndex,thisArr) {
                    // calc correspondance b/w cells and objs
                    //console.log(calcIndex,objWidth/domArrange['cellWidth'],objHeight/domArrange['cellHeight']);
                    setDiv(item,col*objWidth,row*objHeight,domArrange['name'],type);
                    if (domArrange['selectedObjIndex'] === calcIndex) {
                        selectEl(item);
                    }
                });
        // set text
        forEachCell(domArrange['p'],numRows,numCols,
                function(item,row,col,calcIndex) {
                    setP(item,domArrange['name'],type);
                    if (domArrange['selectedObjIndex'] === calcIndex) {
                        selectEl(item);
                    }
                });
    }
    function setDomData(domArrange, stateArrange, data) {
        //console.log('debug',domArrange);
        var type = stateArrange['type'],
            pointer = stateArrange['pointer'],
            numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'];
        // set text
        forEachCell(domArrange['p'],numRows,numCols,
                function(item,row,col,calcIndex) {
                    setPText(item,data[pointer][type+'hood'][calcIndex]);
                });
    }
    function setBufferData(domArrange,stateArrange,buffer) {
        console.log('setBufferData',domArrange,stateArrange,buffer);
        var type = stateArrange['type'],
            scrollIndex = stateArrange['scrollIndex'],
            bufferIndex = stateArrange['bufferIndex'],
            numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'];
        // set text
        console.log('length',buffer[scrollIndex].length);
        forEachCell(domArrange['p'],numRows,numCols,
                function(item,row,col,idx) {
                    console.log(idx,bufferIndex,buffer[scrollIndex].length);
                    if (idx+bufferIndex-4 >= 0 && idx+bufferIndex-4 < buffer[scrollIndex].length) {
                        setPText(item,buffer[scrollIndex][idx+bufferIndex-4]);
                    } else {
                        setPText(item,'');
                    }
                });
    }
    


    function initDom(data,buffer,state) {
        populateGrid(dom['face']);
        populateGrid(dom['mini-buffer']);

        generateDomSet(dom['face']);
        generateDomSet(dom['mini-buffer']);

        setDomArrangement(dom['face'],state['face']);
        setDomArrangement(dom['mini-buffer'],state['mini-buffer']);

        setDomData(dom['face'],state['face'],data);
    }
    function setDomType(data,state) {
        setDomArrangement(dom['face'],state['face']);
        setDomData(dom['face'],state['face'],data);
    }
    function setBufferType(data,state) {
        setDomArrangement(dom['mini-buffer'],state['mini-buffer']);
    }
    function returnTriggeredData(name,type,xIn,yIn) {
        var numRows = dom[name]['types'][type]['rows'], 
            numCols = dom[name]['types'][type]['cols'], 
            objWidth = dom[name]['width']/numCols,
            objHeight = dom[name]['height']/numRows,
            // figure out position from mousePosition
            x = Math.floor((xIn-dom[name]['root'].offsetLeft+body.scrollLeft) / objWidth),
            y = Math.floor((yIn-dom[name]['root'].offsetTop+body.scrollTop) / objHeight);

        //console.log(name,x,y);

        if (name === 'face') {
            //console.log(getPText(x+(y*numCols),name));
            return getPText(x+(y*numCols),name);
        } else if (name === 'mini-buffer') {
            if (x < 4) {
                return -1;
            } else if (x > 4) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    function updateDom(data,state) {
        setDomData(dom['face'],state['face'],data);
    }
    function updateBuffer(buffer,state) {
        setBufferData(dom['mini-buffer'],state['mini-buffer'],buffer);
        //setPText(dom['mini-buffer']['p'][dom['mini-buffer']['selectedObjIndex']],state['mini-buffer']['pointer']);            
        console.log('updateBuffer',state);
    }
    box.initDom = initDom;
    box.updateDom = updateDom;
    box.updateBuffer = updateBuffer;
    box.returnTriggeredData = returnTriggeredData;
    box.setDomType = setDomType;
    box.setBufferType = setBufferType;
};
Toi.modules.database = function(box) {
    box.docs = {};
    box.buffer = [['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts']],
    box.scroll = [];
    box.state = {
        'face':{
            index:0,
            pointer:'toimawb',
            type:'letter'
        },
        'mini-buffer':{
            letterIndex:0,
            wordIndex:0,
            paragraphIndex:0,
            bufferIndex:0,
            scrollIndex:0,
            pointer:'toimawb',
            type:'letter'
        },
        'toggle':{
            index:0
        }
    };

    function setType(name,newType) {
        box.state[name]['type'] = newType;
    }
    function getType(name) {
        return box.state[name]['type'];
    }
    function setPointer(name,newPtr) {
        box.state[name]['pointer'] = newPtr;
    }
    function transferPointerToBuffer() {
        var shtr = box.state['mini-buffer'],
            word = box.buffer[shtr['scrollIndex']];
        box.buffer[shtr['scrollIndex']] = word.replaceAt(shtr['bufferIndex'],shtr['pointer']);
    }
    function getBufferIndex(name) {
        return box.state[name]['bufferIndex'];
    }
    function setBufferIndex(name,newIdx) {
        // newIdx is +1, 0, -1
        var shtr = box.state['mini-buffer'],
            word = box.buffer[shtr['scrollIndex']];

        console.log('box.buffer',box.buffer,shtr['scrollIndex'],shtr['bufferIndex'],word,box.state['face']['pointer']);

        if (!(shtr['bufferIndex']===0 && newIdx===-1) && 
                !(shtr['bufferIndex']+1 > word.length  && newIdx===1)) {
            shtr['bufferIndex'] += newIdx;
        }

        console.log('box.buffer',box.buffer);
    }

    box.setType = setType;
    box.getType = getType;
    box.setPointer = setPointer;
    box.transferPointerToBuffer = transferPointerToBuffer;
    box.getBufferIndex = getBufferIndex;
    box.setBufferIndex = setBufferIndex;
};
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
        //console.log('calcHood end', obj, array, array.length);
    }
    function calcCompleteHood(docs, atom, firstType, secondType, targetSize) {

        var firstObj = atom[firstType+'s'];
        var firstArr = atom[firstType+'hood'];
        calcPartialHood(firstObj,firstArr, targetSize);

        var secondPointer = atom[secondType+'hood'][0];
        if (secondPointer === undefined) {
            return;
        }
        var secondObj = getAtom(docs,secondPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(secondObj, firstArr, targetSize);
        }

        var thirdPointer = atom[secondType+'hood'][1];
        if (thirdPointer === undefined) {
            return;
        }
        var thirdObj = getAtom(docs,thirdPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(thirdObj, firstArr, targetSize);
        }

        var fourthPointer = atom[secondType+'hood'][2];
        if (fourthPointer === undefined) {
            return;
        }
        var fourthObj = getAtom(docs,fourthPointer)[firstType+'s'];
        if (firstArr.length < targetSize) {
            calcPartialHood(fourthObj, firstArr, targetSize);
        }
    }
    box.calcNeighborhoods = function(docs) {
        var that = this;

        var LETTERHOODSIZE = 9;
        var WORDHOODSIZE = 6;
        var PARAGRAPHHOODSIZE = 1;

        _.each(docs, function(atom, i, list) {
            //console.log('letter',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'letter', 'letter', LETTERHOODSIZE);
        });
        _.each(docs, function(atom, i, list) {
            //console.log('word',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'word', 'word', WORDHOODSIZE);
        });
        _.each(docs, function(atom, i, list) {
            //console.log('paragraph',atom['_id'], atom);    
            calcCompleteHood(docs, atom, 'paragraph', 'word', PARAGRAPHHOODSIZE);
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
Toi.modules.event = function(box) {
};
Toi.modules.ajax = function(box) {
    //box.makeRequest = function() {};
    //box.getResponse = function() {};
};
Toi('*', function(box) {
    var faceHammer = new Hammer(document.getElementsByClassName('face')[0]),
    miniBufferHammer = new Hammer(document.getElementsByClassName('mini-buffer')[0]),
    letterHammer = new Hammer(document.getElementsByClassName('toggle-obj letter')[0]),
    wordHammer = new Hammer(document.getElementsByClassName('toggle-obj word')[0]),
    paragraphHammer = new Hammer(document.getElementsByClassName('toggle-obj paragraph')[0]);



    console.log(box,box.buffer);
    box.parseParagraphset(box.docs,box.buffer);
    box.calcNeighborhoods(box.docs);



    faceHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.setPointer('face',
                box.returnTriggeredData('face',
                    box.getType('face'),
                    ev.position[0].x,ev.position[0].y)
                );
            box.setPointer('mini-buffer',
                box.returnTriggeredData('face',
                    box.getType('face'),
                    ev.position[0].x,ev.position[0].y)
                );
            box.transferPointerToBuffer();
            box.updateDom(box.docs,box.state);
            box.updateBuffer(box.buffer,box.state);
        }
    };

    miniBufferHammer.ontap = function(ev) {
        console.log(ev);
        var triggeredData = 0;
        if (ev.position) {
            triggeredData = box.returnTriggeredData('mini-buffer',
                    box.getType('mini-buffer'),
                    ev.position[0].x,ev.position[0].y); 
            box.setBufferIndex('mini-buffer',triggeredData);
            box.updateBuffer(box.buffer,box.state);
        }
    };



    letterHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.setType('face','letter');
            box.setType('mini-buffer','letter');
            box.setDomType(box.docs,box.state);
            box.setBufferType(box.docs,box.state);
        }
    };
    wordHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.setType('face','word');
            box.setType('mini-buffer','word');
            box.setDomType(box.docs,box.state);
            box.setBufferType(box.docs,box.state);
        }
    };
    paragraphHammer.ontap = function(ev) {
        console.log(ev);
    };



    // initial state
    box.initDom(box.docs,box.buffer,box.state);
});
