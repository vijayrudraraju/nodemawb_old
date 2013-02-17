Toi.modules.view = function(box) {
    var config = (function(document) {
        var body = document.getElementsByClassName('body')[0],
            face = document.getElementsByClassName('face')[0],
            buffer = document.getElementsByClassName('buffer')[0],
            pivot = document.getElementsByClassName('pivot')[0],
            flipper = document.getElementsByClassName('flipper')[0];

        var returnObj = {
            'face':{
                name:'face',
                root:face,
                width:face.offsetWidth,
                height:face.offsetHeight,
                cellWidth:0,
                cellHeight:0,
                types:{
                    letter:{
                               rows:3,
                               cols:3
                           },
                    word:{
                             rows:3,
                             cols:2
                         }
                },
                rows:3,
                cols:6,
                div:[],
                p:[],
                grid:[]
            },
            'buffer':{
                name:'buffer',
                root:buffer,
                width:buffer.offsetWidth,
                height:buffer.offsetHeight,
                cellWidth:0,
                cellHeight:0,
                types:{
                    letter:{
                               rows:1,
                               cols:8
                           },
                    word:{
                             rows:1,
                             cols:3
                         }
                },
                selectedObjIndex:4,
                rows:1,
                cols:8,
                div:[],
                p:[],
                grid:[]
            }
        };
        return returnObj;
    }(document));

    var utils = (function() {
        function forEachCell(arr,rows,cols,func) {
            //console.log('forEachCell',arr,func);
            // func takes item, row, col, index, array
            for (var i=0;i<rows;i++) {
                for (var j=0;j<cols;j++) {
                    func(arr[(i*cols)+j],i,j,(i*cols)+j,arr);
                }
            }
        }

        var returnObj = {
            forEachCell:forEachCell
        };
        return returnObj;
    }());

    var widget = (function() {
        function generateWidgetDom(domArrange) {
            domArrange['root'].innerHTML = '';
            for (var i=0;i<domArrange['rows']*domArrange['cols'];i++) {
                domArrange['div'][i] = document.createElement('div');
                domArrange['p'][i] = document.createElement('p');
                domArrange['div'][i].appendChild(domArrange['p'][i]);
                domArrange['root'].appendChild(domArrange['div'][i]);
            }
        }
        function clearWidgetDom(domArrange) {
            for (var i=0;i<domArrange['div'].length;i++) {
                clearDiv(domArrange['div'][i]);
                clearP(domArrange['p'][i]);
            }
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

        var returnObj = {
            generateWidgetDom:generateWidgetDom,
            clearWidgetDom:clearWidgetDom
        };
        return returnObj;
    }());

    var obj = (function() {
        function selectEl(el) {
            el.className += ' selected';
        }
        function deselectEl(el) {
            var arr = el.className.split(' ');
            for (var i=0;i<arr.length;i++) {
                if (arr[i] !== 'selected') {
                    el.className += ' '+arr[i];
                }
            }
        }
        function setDiv(el, x, y, name, type) {
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
            el.innerHTML = text;
        }
        function getPText(index, name) {
            return dom[name]['p'][index].innerHTML;
        }
        function clearP(el) {
            el.innerHTML = '';
        }
    }());

    var grid = (function() {
        function populateGrid(domArrange) {
            domArrange['cellWidth'] = domArrange['width']/domArrange['cols'];
            domArrange['cellHeight'] = domArrange['height']/domArrange['rows'];
            domArrange['cellWidth'] = domArrange['width']/domArrange['cols'];
            domArrange['cellHeight'] = domArrange['height']/domArrange['rows'];

            domArrange['grid'].length = domArrange['rows']*domArrange['cols'];
            forEachCell(domArrange['grid'],domArrange['rows'],domArrange['cols'],
                function(item,row,col,index,thisArr){
                    thisArr[index] = {x:col*domArrange['cellWidth'],y:row*domArrange['cellHeight']};
                });
        }
    }());

    var face = (function() {
        function initDom(data,buffer,state) {
            populateGrid(dom['face']);
            generateDomSet(dom['face']);
            setDomArrangement(dom['face'],state['face']);
            setDomData(dom['face'],state['face'],data);
        }
    }());

    var buffer = (function() {
        function initBuffer(data,buffer,state) {
            populateGrid(dom['buffer']);
            generateDomSet(dom['buffer']);
            setDomArrangement(dom['buffer'],state['buffer']);
            setBufferToBuffer(dom['buffer'],state['buffer'],buffer);
        }
    }());
};
