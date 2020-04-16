var cp = require('child_process');
function createCreatePreview (lib) {
  'use strict';

  var _childprocess = null,
    map = new lib.DeferMap();

  function ensureChildProcess () {
    if (_childprocess) {
      return _childprocess;
    }
    _childprocess = cp.fork('./previewcreatorprocess.js', {stdio:'inherit'});
    _childprocess.on('close', console.log.bind(console, 'PreviewCreator child process closed'));
    _childprocess.on('message', onFromProcess);
  }

  function onFromProcess (msg) {
    if (!(msg && msg.id)) {
      return;
    }
    if (msg.preview) {
      map.resolve(msg.id, msg.preview);
    }
    if (msg.error) {
      map.reject(msg.id, new Error(msg.error));
    }
    if (msg.progress) {
      map.notify(msg.progress);
    }//full approach
    //or else - nothing
  }

  function createPreview (url) {
    var previd = lib.uid();
    ensureChildProcess();
    _childprocess.send({id: previd, url: url});
    return map.promise(previd);
  }

  createPreview.stop = function () {
    _childprocess.kill();
  };

  return createPreview;
}
module.exports = createCreatePreview;

