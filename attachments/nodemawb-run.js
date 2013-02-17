Toi('*', function(box) {
    //subtractHammer = new Hammer(document.getElementsByClassName('subtract')[0]),
    //letterHammer = new Hammer(document.getElementsByClassName('toggle-obj letter')[0]),
    //wordHammer = new Hammer(document.getElementsByClassName('toggle-obj word')[0]),
    //paragraphHammer = new Hammer(document.getElementsByClassName('toggle-obj paragraph')[0]);

    var faceHammer = new Hammer(document.getElementsByClassName('face')[0]),
    bufferHammer = new Hammer(document.getElementsByClassName('buffer')[0]),
    controlSlider = document.getElementsByClassName('control')[0].getElementsByTagName('input')[0],
    addHammer = new Hammer(document.getElementsByClassName('add')[0]),
    subtractHammer = new Hammer(document.getElementsByClassName('subtract')[0]);

    console.log(box);
    /*
    // language processing
    box.parseParagraphset(box.docs,box.buffer);
    box.calcNeighborhoods(box.docs);
    */

    controlSlider.onchange = function(ev) {
        console.log(this.value);
        box.setDataAtGazeIdx(this.value);
        box.setDataAtScrollIdx();
        box.setFaceState(box.getGaze(),box.getState()['face']);
        box.setSynthState(box.getGaze());
    };

    faceHammer.ontap = function(ev) {
        console.log(ev,ev.position);
        if (ev && ev.position) {
            // get user command index
            var commandIdx = box.returnIndexAtFacePos(ev.position[0].x,ev.position[0].y);

            // get state based on user command index
            var gazeData = box.getDataAtGazeIdx(commandIdx);
            var colorData = box.getDomState('face')['color'][commandIdx];
            box.setIndex('face',commandIdx);
            box.setControlState(gazeData,colorData);
            box.setFaceState(gazeData,box.getState()['face']);

            // set controlState based on gazeData
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
        if (ev && ev.position) {
            /*
            triggeredData = box.returnTriggeredData('buffer',
                    box.getType('buffer'),
                    ev.position[0].x,ev.position[0].y); 
            box.setBufferIndex('buffer',triggeredData);
            box.updateBuffer(box.buffer,box.state);
            console.log('box.buffer',box.buffer);
            */
            // get user command index
            var cmdIdx = box.returnIndexAtBufferPos(ev.position[0].x,ev.position[0].y);
            // get state based on user command index
            var scrollData = box.getDataAtScrollIdx(cmdIdx);
            box.setGazeToScrollIdx(cmdIdx);
            // set buffer state
            box.setIndex('buffer',cmdIdx);
            box.setIndex('face',0);
            box.setFaceState(scrollData,box.getState()['face']);
            box.setBufferState(scrollData,box.getState()['buffer']);

            var tempo = box.getTempo()*255/100;
            document.getElementsByClassName('add')[0].style.backgroundColor = 'rgb('+tempo+','+tempo+','+tempo+')';
            document.getElementsByClassName('subtract')[0].style.backgroundColor = 'rgb('+tempo+','+tempo+','+tempo+')';

            box.setSynthState(box.getGaze());

            console.log(cmdIdx,scrollData);
        }
    };


    addHammer.ontap = function(ev) {
        //console.log(ev);
        if (ev) {
            var newAmp = parseInt(box.addToBuffer()*255/100);
            document.getElementsByClassName('add')[0].style.backgroundColor = 'rgb('+newAmp+','+newAmp+','+newAmp+')';
            document.getElementsByClassName('subtract')[0].style.backgroundColor = 'rgb('+newAmp+','+newAmp+','+newAmp+')';
            box.setSynthState(box.getGaze());
        }
    };
    subtractHammer.ontap = function(ev) {
        //console.log(ev);
        if (ev) {
            var newAmp = parseInt(box.subtractFromBuffer()*255/100);
            document.getElementsByClassName('add')[0].style.backgroundColor = 'rgb('+newAmp+','+newAmp+','+newAmp+')';
            document.getElementsByClassName('subtract')[0].style.backgroundColor = 'rgb('+newAmp+','+newAmp+','+newAmp+')';
            box.setSynthState(box.getGaze());
        }
    };


    /*letterHammer.ontap = function(ev) {
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
    };*/



    // initial state of dom
    // language
    //box.initDom(box.docs,box.buffer,box.state);
    //box.initBuffer(box.docs,box.buffer,box.state);
    // sound
    var initialGaze = [
        5,20,30,
        50,20,70,
        70,20,80,
        20
    ];
    box.initGazeState(initialGaze);
    box.initScrollState(initialGaze);
    //console.log('scroll',box.getScroll());

    //console.log('state',box.getState());
    box.initFace(box.getState(),box.getGaze());
    box.initBuffer(box.getState());
    box.initControl(box.getGaze());

    box.setGazeToScrollIdx(0);
    box.setIndex('buffer',0);
    box.setBufferState(box.getDataAtScrollIdx(0),box.getState()['buffer']);

    addHammer.ontap({});
    subtractHammer.ontap({});

    box.startSound();
    box.setSynthState(box.getGaze());
});
