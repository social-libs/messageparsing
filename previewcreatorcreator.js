var jsdom = require('jsdom'),
  jQuery = require('jquery');

function createPreviewCreator (lib) {
  'use strict';

  var q = lib.q;

  function PreviewCreator(){
  }

  PreviewCreator.prototype.destroy = function(){
  };

  PreviewCreator.prototype.doPreview = function(url){
    if (!url){
      return;
      //TODO better check with regexp from Parser
    }
    var defer = q.defer();
    var params = {};
    var previewObj = {
      url: null,
      root: null,
      title: null,
      description: null,
      image: null,
      imageSize: 0
    };
    var splitUrl = url.split('/');
    previewObj.url = url;
    previewObj.root = splitUrl[0] + '//' + splitUrl[2];
    lib.request(url, {
      parameters: params,
      method: 'GET',
      onComplete: this.onUrlFetched.bind(this, defer, previewObj),
      onError: defer.resolve.bind(null)
    });
    return defer.promise;
  };

  PreviewCreator.prototype.onUrlFetched = function(defer, previewObj, result){
    var parsedDom,
      jQueryObj;
    if (result.statusCode !== 200){
      console.log('Error fetching data from given URL:', previewObj.url);
      defer.resolve(null);
      return;
    }
    parsedDom = new jsdom.JSDOM(result.data);
    jQueryObj = jQuery(parsedDom.window);
    previewObj.title = jQueryObj('title').attr('content');
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
    //console.log('Da vidimo data???',result.data.substring(0,1000));
    //console.log('DA VIDIMO parsedDom',require('util').inspect(parsedDom.window.document.querySelector("p"), false, null, true /* enable colors */));
    //console.log('Da vidimo metadatu:',previewObj.title, previewObj.description, previewObj.image);
    defer.resolve(previewObj);
  };

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


  return PreviewCreator;
}
module.exports = createPreviewCreator;
