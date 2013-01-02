 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = {_id:'_design/init'};

ddoc.rewrites = [
    {from:'/toimawb/_design/one/*',to:'*'},
    {from:'/toimawb/*',to:'../../*'},
    {from:'',to:'index.html'}, {from:'*',to:'*'} ];

ddoc.views = {
    makes: {
        map: function(doc) {
            emit(doc.make,null);
        }
    },
    byCollection: {
        map: function(doc) {
            if (doc.collection) {
                emit(doc.collection, doc);
            }
        }
    }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
