process.on('message', onMsg);
var lib = require('allexlib'); //!!
var utils = require('./utils.js')(lib);

var PreviewCreatorKlass = require('./previewcreatorcreator')(lib, utils),
  PreviewCreator = new PreviewCreatorKlass();


function onMsg (msg){
  var id;
  if (!(msg && msg.id && msg.url)) {
    return;
  }
  id = msg.id;
  PreviewCreator.doPreview(msg.url).then(
    doResolve.bind(null, id),
    doReject.bind(null, id)
  );
  id = null;
}

function doResolve (id, preview) {
  process.send({id: id, preview: preview});
}

function doReject (id, error) {
  process.send({id: id, error: error.toString()});
}

process.stdin.read();
console.log('PreviewCreator child process started');
