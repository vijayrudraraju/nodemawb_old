Toi.modules.database = function(box) {
    //box.docs = {};
    //box.buffer = [['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts'],['']],
    // sound - 1.freq1, 2.freq2, 3.freq3, 4.amp1, 5.amp2, 6.amp3, 7.hitfreq....
    var scroll = [],
        gaze = [],
        state = {
            'face':{
                index:0,
                pointer:'toimawb',
                type:'letter'
            },
            'buffer':{
                letterIndex:0,
                wordIndex:0,
                paragraphIndex:3,
                pointer:'toimawb',
                type:'letter'
            },
            'control':{
                sliderVal:0
            },
            'toggle':{
                index:0
            }
        };

    function initGazeState(initGaze) {
        gaze = initGaze;
        state['face']['index'] = 0;
        state['face']['pointer'] = gaze[0];
    }
    function initScrollState(initGaze) {
        var i;
        scroll = [];
        for (i=0;i<8;i++) {
            scroll[i] = initGaze.slice(0);
        }
        state['buffer']['letterIndex'] = 0;
        state['buffer']['pointer'] = gaze;
    }


    function getState() {
        return state;
    }


    function getGaze() {
        return gaze;
    }
    function setGazeToScrollIdx(idx) {
        gaze = scroll[idx].slice(0);       
    }
    function getDataAtGazeIdx(idx) {
        if (idx !== undefined) {
            return gaze[idx];
        } else {
            return state['face']['index'];
        }
    }
    function setDataAtGazeIdx(data) {
        gaze[state['face']['index']] = parseInt(data);
    }


    function getScroll() {
        return scroll;
    }
    function getDataAtScrollIdx(idx) {
        if (idx !== undefined) {
            return scroll[idx];
        } else {
            return state['buffer']['index'];
        }
    }
    function setDataAtScrollIdx() {
        scroll[state['buffer']['index']] = gaze.slice(0);
    }


    function addToBuffer() {
        if (gaze[9] < 100) {
            gaze[9] += 10;
        }
        setDataAtScrollIdx();
        return gaze[9];
    }
    function subtractFromBuffer() {
        if (gaze[9] > 10) {
            gaze[9] -= 10;
        }
        setDataAtScrollIdx();
        return gaze[9];
    }
    function getTempo() {
        return gaze[9];
    }



    function setType(name,newType) {
        state[name]['type'] = newType;
    }
    function getType(name) {
        return state[name]['type'];
    }
    function setIndex(name,newIdx) {
        return state[name]['index'] = newIdx; 
    }
    function setPointer(name,newPtr) {
        state[name]['pointer'] = newPtr;
    }
    function transferPointerToBuffer() {
        var shtr = state['buffer'],
            pIdx = shtr['paragraphIndex'],
            wIdx = shtr['wordIndex'];

        switch (shtr['type']) {
            case 'letter':
                buffer[pIdx][wIdx] = buffer[pIdx][wIdx].replaceAt(shtr['letterIndex'],shtr['pointer']);
                break;
            case 'word':
                buffer[pIdx][wIdx] = shtr['pointer'];
                break;
            case 'paragraph':
                buffer[pIdx] = shtr['pointer'];
                break;
        }
    }
    function setBufferIndex(name,idxChange) {
        // idxChange is +1, 0, -1
        var shtr = state['buffer'],
            pIdx = shtr['paragraphIndex'],
            wIdx = shtr['wordIndex'],
            lIdx = shtr['letterIndex'];

        console.log('setBufferIndex',buffer,pIdx,wIdx,lIdx);

        switch (shtr['type']) {
            case 'letter':
                if (!(lIdx===0 && idxChange===-1) && 
                        !(lIdx+1 > buffer[pIdx][wIdx].length  && idxChange===1)) {
                    shtr['letterIndex'] += idxChange;
                }
                break;
            case 'word':
                if (!(wIdx===0 && idxChange===-1) && 
                        !(wIdx+1 > buffer[pIdx].length  && idxChange===1)) {
                    shtr['wordIndex'] += idxChange;
                }
                break;
        }

        //console.log('box.buffer',box.buffer);
    }

    box.initGazeState = initGazeState;
    box.initScrollState = initScrollState;

    box.setIndex = setIndex;
    box.getState = getState;

    box.getGaze = getGaze;
    box.setGazeToScrollIdx = setGazeToScrollIdx;
    box.getDataAtGazeIdx = getDataAtGazeIdx;
    box.setDataAtGazeIdx = setDataAtGazeIdx;

    box.getScroll = getScroll;
    box.getDataAtScrollIdx = getDataAtScrollIdx;
    box.setDataAtScrollIdx = setDataAtScrollIdx;

    box.getTempo = getTempo;

    box.setType = setType;
    box.getType = getType;
    box.setPointer = setPointer;
    box.transferPointerToBuffer = transferPointerToBuffer;
    box.setBufferIndex = setBufferIndex;
    box.addToBuffer = addToBuffer;
    box.subtractFromBuffer = subtractFromBuffer;
};
