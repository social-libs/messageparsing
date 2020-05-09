var _reqresp = [{
  req: "https://www.youtube.com/watch?v=v-BvRlsbUiU",
  savehtmlas: 'youtube_kids.html',
  resp: {
      url: 'https://www.youtube.com/watch?v=v-BvRlsbUiU',
      root: 'https://www.youtube.com',
      title: 'Red Yellow Green Blue | + More Kids Songs | Super Simple Songs',
      description: 'Watch videos from Super Simple in the Super Simple App for iOS! ► http://apple.co/2nW5hPd Sing along with The Bumble Nums to this color-themed song for kids,...',
      image: 'https://i.ytimg.com/vi/v-BvRlsbUiU/maxresdefault.jpg',
      imageSize: 0
    }
},{
  req: 'https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url',
  savehtmlas: 'stackoverflow_1.html',
  resp: {
      url: 'https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url',
      root: 'https://stackoverflow.com',
      title: 'What is a good regular expression to match a URL?',
      description: 'add descrp',
      image: 'add imglink',
      imageSize: 0
  }
},{
  req: 'https://www.w3schools.com/tags/tag_img.asp',
  savehtmlas: 'w3schools_img.html',
  resp: {
      url: 'https://www.w3schools.com/tags/tag_img.asp',
      root: 'https://www.w3schools.com',
      title: 'add title',
      description: 'add descrp',
      image: 'add imglink',
      imageSize: 0
  }
}];

function runTest (func, reqresp) {
  func(reqresp.req)
}

function responder (reqresp) {
  return reqresp.resp;
}

function testIt(func, title) {
  it(title, function () {
    this.timeout(1e7);
    return expect(
      q.all(_reqresp.map(runTest.bind(func)))
    ).to.eventually.contain(_reqresp.map(responder));//_reqresp[0].resp);
  });
}

function doPreview (previewobj) {
  //previewobj properties:
  //url
  //savehtmlas
  var pc = new Lib.PreviewCreator({savehtmlas: previewobj.savehtmlas});
  return pc.doPreview(previewobj.url);
}

describe('Basic Test', function(){
  it ('Load lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  it ('Make a Parser instance', function () {
    return setGlobal('Parser', new Lib.Parser());
  });
  it('Parser example 1', function(){
    return expect(
      Parser.parse("Find me at http://www.example.com and also at http://stackoverflow.com")
    ).to.match(/<a href=\"http:\/\/www.example.com\" target="_blank">http:\/\/www.example.com<\/a>/);
    //).to.be.a('string');
  });
  it ('Find previewables', function () {
    console.log( Parser.findPreviewables("Find me at http://www.example.com and also at http://stackoverflow.com") );
  });
  it ('Find previewable with query', function () {
    console.log( Parser.findPreviewables("Find me at https://www.youtube.com/watch?v=v-BvRlsbUiU and also at http://stackoverflow.com") );
  });
  it('Preview example 1', function(){
    return expect(
      doPreview({url: _reqresp[0].req})
    ).to.eventually.contain(_reqresp[0].resp);
  });
  /*
  */
  it('Preview from parallel process', function () {
    this.timeout(1e7);
    return expect(
      Lib.createPreviewInParallelProcess({url: _reqresp[0].req, savehtmlas: _reqresp[0].savehtmlas})
    ).to.eventually.contain(_reqresp[0].resp);
  });
  it('Preview from parallel process 2', function () {
    this.timeout(1e7);
    return expect(
      Lib.createPreviewInParallelProcess({url: _reqresp[1].req, savehtmlas: _reqresp[1].savehtmlas})
    ).to.eventually.contain(_reqresp[1].resp);
  });
  it('Preview from parallel process 3', function () {
    this.timeout(1e7);
    return expect(
      Lib.createPreviewInParallelProcess({url: _reqresp[2].req, savehtmlas: _reqresp[2].savehtmlas})
    ).to.eventually.contain(_reqresp[2].resp);
  });
  it('Deinit', function () {
    Lib.deInit();
  });
});
