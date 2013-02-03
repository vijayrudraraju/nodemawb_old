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
    starter:[['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts']],
    version:'0.1',
    getName:function() {
        return this.name;
    }
};
Toi.modules = {};
Toi.modules.dom = function(box) {
    var body = document.getElementsByClassName('body')[0],
        face = document.getElementsByClassName('face')[0],
        miniBuffer = document.getElementsByClassName('mini-buffer')[0],
        toggle = document.getElementsByClassName('toggle')[0],
        dom = {
            face:{
                     name:'face',
                     root:face,
                     width:face.offsetWidth,
                     height:face.offsetHeight,
                     cellWidth:0,
                     cellHeight:0,
                     currentSelection:'',
                     currentType:'letter',
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
                currentSelection:'',
                currentType:'letter',
                types:{letter:{rows:1,cols:8},word:{rows:1,cols:3}},
                rows:1,
                cols:8,
                div:[],
                p:[],
                grid:[]
            }
        };

    function forEachCell(arr,rows,cols,func) {
        //console.log('forEachCell',arr,func);
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

    function setP(el, text, name, type) {
        el.innerHTML = text;
        el.className = ''+name+'-obj inner '+type;
    }
    function getP(index, name) {
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

    function setType(domArrange,type) {
        domArrange['currentType'] = type;
    }
    function setDomArrangement(domArrange, type, pointer, data) {
        if (Object.prototype.toString.call(type) === '[object Array]') {
        }

        var numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'], 
            objWidth = domArrange['width']/numCols,
            objHeight = domArrange['height']/numRows;
        //console.log(objWidth,objHeight,domArrange['cellWidth'],domArrange['cellHeight']);

        clearDomSet(domArrange);
        setType(domArrange,type);

        // set positions
        forEachCell(domArrange['div'],numRows,numCols,
                function(item,row,col,calcIndex,thisArr) {
                    // calc correspondance b/w cells and objs
                    //console.log(calcIndex,objWidth/domArrange['cellWidth'],objHeight/domArrange['cellHeight']);
                    setDiv(item,col*objWidth,row*objHeight,domArrange['name'],type);
                });
        // set text
        forEachCell(domArrange['p'],numRows,numCols,
                function(item,row,col,calcIndex) {
                    setP(item,data[pointer][type+'hood'][calcIndex],domArrange['name'],type);
                });
    }
    function changeType(type,data) {
        setDomArrangement(dom['face'], type, pointer, data);
        setDomArrangement(dom['mini-buffer'], type, pointer, data);
    }
    


    function initDom(data) {
        populateGrid(dom['face']);
        populateGrid(dom['mini-buffer']);

        generateDomSet(dom['face']);
        generateDomSet(dom['mini-buffer']);

        setDomArrangement(dom['face'],'letter','toimawb',data);
        setDomArrangement(dom['mini-buffer'],'letter','toimawb',data);
    }
    function updateDom(name,xIn,yIn,data) {
        //console.log(name,xIn,yIn);
        var type = dom[name]['currentType']; 

        var numRows = dom[name]['types'][type]['rows'], 
            numCols = dom[name]['types'][type]['cols'], 
            objWidth = dom[name]['width']/numCols,
            objHeight = dom[name]['height']/numRows,
            // figure out position from mousePosition
            x = Math.floor((xIn-dom[name]['root'].offsetLeft+body.scrollLeft) / objWidth),
            y = Math.floor((yIn-dom[name]['root'].offsetTop+body.scrollTop) / objHeight);

        console.log(name,x,y);
        console.log(getP(x+(y*numCols),name));
        setDomArrangement(dom[name],type,getP(x+(y*numCols),name),data);
    }

    box.initDom = initDom;
    box.updateDom = updateDom;
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
    console.log(box,box.starter);

    box.parseParagraphset(box.docs,box.starter);
    box.calcNeighborhoods(box.docs);

    var faceHammer = new Hammer(document.getElementsByClassName('face')[0]);
    faceHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.updateDom('face',ev.position[0].x,ev.position[0].y,box.docs);
        }
    };
    var miniBufferHammer = new Hammer(document.getElementsByClassName('mini-buffer')[0]);
    miniBufferHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.updateDom('mini-buffer',ev.position[0].x,ev.position[0].y,box.docs);
        }
    };
    var letterHammer = new Hammer(document.getElementsByClassName('toggle-obj letter')[0]);
    letterHammer.ontap = function(ev) {
        console.log(ev);
    };
    var wordHammer = new Hammer(document.getElementsByClassName('toggle-obj word')[0]);
    wordHammer.ontap = function(ev) {
        console.log(ev);
    };
    var paragraphHammer = new Hammer(document.getElementsByClassName('toggle-obj paragraph')[0]);
    paragraphHammer.ontap = function(ev) {
        console.log(ev);
    };

    // initial state
    box.initDom(box.docs);
});
