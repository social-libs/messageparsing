function createLib (execlib, utils) {
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function MessageParser(){
  }

  MessageParser.prototype.destroy = function(){
  };

  MessageParser.prototype.urlify = function(text){
    return text
			.replace(utils.urlPattern, '<a href="$&" target="_blank">$&</a>')
			.replace(utils.pseudoUrlPattern, '$1<a href="$2" target="_blank">$2</a>')
			.replace(utils.emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>'); 
  };

	MessageParser.prototype.parse = function(text){
    return this.urlify(text);
	};

  MessageParser.prototype.findPreviewables = function (text) {
    var ret = [], r;
    while (r = utils.urlPattern.exec(text)) {
      //console.log(r);
      ret.push(r[0]);
    }
    return ret;
  };

  return {
    Parser: MessageParser
  };
}

module.exports = createLib;
