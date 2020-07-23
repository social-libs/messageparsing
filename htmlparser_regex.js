var entities = new (require('html-entities').AllHtmlEntities)();
function createHtmlParser_regex (lib) {
  'use strict';

  var regexes = {
    title: /<title[^>]*>.*<\/title>/i,
    metaogtitle: /<meta[^>]*og:title\s*=\s*[^>]*>/i,
    metadescription: /<meta[^>]*['"]{1}description['"]{1}[^>]*>/i,
    metaogdescription: /<meta[^>]*og:description[^>]*>/i,
    metaogimage: /<meta[^>]*og:image[^>]*>/i,
    content: /content\s*=\s*["']{1}(.*)["']{1}/i,
    text: />(.*)</
  };

  function find (string, regexname, index) {
    var regex = regexes[regexname], ret=[], fnd, p, pdecoded;
    if (!regex) {
      return ret;
    }
    regex.lastIndex = 0;
    while (fnd = regex.exec(string)) {
      p = lib.isNumber(index) ? fnd[index] : fnd;
      //ret.push(p);
      pdecoded = entities.decode(p);
      ret.push(pdecoded);
      if (!regex.global) {
        break;
      }
    }
    return ret;
  }

  function contentof (string) {
    var cr, tr;
    cr = find(string, 'content', 1);
    if (cr && cr.length>0) {
      return cr[0];
    }
    tr = find(string, 'text', 1);
    return tr && tr.length>0 ? tr[0] : '';
  }

  function contentsoftag(string, regexname) {
    var f = find(string, regexname, 0);
    if (!f) {
      return '';
    }
    console.log(regexname, '=>', f, f.length, f[0]);
    if (f.length<1) {
      return '';
    }
    return contentof(f[0]);
  }

  function contentsoftags (string, regexnames) {
    var i, ret;
    if (!lib.isArray(regexnames)) {
      return '';
    }
    for (i=0; i<regexnames.length; i++) {
      ret = contentsoftag(string, regexnames[i]);
      if (ret) {
        //console.log('na', regexnames[i], 'nasao', ret);
        return ret;
      }
      console.log('na', regexnames[i], 'nema NISTA');
    }
    return '';
  }

  function addiffound (obj, propname, string, regexnames) {
    var r = contentsoftags(string, regexnames);
    if (r) {
      obj[propname] = r;
    }
  }

  function parseHtml (html) {
    var ret = {};

    addiffound(ret, 'title', html, ['metaogtitle', 'title']);
    addiffound(ret, 'description', html, ['metaogdescription', 'metadescription']);
    addiffound(ret, 'image', html, ['metaogimage']);
    //console.log(contentsoftags(html, ['metaogtitle', 'title']));

    return ret;
  }

  return parseHtml;
}
module.exports = createHtmlParser_regex;
