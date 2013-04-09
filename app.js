 var couchapp = require('couchapp'), 
    path = require('path'),
    activeDDoc = 'sfmusichackday2013';

switch (activeDDoc) {
    case 'router':
        ddoc = {_id:'_design/router'};
        ddoc.rewrites = [
            {from:'/sfmusichackday2013',to:'../../_design/sfmusichackday2013/_rewrite'},
            {from:'/sfmusichackday2013/*',to:'../../_design/sfmusichackday2013/_rewrite/*'}
        ];
        break;
    case 'sfmusichackday2013':
        ddoc = {_id:'_design/sfmusichackday2013'};
        ddoc.rewrites = [
            {from:'',to:'index.html'}, 
            {from:'/',to:'index.html'}, 
            {from:'*',to:'*'} 
        ];
        couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));
        break;
}
module.exports = ddoc;
