function createLib (execlib) {
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    jsdom = require('jsdom');

  function MessageParser(){
    //best stackoverflow answer about topic: https://stackoverflow.com/a/21925491
    //using this: https://stackoverflow.com/a/7123542
		// http://, https://, ftp://
		this.urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

		// www. sans http:// or https://
		this.pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		this.emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
  }

  MessageParser.prototype.destroy = function(){
    this.emailAddressPattern = null;
    this.pseudoUrlPattern = null;
    this.urlPattern = null;
  };

  MessageParser.prototype.urlify = function(text){
    return text
			.replace(this.urlPattern, '<a href="$&" target="_blank">$&</a>')
			.replace(this.pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
			.replace(this.emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>'); 
  };

	MessageParser.prototype.parse = function(text){
    return this.urlify(text);
	};

  return {
    Parser: MessageParser
  };
}

module.exports = createLib;
