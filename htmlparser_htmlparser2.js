var ParserKlass = require('htmlparser2').Parser;

function createHtmlParser_htmlparser2 (lib) {
  'use strict';

  function CurrentTag (name) {
    this.name = name;
    this.level = 1;
  }
  CurrentTag.prototype.destroy = function () {
    this.level = null;
    this.name = null;
  };
  CurrentTag.prototype.enter = function (tagname) {
    if (this.name === tagname) {
      this.level++;
    }
  };
  CurrentTag.prototype.exit = function (tagname) {
    if (this.name !== tagname) {
      return;
    }
    this.level--;
    if (this.level<1) {
      this.destroy();
    }
  };
  CurrentTag.prototype.isDone = function () {
    return !(lib.isNumber(this.level) && this.level>0);
  };

  function Parser () {
    this.title = null;
    this.description = null;
    this.image = null;
    this.parser = null;
    this.openTagName = null;
  }
  Parser.prototype.destroy = function () {
    this.openTagName = null;
    this.parser = null;
    this.image = null;
    this.description = null;
    this.title = null;
  };
  Parser.prototype.go = function (html) {
    var ret;
    this.parser = new ParserKlass({
      onopentag: this.onOpenTag.bind(this),
      onattribute: this.onAttribute.bind(this),
      ontext: this.onText.bind(this),
      onclosetag: this.onCloseTag.bind(this)
    },{
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeSelfClosing: true
    });
    this.parser.write(html);
    this.parser.parseComplete();
    ret = lib.pick(this, ['title', 'description', 'image']);
    this.destroy();
    return ret;
  };
  Parser.prototype.onOpenTag = function (tagname, attributes) {
    this.openTagName = null;
    if (this.irrelevantTag) {
      this.irrelevantTag.enter(tagname);
      return;
    }
    if (this.relevantTags.indexOf(tagname)<0) {
      if (!this.irrelevantTag) {
        this.irrelevantTag = new CurrentTag(tagname);
        return;
      }
      return;
    }
    if (tagname === 'link') {
      /*
      if ('rel'
      */
      return;
    }
    if (tagname === 'meta') {
      if ('property' in attributes && attributes.content) {
        this.doMeta(attributes.property.toLowerCase(), attributes.content);
      }
      if ('name' in attributes && attributes.content) {
        this.doMeta(attributes.name.toLowerCase(), attributes.content);
      }
      return;
    }
    this.openTagName = tagname;
  };
  Parser.prototype.onAttribute = function () {
    if (!this.openTagName) {
      return;
    }
    //console.log('onAttribute', arguments)
  };
  Parser.prototype.onText = function (text) {
    if (!this.openTagName) {
      return;
    }
    if (this.openTagName === 'title') {
      if (!this.title) {
        this.title = text;
      }
    }
  };
  Parser.prototype.onCloseTag = function (tagname) {
    if (this.irrelevantTag) {
      this.irrelevantTag.exit(tagname);
      if (this.irrelevantTag.isDone()) {
        this.irrelevantTag = null;
      }
    }
    this.openTagName = null;
  };
  Parser.prototype.doMeta = function (prop, content) {
    switch (prop) {
      case 'og:title':
        if (!this.title) {
          console.log('Had no <title> title, getting it from og:title', content);
          this.title = content;
        }
        return;
      case 'description': 
      case 'og:description': 
        if (!this.description) {
          this.description = content;
        }
        return;
      case 'og:image':
        this.image = content;
    }
  };
  Parser.prototype.relevantTags = ['html', 'head', 'title', 'meta', 'link'];

  function parseHtml (html) {
    var p = new Parser();
    return p.go(html);
  }

  return parseHtml;
}
module.exports = createHtmlParser_htmlparser2;
