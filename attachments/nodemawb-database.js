Toi.modules.database = function(box) {
    box.docs = {};
    box.buffer = [['toimawb','is','a','typewriter','and','notebook'], ['toimawb', 'is', 'a', 'tool', 'for', 'introspection'], ['toimawb', 'finds', 'patterns', 'in', 'your', 'thoughts'],['']],
    // sound - 1.freq1, 2.freq2, 3.freq3, 4.amp1, 5.amp2, 6.amp3, 7.hitfreq....
    box.scroll = [];
    box.gaze = {};
    box.state = {
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
        box.gaze = initGaze;
        box.state['face']['index'] = 0;
        box.state['face']['pointer'] = box.gaze[0];
    }
    function initScrollState(initGaze) {
        box.scroll = [initGaze];
        box.state['buffer']['letterIndex'] = 0;
        box.state['buffer']['pointer'] = box.gaze;
    }
    function getGaze() {
        return box.gaze;
    }

    function addToBuffer() {

    }
    function subtractFromBuffer() {

    }

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
        var shtr = box.state['buffer'],
            pIdx = shtr['paragraphIndex'],
            wIdx = shtr['wordIndex'];

        switch (shtr['type']) {
            case 'letter':
                box.buffer[pIdx][wIdx] = box.buffer[pIdx][wIdx].replaceAt(shtr['letterIndex'],shtr['pointer']);
                break;
            case 'word':
                box.buffer[pIdx][wIdx] = shtr['pointer'];
                break;
            case 'paragraph':
                box.buffer[pIdx] = shtr['pointer'];
                break;
        }
    }
    function setBufferIndex(name,idxChange) {
        // idxChange is +1, 0, -1
        var shtr = box.state['buffer'],
            pIdx = shtr['paragraphIndex'],
            wIdx = shtr['wordIndex'],
            lIdx = shtr['letterIndex'];

        console.log('box.buffer',box.buffer,pIdx,wIdx,lIdx);

        switch (shtr['type']) {
            case 'letter':
                if (!(lIdx===0 && idxChange===-1) && 
                        !(lIdx+1 > box.buffer[pIdx][wIdx].length  && idxChange===1)) {
                    shtr['letterIndex'] += idxChange;
                }
                break;
            case 'word':
                if (!(wIdx===0 && idxChange===-1) && 
                        !(wIdx+1 > box.buffer[pIdx].length  && idxChange===1)) {
                    shtr['wordIndex'] += idxChange;
                }
                break;
        }

        //console.log('box.buffer',box.buffer);
    }

    box.initGazeState = initGazeState;
    box.initScrollState = initScrollState;
    box.getGaze = getGaze;

    box.setType = setType;
    box.getType = getType;
    box.setPointer = setPointer;
    box.transferPointerToBuffer = transferPointerToBuffer;
    box.setBufferIndex = setBufferIndex;
    box.addToBuffer = addToBuffer;
    box.subtractFromBuffer = subtractFromBuffer;
};
