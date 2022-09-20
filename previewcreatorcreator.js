var probe = require('probe-image-size');
function createPreviewCreator (lib, utils) {
  'use strict';

  var q = lib.q,
    //parseHtml = require('./htmlparser_jquery')(lib)
    //parseHtml = require('./htmlparser_regex')(lib)
    //parseHtml = require('./htmlparser_node-html-parser')(lib)
    parseHtml = require('./htmlparser_htmlparser2')(lib)
    ; 

  function PreviewCreator(options){
    this.savehtmlas = options ? options.savehtmlas : null;
  }

  PreviewCreator.prototype.destroy = function(){
    this.savehtmlas = null;
  };

  PreviewCreator.prototype.doPreview = function(url, myDefer, relocated){
    if (!url){
      return q(new lib.Error('NO_URL', 'No URL given for preview'));
    }
    utils.resetRegExes();
    if (utils.urlPattern.test(url)){
      //donothing
    } else if (utils.pseudoUrlPattern.test(url)){
      url = 'https://' + url;
    } else {
      console.log('Malformed URL', url);
      //TODO throw?
      return q.reject(new lib.Error('MALFORMED_URL', 'Malformed URL given for preview: "' + url + '"'));
    }
    var defer = myDefer || q.defer(), ret = defer.promise;
    var params = {};
    var previewObj = {
      url: null,
      root: null,
      title: null,
      description: null,
      image: null,
      imageSize: 0,
      imageWidth: '',
      imageHeight: ''
    };
    var splitUrl = url.split('/');
    previewObj.url = url;
    previewObj.root = splitUrl[0] + '//' + splitUrl[2];
    lib.request(relocated || url, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0'
      },
      parameters: params,
      method: 'GET',
      onComplete: this.onUrlFetched.bind(this, defer, previewObj),
      onError: defer.resolve.bind(defer, null)
    });
    /*
    defer = null;
    previewObj = null;
    */
    return ret;
  };

  PreviewCreator.prototype.onUrlFetched = function(defer, previewObj, result){
    //if (result.statusCode !== 200){
    switch (result.statusCode) {
      case 200:
        break;
      case 302:
      case 303:
        if (result.headers && result.headers.location) {
          return this.doPreview(previewObj.url, defer, result.headers.location);
        }
        break;
      default:
      console.log('Getting error for https', result.statusCode, 'for', previewObj.url);
      console.log(result);
      if (previewObj.url.indexOf('https://') >= 0){
        console.log('Trying http');
        previewObj.url = previewObj.url.replace('https://','http://');
        this.doPreview(previewObj.url, defer);
        return;
      }else{
        console.log('Error fetching data from given URL:', previewObj.url, result);
        defer.resolve(null);
        return;
      }
    }
    if (this.savehtmlas) {
      require('fs').writeFileSync(this.savehtmlas, result.data);
    }
    lib.extend(previewObj, parseHtml(result.data));
    if (previewObj.image) {
      probe(previewObj.image, this.onProbed.bind(this, defer, previewObj));
      defer = null;
      previewObj = null;
      return;
    }
    defer.resolve(previewObj);
  };

  PreviewCreator.prototype.onProbed = function (defer, previewObj, probeerr, proberesult) {
    if (probeerr) {
      defer.resolve(previewObj);
      return;
    }
    previewObj.imageWidth = proberesult.width+proberesult.wUnits;
    previewObj.imageHeight = proberesult.height+proberesult.hUnits;
    previewObj.image = proberesult.url;
    defer.resolve(previewObj);
  };

  return PreviewCreator;
}
module.exports = createPreviewCreator;
