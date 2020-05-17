var cp = require('child_process');
function createCreatePreview (lib) {
  'use strict';

  var _childprocess = null,
    map = new lib.DeferMap();

  function ensureChildProcess () {
    if (_childprocess) {
      return _childprocess;
    }
    _childprocess = cp.fork(require('path').join(__dirname, 'previewcreatorprocess.js'), {stdio:'inherit'});
    _childprocess.on('close', console.log.bind(console, 'PreviewCreator child process closed'));
    _childprocess.on('message', onFromProcess);
  }

  function onFromProcess (msg) {
    if (!(msg && msg.id)) {
      return;
    }
    if ('preview' in msg) {
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

  function createPreview (urlobj) {
    var previd = lib.uid(), url, savehtmlas;
    if (lib.isString(urlobj)) {
      url = urlobj;
      savehtmlas = null;
    } else if (lib.isVal(urlobj) && 'url' in urlobj) {
      url = urlobj.url;
      savehtmlas = urlobj.savehtmlas || null;
    } else {
      return q(null);
    }
    ensureChildProcess();
    _childprocess.send({id: previd, url: url, savehtmlas: savehtmlas});
    return map.promise(previd);
  }

  createPreview.stop = function () {
    if (_childprocess) {
      _childprocess.kill();
    }
  };

  return createPreview;
}
module.exports = createCreatePreview;

