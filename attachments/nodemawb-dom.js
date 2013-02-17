Toi.modules.dom = function(box) {
    var body = document.getElementsByClassName('body')[0],
        face = document.getElementsByClassName('face')[0],
        buffer = document.getElementsByClassName('buffer')[0],
        toggle = document.getElementsByClassName('toggle')[0],
        control = document.getElementsByClassName('control')[0],
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
                color:['blue','blue','blue','orange','orange','orange','green','green','green'],
                grid:[]
            },
            'buffer':{
                name:'buffer',
                root:buffer,
                width:buffer.offsetWidth,
                height:buffer.offsetHeight,
                cellWidth:0,
                cellHeight:0,
                types:{letter:{rows:1,cols:8},word:{rows:1,cols:3}},
                selectedObjIndex:4,
                rows:1,
                cols:8,
                div:[],
                p:[],
                color:['white','white','white','white','white','white','white','white','white'],
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
        //console.log('deselectEl', el.className);
        var arr = el.className.split(' ');
        el.className = '';
        for (var i=0;i<arr.length;i++) {
            if (arr[i] !== 'selected') {
                el.className += ' '+arr[i];
            }
        }
        //console.log('deselectEl', el.className);
    }
    //function setDiv(el, x, y, name, type, color) {
    function setDivArrange(el, attrObj) {
        el.style.left = attrObj['x']+'px';
        el.style.top = attrObj['y']+'px';
        el.style.display = 'block';
        el.className = attrObj['name']+'-obj outer '+attrObj['type'];
    }
    function setDivState(el, attrObj) {
        var lastCssSheet = document.styleSheets[0];
        //console.log(lastCssSheet,attrObj['speed'],attrObj['color']);
        if (attrObj['color']) {
            lastCssSheet.insertRule('@-webkit-keyframes '+attrObj['color']+'Frames{ from {background-color:black} to {background-color:'+attrObj['color']+'} }', lastCssSheet.cssRules.length);
            el.style.backgroundColor = attrObj['color'];
            el.style.webkitAnimationName = attrObj['color']+'Frames';
            el.style.webkitAnimationIterationCount = 'infinite';
            el.style.webkitAnimationTimingFunction = 'linear';
            el.style.webkitAnimationDuration = 20/attrObj['speed']+'s';
            el.style.webkitAnimationDirection = 'alternate';
        }
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
            objHeight = domArrange['height']/numRows,
            attrObj = {x:0,y:0,name:'face',type:'letter',color:'lightGreen'};
        //console.log(objWidth,objHeight,domArrange['cellWidth'],domArrange['cellHeight']);

        clearDomSet(domArrange);

        // set positions
        forEachCell(domArrange['div'],numRows,numCols,
                function(item,row,col,calcIndex,thisArr) {
                    // calc correspondance b/w cells and objs
                    attrObj = {
                        x:col*objWidth,
                        y:row*objHeight,
                        name:domArrange['name'],
                        type:type,
                        color:domArrange['color'][calcIndex] 
                    };
                    setDivArrange(item,attrObj);
                });
        // set text
        /*
        forEachCell(domArrange['p'],numRows,numCols,
                function(item,row,col,calcIndex) {
                    setP(item,domArrange['name'],type);
                    if (domArrange['selectedObjIndex'] === calcIndex) {
                        selectEl(item);
                    }
                });
                */
    }
    function getDomState(name) {
        return dom[name];
    }
    function setFaceState(state,vizState) {
        setDomState(dom['face'],state,vizState);
    }
    function setBufferState(state,vizState) {
        var type = 'letter',
            numRows = dom['buffer']['types'][type]['rows'], 
            numCols = dom['buffer']['types'][type]['cols'], 
            objWidth = dom['buffer']['width']/numCols,
            objHeight = dom['buffer']['height']/numRows,
            attrObj = {};
        forEachCell(dom['buffer']['div'],numRows,numCols,
                function(item,row,col,calcIndex,thisArr) {
                    // calc correspondance b/w cells and objs
                    if (vizState['index'] === calcIndex) {
                        selectEl(item);
                    } else {
                        deselectEl(item);
                    }
                });
    }
    function setDomState(domArrange,state,vizState) {
        //console.log('setDomState',domArrange,state,vizState);
        var type = 'letter',
            numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'], 
            objWidth = domArrange['width']/numCols,
            objHeight = domArrange['height']/numRows,
            attrObj = {};

        forEachCell(domArrange['div'],numRows,numCols,
                function(item,row,col,calcIndex,thisArr) {
                    // calc correspondance b/w cells and objs
                    attrObj = {
                        color:domArrange['color'][calcIndex],
                        speed:state[calcIndex],
                    };
                    setDivState(item,attrObj);
                    if (vizState['index'] === calcIndex) {
                        selectEl(item);
                    } else {
                        deselectEl(item);
                    }
                });
    }
    function setControlState(state,color) {
        var el = document.getElementsByClassName('control')[0].getElementsByTagName('input')[0];
        el.value = state;
        document.getElementsByClassName('control')[0].style.backgroundColor = color;
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
    function setBufferToBuffer(domArrange,stateArrange,buffer) {
        //console.log('setBufferToBuffer',domArrange,stateArrange,buffer);
        var type = stateArrange['type'],
            pIdx = stateArrange['paragraphIndex'],
            wIdx = stateArrange['wordIndex'],
            lIdx = stateArrange['letterIndex'],
            numRows = domArrange['types'][type]['rows'], 
            numCols = domArrange['types'][type]['cols'];

        // set text
        switch (type) {
            case 'letter':
                var bufferOffset = 4;
                forEachCell(domArrange['p'],numRows,numCols,
                        function(item,row,col,idx) {
                            console.log(idx,lIdx,buffer[pIdx][wIdx].length);
                            if (idx+lIdx-bufferOffset >=0 && idx+lIdx-bufferOffset <buffer[pIdx][wIdx].length) {
                                setPText(item,buffer[pIdx][wIdx][idx+lIdx-bufferOffset]);
                            } else {
                                setPText(item,'');
                            }
                        });
                break;
            case 'word':
                var bufferOffset = 1;
                forEachCell(domArrange['p'],numRows,numCols,
                        function(item,row,col,idx) {
                            console.log(idx,lIdx,buffer[pIdx].length);
                            if (idx+wIdx-bufferOffset >=0 && idx+wIdx-bufferOffset <buffer[pIdx].length) {
                                setPText(item,buffer[pIdx][idx+wIdx-bufferOffset]);
                            } else {
                                setPText(item,'');
                            }
                        });
                break;
        }
    }
    


    function initDom(data,buffer,state) {
        populateGrid(dom['face']);
        generateDomSet(dom['face']);
        setDomArrangement(dom['face'],state['face']);
        setDomData(dom['face'],state['face'],data);
    }
    function initFace(state,gazeState) {
        populateGrid(dom['face']);
        generateDomSet(dom['face']);
        setDomArrangement(dom['face'],state['face']);
        setDomState(dom['face'],gazeState,state['face']);
    }
    //function initBuffer(data,buffer,state) {
    function initBuffer(state,scrollState) {
        populateGrid(dom['buffer']);
        generateDomSet(dom['buffer']);
        setDomArrangement(dom['buffer'],state['buffer']);
        //setBufferToBuffer(dom['buffer'],state['buffer'],buffer);
    }
    function initControl(gazeState) {
        var color = getDomState('face')['color'][0];
        setControlState(gazeState,color);
    }


    function setDomType(data,state) {
        setDomArrangement(dom['face'],state['face']);
        setDomData(dom['face'],state['face'],data);
    }
    function setBufferType(data,state) {
        setDomArrangement(dom['buffer'],state['buffer']);
    }
    function returnIndexAtFacePos(xIn,yIn) {
        var name = 'face',
            type = 'letter',
            numRows = dom[name]['types'][type]['rows'], 
            numCols = dom[name]['types'][type]['cols'], 
            objWidth = dom[name]['width']/numCols,
            objHeight = dom[name]['height']/numRows,
            // figure out index from mousePosition
            x = Math.floor((xIn-dom[name]['root'].offsetLeft+body.scrollLeft) / objWidth),
            y = Math.floor((yIn-dom[name]['root'].offsetTop+body.scrollTop) / objHeight);

        return x+(y*numCols);
    }
    function returnIndexAtBufferPos(xIn,yIn) {
        var name = 'buffer',
            type = 'letter',
            numRows = dom[name]['types'][type]['rows'], 
            numCols = dom[name]['types'][type]['cols'], 
            objWidth = dom[name]['width']/numCols,
            objHeight = dom[name]['height']/numRows,
            // figure out index from mousePosition
            x = Math.floor((xIn-dom[name]['root'].offsetLeft+body.scrollLeft) / objWidth),
            y = Math.floor((yIn-dom[name]['root'].offsetTop+body.scrollTop) / objHeight);

        return x+(y*numCols);
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
        } else if (name === 'buffer') {
            switch (type) {
                case 'letter':
                    if (x < 4) {
                        return -1;
                    } else if (x > 4) {
                        return 1;
                    } else {
                        return 0;
                    }
                    break;
                case 'word':
                    if (x < 1) {
                        return -1;
                    } else if (x > 1) {
                        return 1;
                    } else {
                        return 0;
                    }
                    break;
            }
        }
    }
    function updateDom(data,state) {
        setDomData(dom['face'],state['face'],data);
    }
    function updateBuffer(buffer,state) {
        setBufferToBuffer(dom['buffer'],state['buffer'],buffer);
        //console.log('updateBuffer',state);
    }

    box.initFace = initFace;
    box.initBuffer = initBuffer;
    box.initControl = initControl;

    box.returnIndexAtFacePos = returnIndexAtFacePos;
    box.returnIndexAtBufferPos = returnIndexAtBufferPos;
    box.setControlState = setControlState;

    box.setDomState = setDomState;
    box.getDomState = getDomState;
    box.setFaceState = setFaceState;
    box.setBufferState = setBufferState;

    //box.updateDom = updateDom;
    //box.updateBuffer = updateBuffer;
    //box.returnTriggeredData = returnTriggeredData;
    //box.setDomType = setDomType;
    //box.setBufferType = setBufferType;
};
