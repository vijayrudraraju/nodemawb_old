Toi.modules.controller = function(box) {
    var modelToView = (function() {
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
    }());
};
