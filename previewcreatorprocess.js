process.on('message', onMsg);
var lib = require('allexlib'); //!!
var utils = require('./utils.js')(lib);

var PreviewCreatorKlass = require('./previewcreatorcreator')(lib, utils),
  PreviewCreator = new PreviewCreatorKlass();


function onMsg (msg){
  var id, pc;
  if (!(msg && msg.id && msg.url)) {
    return;
  }
  id = msg.id;
  if (!msg.savehtmlas) {
    PreviewCreator.doPreview(msg.url).then(
      doResolve.bind(null, null, id),
      doReject.bind(null, null, id)
    );
  } else {
    pc = new PreviewCreatorKlass({savehtmlas: msg.savehtmlas});
    pc.doPreview(msg.url).then(
      doResolve.bind(null, pc, id),
      doReject.bind(null, pc, id)
    );
    pc = null;
  }
  id = null;
}

function doResolve (previewcreator, id, preview) {
  process.send({id: id, preview: preview});
  optionallyDestroyPreviewCreator(pc);
}

function doReject (previewcreator, id, error) {
  process.send({id: id, error: error.toString()});
  optionallyDestroyPreviewCreator(pc);
}

function optionallyDestroyPreviewCreator (pc) {
  if (pc) {
    pc.destroy();
  }
  pc = null;
}

process.stdin.read();
console.log('PreviewCreator child process started');
