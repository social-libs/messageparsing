var jsdom = require('jsdom'),
  jQuery = require('jquery');


function createHtmlParser_jQuery (lib) {
  'use strict';

  function biggestIconUnder200pxPicker(jQueryObj,previewObj,index,el){
    //sutra nastavljam odavde, trazimo icon sa najvecom dimenzijom a da je manji od 200px i pamtimo ga u previewObj.image
    var relativePath = jQueryObj(el).attr('href');
    var sizes = jQueryObj(el).attr('sizes');
    var sizeArry, size;
    console.log('da vidimo element',index,jQueryObj(el).attr('href'));
    console.log('da vidimo element',index,jQueryObj(el).attr('sizes'));
    if (!!sizes){
      sizeArry = sizes.split('x');
      size = parseInt(sizeArry[0]);
    }
    if (size > previewObj.imageSize && size < 200){
      previewObj.imageSize = size;
      previewObj.image = previewObj.root + relativePath;
      console.log('SIZE',previewObj.imageSize,'FAVICON', previewObj.image);
    }
  }

  function parseHtml (html) {
    var parsedDom,
      jQueryObj,
      previewObj;
    parsedDom = new jsdom.JSDOM(html);
    jQueryObj = jQuery(parsedDom.window);
    previewObj = {};
    previewObj.title = jQueryObj('title').text();
    console.log('JEL SI NASAO TITLE',previewObj.title);
    if (!previewObj.title){
      previewObj.title = jQueryObj("meta[property='og:title']").attr('content');
    }
    previewObj.description = jQueryObj("meta[name='description']").attr('content');
    if (!previewObj.description){
      previewObj.description = jQueryObj("meta[property='og:description']").attr('content');
    }
    //first look for og:image
    previewObj.image = jQueryObj("meta[property='og:image']").attr('content');
    //if there is no og:image use largest favicon under 200px
    if (!previewObj.image){
      jQueryObj('link[rel~="icon"]').each(biggestIconUnder200pxPicker.bind(this,jQueryObj, previewObj));
    }
    //console.log('Da vidimo data???',html.substring(0,1000));
    //console.log('DA VIDIMO parsedDom',require('util').inspect(parsedDom.window.document.querySelector("p"), false, null, true /* enable colors */));
    //console.log('Da vidimo metadatu:',previewObj.title, previewObj.description, previewObj.image);
    console.log('konacno', previewObj);
    return previewObj;
  }

  return parseHtml;
}
module.exports = createHtmlParser_jQuery;
