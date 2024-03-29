Toi.modules.sound = function(box) {
    var context = {},
        oscillators = [{}],
        gains = [{}],
        mixes = [{}],
        state = [],
        intervalIds = [0,0,0];

    function initialize() {
        var i;
        context = new webkitAudioContext();
        for (i=0;i<3;i++) {
            oscillators[i] = context.createOscillator();
            gains[i] = context.createGain();
            mixes[i] = context.createGain();
        }
    }

    function startSound() {
        var i;
        for (i=0;i<3;i++) {
            oscillators[i].connect(gains[i]);
            //oscillators[i].type = 1;
            gains[i].gain.value = 0.1;
            gains[i].connect(mixes[i]);
            mixes[i].gain.value = 0.3;
            mixes[i].connect(context.destination);
            oscillators[i].noteOn(0);
        }
        //console.log(oscillators,gains);
    }
    function stopSound() {
        var i;
        for (i=0;i<3;i++) {
            oscillators[i].disconnect(context.destination);
        } 
    }

    function hit(i) {
        var hitIdx = 0;
        return function() {
            var now = context.currentTime;
            //console.log('hit',i,state[i+3],gains[i]);
            oscillators[0].frequency.value = 10+(1650*(state[hitIdx]-1)/(100-1));
            oscillators[1].frequency.value = 110+(1650*(state[hitIdx]-1)/(100-1));
            oscillators[2].frequency.value = 510+(1650*(state[hitIdx]-1)/(100-1));

            gains[0].gain.linearRampToValueAtTime((state[hitIdx+3]-1)/(100-1),now+0.2);
            gains[0].gain.linearRampToValueAtTime(0.0, now+0.2+(state[hitIdx+6]*0.2/100));

            gains[1].gain.linearRampToValueAtTime((state[hitIdx+3]-1)/(100-1),now+0.2);
            gains[1].gain.linearRampToValueAtTime(0.0, now+0.2+(state[hitIdx+6]*0.2/100));

            gains[2].gain.linearRampToValueAtTime((state[hitIdx+3]-1)/(100-1),now+0.2);
            gains[2].gain.linearRampToValueAtTime(0.0, now+0.2+(state[hitIdx+6]*0.2/100));
            hitIdx++;
            hitIdx = hitIdx % 3;
        };
    }

    function setSynthState(newState) {
        console.log('setSynthState',newState);
        var i;
        state = newState;
        for (i=0;i<3;i++) {
            //console.log(state[i+3],(state[i+3]-1)/(100-1));
            clearInterval(intervalIds[i]);
            //oscillators[i].frequency.value = 110+(1650*(state[i]-1)/(100-1));
            intervalIds[i] = setInterval(hit(i),1000*state[9]/100);
        }
        //console.log(intervalIds);
    }

    box.startSound = startSound;
    box.stopSound = stopSound;
    box.setSynthState = setSynthState;

    initialize();
};
