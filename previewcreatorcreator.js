function createPreviewCreator (lib, utils) {
  'use strict';

  var q = lib.q,
    parseHtml = require('./htmlparser_jquery')(lib);

  function PreviewCreator(options){
    this.savehtmlas = options ? options.savehtmlas : null;
  }

  PreviewCreator.prototype.destroy = function(){
    this.savehtmlas = null;
  };

  PreviewCreator.prototype.doPreview = function(url, myDefer){
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
      imageSize: 0
    };
    var splitUrl = url.split('/');
    previewObj.url = url;
    previewObj.root = splitUrl[0] + '//' + splitUrl[2];
    lib.request(url, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0'
      },
      parameters: params,
      method: 'GET',
      onComplete: this.onUrlFetched.bind(this, defer, previewObj),
      onError: defer.resolve.bind(defer, null)
    });
    return ret;
  };

  PreviewCreator.prototype.onUrlFetched = function(defer, previewObj, result){
    if (result.statusCode !== 200){
      console.log('Getting error for https', result.statusCode, 'for', previewObj.url);
      if (previewObj.url.indexOf('https://') >= 0){
        console.log('Trying http');
        previewObj.url = previewObj.url.replace('https://','http://');
        this.doPreview(previewObj.url, defer);
        return;
      }else{
        console.log('Error fetching data from given URL:', previewObj.url, result);
        defer.resolve(result);
        return;
      }
    }
    if (this.savehtmlas) {
      require('fs').writeFileSync(this.savehtmlas, result.data);
    }
    lib.extend(previewObj, parseHtml(result.data));
    defer.resolve(previewObj);
  };

  return PreviewCreator;
}
module.exports = createPreviewCreator;
