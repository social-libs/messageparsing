var _reqresp = [{
  req: "https://www.youtube.com/watch?v=v-BvRlsbUiU",
  resp: {
      url: 'https://www.youtube.com/watch?v=v-BvRlsbUiU',
      root: 'https://www.youtube.com',
      title: 'Red Yellow Green Blue | + More Kids Songs | Super Simple Songs',
      description: 'Watch videos from Super Simple in the Super Simple App for iOS! ► http://apple.co/2nW5hPd Sing along with The Bumble Nums to this color-themed song for kids,...',
      image: 'https://i.ytimg.com/vi/v-BvRlsbUiU/maxresdefault.jpg',
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
  it ('Make a PreviewCreator instance', function () {
    return setGlobal('PreviewCreator', new Lib.PreviewCreator());
  });
  /*
  it('Preview example 1', function(){
    return expect(
      PreviewCreator.doPreview("https://rs.n1info.com/Svet/a418380/Bivsi-savetnik-u-predizbornoj-kampanji-Donalda-Trampa-osudjen-na-14-dana-zatvora.html")
    //).to.match(/<a href=\"http:\/\/www.example.com\">http:\/\/www.example.com<\/a>/);
    ).to.be.a('string');
  });
  */
  it('Preview example 1', function(){
    return expect(
      PreviewCreator.doPreview(_reqresp[0].req)
    ).to.eventually.contain(_reqresp[0].resp);
  });
  it('Preview from parallel process', function () {
    this.timeout(1e7);
    return expect(
      Lib.createPreviewInParallelProcess(_reqresp[0].req)
    ).to.eventually.contain(_reqresp[0].resp);
  });
  it('Deinit', function () {
    Lib.deInit();
  });
});
