function createLib (execlib) {
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    utils = require('./utils.js')(lib),
    webindex = require('./webindex.js')(execlib, utils),
    createPreviewInParallelProcess = require('./createpreviewcreator')(lib),
    MessageParser = webindex.Parser;

  function deInit () {
    createPreviewInParallelProcess.stop();
  }

  return {
    Parser: MessageParser,
//    PreviewCreator: PreviewCreator
    PreviewCreator: require('./previewcreatorcreator')(lib, utils), //pitanje je kome ovo treba u AllexJS svetu, ali ako treba evo mu ga ovde,
    createPreviewInParallelProcess: createPreviewInParallelProcess,
    deInit: deInit
  };
}

module.exports = createLib;
