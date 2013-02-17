Toi('*', function(box) {
    var faceHammer = new Hammer(document.getElementsByClassName('face')[0]),
    bufferHammer = new Hammer(document.getElementsByClassName('buffer')[0]),
    subtractHammer = new Hammer(document.getElementsByClassName('subtract')[0]),
    addHammer = new Hammer(document.getElementsByClassName('add')[0]),
    letterHammer = new Hammer(document.getElementsByClassName('toggle-obj letter')[0]),
    wordHammer = new Hammer(document.getElementsByClassName('toggle-obj word')[0]),
    paragraphHammer = new Hammer(document.getElementsByClassName('toggle-obj paragraph')[0]);



    console.log(box,box.buffer);
    /*
    // language processing
    box.parseParagraphset(box.docs,box.buffer);
    box.calcNeighborhoods(box.docs);
    */



    faceHammer.ontap = function(ev) {
        console.log(ev,ev.position);
        if (ev && ev.position) {
            // get user command index
            box.returnIndexAtFacePos(ev.position[0].x,ev.position[0].y);

            // set state based on user command index
            box.get
            /*
            box.setPointer('face',
                box.returnTriggeredData('face',
                    box.getType('face'),
                    ev.position[0].x,ev.position[0].y)
                );
            box.setPointer('buffer',
                box.returnTriggeredData('face',
                    box.getType('face'),
                    ev.position[0].x,ev.position[0].y)
                );
                */
            //box.transferPointerToBuffer();
            //box.updateDom(box.docs,box.state);
            //box.updateBuffer(box.buffer,box.state);
        }
    };
    bufferHammer.ontap = function(ev) {
        console.log(ev);
        var triggeredData = 0;
        if (ev.position) {
            triggeredData = box.returnTriggeredData('buffer',
                    box.getType('buffer'),
                    ev.position[0].x,ev.position[0].y); 
            box.setBufferIndex('buffer',triggeredData);
            box.updateBuffer(box.buffer,box.state);
            console.log('box.buffer',box.buffer);
        }
    };


    addHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.addToBuffer();
        }
    };
    subtractHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.subtractFromBuffer();
        }
    };


    letterHammer.ontap = function(ev) {
        //console.log(ev);
        if (ev.position) {
            box.setType('face','letter');
            box.setType('buffer','letter');
            box.setDomType(box.docs,box.state);
            box.setBufferType(box.docs,box.state);
            box.updateBuffer(box.buffer,box.state);
            //console.log('box.buffer',box.buffer);
        }
    };
    wordHammer.ontap = function(ev) {
        console.log(ev);
        if (ev.position) {
            box.setType('face','word');
            box.setType('buffer','word');
            box.setDomType(box.docs,box.state);
            box.setBufferType(box.docs,box.state);
            box.state['buffer']['letterIndex'] = 0;
            box.updateBuffer(box.buffer,box.state);
            //console.log('box.buffer',box.buffer);
        }
    };
    paragraphHammer.ontap = function(ev) {
        console.log(ev);
    };



    // initial state of dom
    // language
    //box.initDom(box.docs,box.buffer,box.state);
    //box.initBuffer(box.docs,box.buffer,box.state);
    // sound
    var initialGaze = [
        10,20,30,
        40,50,60,
        70,80,90
    ];
    box.initGazeState(initialGaze);
    box.initScrollState(initialGaze);

    box.initFace(box.state,box.getGaze());
    box.initBuffer(box.state);
});
