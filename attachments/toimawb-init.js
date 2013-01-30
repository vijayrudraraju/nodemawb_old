var TOI = {
    'DEBUG':{},
    'TIME':[0],
    'CONFIG':{
        'numPoints': 9,
        'frameTypes': {'mixed':[],'letter':[],'word':[],'paragraph':[]},
        'calcFrameConfigs': {},
        'calcPosMappings': {},
        'frameConfigs': {},
        'posMappings': {}
    },
    'createDoc':{},
    'getAtom':{},
    'calcLinearDist':{},
    'calcSquareDist':{},
    'updateDist':{},
    'DATA':{
        'calcPartialHood':{},
        'calcCompleteHood':{},
        'calcNeighborhoods':{},
        'parseAlphabet':{},
        'parseWordset':{},
        'parseParagraphset':{},
        'process':{},
        'INIT':[],
        'TRAIL':[],
        'DOCS':{}
    },
    'MAIN':{
        'divArr':[],
        'pArr':[],
        'stackArr':[],
        'body':{},
        'frame':{},
        'stack':{},
        'data':{},
        'start':{}
    },
    'STATE':{
        'sequence':'',
        'pointer':'',
        'index':0,
        'view':0
    }
};
