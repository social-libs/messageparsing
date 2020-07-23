var _reqresp = [{
  req: "https://www.youtube.com/watch?v=v-BvRlsbUiU",
  savehtmlas: 'youtube_kids.html',
  resp: {
      url: 'https://www.youtube.com/watch?v=v-BvRlsbUiU',
      root: 'https://www.youtube.com',
      title: 'Red Yellow Green Blue | + More Kids Songs | Super Simple Songs - YouTube',
      description: 'Watch videos from Super Simple in the Super Simple App for iOS! ► http://apple.co/2nW5hPd Sing along with The Bumble Nums to this color-themed song for kids,...',
      image: 'https://i.ytimg.com/vi/v-BvRlsbUiU/maxresdefault.jpg',
      imageSize: 0,
      imageWidth: '1280px',
      imageHeight: '720px'
    }
},{
  req: 'https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url',
  savehtmlas: 'stackoverflow_1.html',
  resp: {
      url: 'https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url',
      root: 'https://stackoverflow.com',
      title: 'javascript - What is a good regular expression to match a URL? - Stack Overflow',
      description: 'Currently I have an input box which will detect the URL and parse the data.&#xA;&#xA;So right now, I am using:&#xA;&#xA;var urlR = /^(?:([A-Za-z]&#x2B;):)?(\\/{0,3})([0-9.\\-A-Za-z]&#x2B;)&#xA;           (?::(\\d&#x2B;))?(?:\\/([^?#]*))...',
      image: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded',
      imageSize: 0,
      imageWidth: '316px',
      imageHeight: '316px'
  }
},{
  req: 'https://www.w3schools.com/tags/tag_img.asp',
  savehtmlas: 'w3schools_img.html',
  resp: {
      url: 'https://www.w3schools.com/tags/tag_img.asp',
      root: 'https://www.w3schools.com',
      title: 'HTML img tag',
      description: 'Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, PHP, Python, Bootstrap, Java and XML.',
      image: null,
      imageSize: 0
  }
},{
  req: 'https://www.npmjs.com/package/probe-image-size',
  savehtmlas: 'npmjs.html',
  resp: {
      url: 'https://www.npmjs.com/package/probe-image-size',
      root: 'https://www.npmjs.com',
      title: 'probe-image-size  -  npm',
      description: 'Get image size without full download (JPG, GIF, PNG, WebP, BMP, TIFF, PSD)',
      image: 'https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png',
      imageSize: 0,
      imageWidth: '1200px',
      imageHeight: '630px'
  }
},{
  req: 'https://youtu.be/mjWkm3tvrRA',
  savehtmlas: 'youtu.be.html',
  resp: {
      url: 'https://youtu.be/mjWkm3tvrRA',
      root: 'https://youtu.be',
      title: 'Santana - Hope You&#39;re Feeling Better - 8/18/1970 - Tanglewood (Official) - YouTube',
      description: 'Santana - Hope You&#39;re Feeling Better Recorded Live: 8/18/1970 - Tanglewood - Lenox, MA More Santana at Music Vault: http://www.musicvault.com Subscribe to Mu...',
      image: 'https://i.ytimg.com/vi/mjWkm3tvrRA/hqdefault.jpg',
      imageSize: 0,
      imageWidth: '480px',
      imageHeight: '360px'
  }
}];

function testInprocIt (testobj) {
  it('Test inproc preview '+testobj.req, function () {
    this.timeout(1e4);
    var ret = expect(
      doPreview({url: testobj.req, savehtmlas: testobj.savehtmlas})
    ).to.eventually.contain(testobj.resp);
    testobj = null;
    return ret;
  });
}
function testParallelprocIt (testobj) {
  it('Test inproc preview '+testobj.req, function () {
    this.timeout(1e4);
    var ret = expect(
      Lib.createPreviewInParallelProcess({url: testobj.req, savehtmlas: testobj.savehtmlas})
    ).to.eventually.contain(testobj.resp);
    testobj = null;
    return ret;
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
    this.timeout(1e5);
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
    //console.log( Parser.findPreviewables("Find me at http://www.example.com and also at http://stackoverflow.com") );
    console.log( Parser.findPreviewables("https://youtu.be/mjWkm3tvrRA") );
  });
  it ('Find previewable with query', function () {
    console.log( Parser.findPreviewables("Find me at https://www.youtube.com/watch?v=v-BvRlsbUiU and also at http://stackoverflow.com") );
  });
  _reqresp.forEach(testInprocIt);
  /*
  it('Preview example 1', function(){
    return expect(
      doPreview({url: _reqresp[0].req})
    ).to.eventually.contain(_reqresp[0].resp);
  });
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
  */
  it('Deinit', function () {
    Lib.deInit();
  });
});
