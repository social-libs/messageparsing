function createLib (execlib) {
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    webindex = require('./webindex.js')(execlib),
    createPreviewInParallelProcess = require('./createpreviewcreator')(lib),
    MessageParser = webindex.Parser;

  function deInit () {
    createPreviewInParallelProcess.stop();
  }

  return {
    Parser: MessageParser,
//    PreviewCreator: PreviewCreator
    PreviewCreator: require('./previewcreatorcreator')(lib), //pitanje je kome ovo treba u AllexJS svetu, ali ako treba evo mu ga ovde,
    createPreviewInParallelProcess: createPreviewInParallelProcess,
    deInit: deInit
  };
}

module.exports = createLib;
