(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lR = ALLEX.execSuite.libRegistry;
lR.register('social_messageparsinglib', require('./libindex')(ALLEX));

},{"./libindex":2}],2:[function(require,module,exports){
function createLib (execlib) {

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

},{}]},{},[1]);
