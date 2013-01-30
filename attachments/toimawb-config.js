// building the visual data structures

// the different frame types are constructed from these arrays
TOI.CONFIG.frameTypes['mixed'][0] = ['marker0','word0','word0','letter0','','block0','letter1','block0','block0'];
TOI.CONFIG.frameTypes['mixed'][1] = ['letter0','marker0','letter1','block0','block0','letter2','block0','block0','letter3'];
TOI.CONFIG.frameTypes['mixed'][2] = ['word0','word0','marker0','block0','block0','letter0','block0','block0','letter1'];
TOI.CONFIG.frameTypes['mixed'][3] = ['letter0','word0','word0','marker0','word1','word1','letter1','word2','word2'];
TOI.CONFIG.frameTypes['mixed'][4] = ['letter0','letter1','letter2','letter3','marker0','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['mixed'][5] = ['word0','word0','letter0','word1','word1','marker0','word2','word2','letter1'];
TOI.CONFIG.frameTypes['mixed'][6] = ['letter0','block0','block0','letter1','block0','block0','marker0','word0','word0'];
TOI.CONFIG.frameTypes['mixed'][7] = ['letter0','block0','block0','letter1','block0','block0','letter2','marker0','letter3'];
TOI.CONFIG.frameTypes['mixed'][8] = ['block0','block0','letter0','block0','block0','letter1','word0','word0','marker0'];

TOI.CONFIG.frameTypes['letter'][0] = ['marker0','letter0','letter1','letter2','letter3','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][1] = ['letter0','marker0','letter1','letter2','letter3','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][2] = ['letter0','letter1','marker0','letter2','letter3','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][3] = ['letter0','letter1','letter2','marker0','letter3','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][4] = ['letter0','letter1','letter2','letter3','marker0','letter4','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][5] = ['letter0','letter1','letter2','letter3','letter4','marker0','letter5','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][6] = ['letter0','letter1','letter2','letter3','letter4','letter5','marker0','letter6','letter7'];
TOI.CONFIG.frameTypes['letter'][7] = ['letter0','letter1','letter2','letter3','letter4','letter5','letter6','marker0','letter7'];
TOI.CONFIG.frameTypes['letter'][8] = ['letter0','letter1','letter2','letter3','letter4','letter5','letter6','letter7','marker0'];

TOI.CONFIG.frameTypes['word'][0] = ['marker0','word0','word0','link0','word1','word1','link1','word2','word2'];
TOI.CONFIG.frameTypes['word'][1] = ['link0','marker0','link1','word0','word0','link2','word1','word1','link3'];
TOI.CONFIG.frameTypes['word'][2] = ['word0','word0','marker0','word1','word1','link0','word2','word2','link1'];
TOI.CONFIG.frameTypes['word'][3] = ['link0','word0','word0','marker0','word1','word1','link1','word2','word2'];
TOI.CONFIG.frameTypes['word'][4] = ['word0','word0','link0','link1','marker0','link2','word1','word1','word2'];
TOI.CONFIG.frameTypes['word'][5] = ['word0','word0','link0','word1','word1','marker0','word2','word2','link1'];
TOI.CONFIG.frameTypes['word'][6] = ['link0','word0','word0','link1','word1','word1','marker0','word2','word2'];
TOI.CONFIG.frameTypes['word'][7] = ['word0','word0','link0','word1','word1','link1','link2','marker0','link3'];
TOI.CONFIG.frameTypes['word'][8] = ['word0','word0','link0','word1','word1','link1','word2','word2','marker0'];

TOI.CONFIG.frameTypes['paragraph'][0] = ['marker0','link0','link1','paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph1'];
TOI.CONFIG.frameTypes['paragraph'][1] = ['link0','marker0','link1','paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph1'];
TOI.CONFIG.frameTypes['paragraph'][2] = ['link0','link1','marker0','paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph1'];
TOI.CONFIG.frameTypes['paragraph'][3] = ['paragraph0','paragraph0','paragraph0','marker0','link0','link1','paragraph1','paragraph1','paragraph2'];
TOI.CONFIG.frameTypes['paragraph'][4] = ['paragraph0','paragraph0','paragraph0','link0','marker0','link1','paragraph1','paragraph1','paragraph1'];
TOI.CONFIG.frameTypes['paragraph'][5] = ['paragraph0','paragraph0','paragraph0','link0','link1','marker0','paragraph1','paragraph1','paragraph1'];
TOI.CONFIG.frameTypes['paragraph'][6] = ['paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph2','marker0','link0','link1'];
TOI.CONFIG.frameTypes['paragraph'][7] = ['paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph1','link0','marker0','link1'];
TOI.CONFIG.frameTypes['paragraph'][8] = ['paragraph0','paragraph0','paragraph0','paragraph1','paragraph1','paragraph1','link0','link1','marker0'];



TOI.CONFIG.calcFrameConfigs = function() {
    var returnArr = [];
    var pointer1 = [];
    var pointer2 = [];

    for (var key in this.frameTypes) {
        pointer1 = this.frameTypes[key];
        returnArr[key] = [];
        pointer2 = returnArr[key];

        for (var index=0;index<pointer1.length;index++) {
            pointer2.push([]);

            var frameType = pointer1[index];
            var frameConfig = pointer2[index];

            var capturedObjects = [];
            var objCount = 0;
            for (var i=0;i<frameType.length;i++) {
                var captured = false;
                for (var j=0;j<capturedObjects.length;j++) {
                    if (frameType[i] === capturedObjects[j]) {
                        captured = true;
                        break;
                    }
                }
                if (!captured) {
                    frameConfig.push([frameType[i].slice(0,frameType[i].length-1),i]);
                    capturedObjects.push(frameType[i]);
                    objCount++;
                }
            }

        }
    }
    console.log('output returnArr',returnArr);
    return returnArr;
};
TOI.CONFIG.calcPosMappings = function() {
    var returnArr = [];
    var pointer1 = [];
    var pointer2 = [];
    var pointer3 = [];

    for (var k in this.frameConfigs) {
        pointer1 = this.frameConfigs[k];
        returnArr[k] = [];
        pointer2 = returnArr[k];

        for (var i in pointer1) {
            pointer2[i] = [];

            for (var j in pointer1[i]) {
                pointer3 = pointer1[i][j];
                var jInt = parseInt(j);
                console.log(pointer3);

                if (pointer3[0] === 'marker') {
                    pointer2[i][pointer3[1]] = [jInt,'marker'];    
                } else if (pointer3[0] === 'letter') {
                    pointer2[i][pointer3[1]] = [jInt,'letter'];    
                } else if (pointer3[0] === 'word') {
                    pointer2[i][pointer3[1]] = [jInt,'word'];    
                    pointer2[i][pointer3[1]+1] = [jInt,'word'];    
                } else if (pointer3[0] === 'paragraph') {
                    pointer2[i][pointer3[1]] = [jInt,'paragraph'];    
                    pointer2[i][pointer3[1]+1] = [jInt,'paragraph'];    
                    pointer2[i][pointer3[1]+3] = [jInt,'paragraph'];    
                    pointer2[i][pointer3[1]+3+1] = [jInt, 'paragraph'];    
                }
            }
            console.log(pointer2);
        }
    }
    return returnArr;
};
TOI.CONFIG.frameConfigs = TOI.CONFIG.calcFrameConfigs();
console.log('TOI.CONFIG.frameConfigs',TOI.CONFIG.frameConfigs);
TOI.CONFIG.posMappings = TOI.CONFIG.calcPosMappings();
console.log('TOI.CONFIG.posMappings',TOI.CONFIG.posMappings);
