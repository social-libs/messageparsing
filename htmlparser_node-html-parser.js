var parser = require('node-html-parser');

function createHtmlParser_nodeHtmlParser (lib) {
  'use strict';

  function contentsof (root, selector) {
    var el;
    if (!root) {
      return '';
    }
    el = root.querySelector(selector);
    console.log('selector', selector, '=>', el);
    if (!el) {
      return '';
    }
    console.log('content of', el, '?');
    return el.getAttribute('content') || '';
  }
  function textof (root, selector) {
    var el;
    if (!root) {
      return '';
    }
    el = root.querySelector(selector);
    if (!el) {
      return '';
    }
    return el.text || '';
  }

  function parseHtml (html) {
    var root = parser.parse(html);
    return {
      title: textof(root, 'title') || contentsof(root, 'meta[property="og:title"]'),
      description: contentsof(root, '[name="description"]') || contentsof(root, '[property="og:description"]')
    };
  }

  return parseHtml;
}
module.exports = createHtmlParser_nodeHtmlParser;
