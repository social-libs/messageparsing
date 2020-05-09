function testIt (htmlsamplefilename) {
  it('Testing regexparsing of sample '+htmlsamplefilename, function () {
    var path, htmlsample, ret;
    try {
      path = require('path').join(__dirname, 'htmlsamples', htmlsamplefilename);
      htmlsample = require('fs').readFileSync(path).toString();
    } catch (e) {
      console.error('Could not read', htmlsamplefilename, ', that was interpreted as', path);
    }
    ret = parseHtml(htmlsample);
    console.log(htmlsamplefilename, '=>', ret);
    htmlsamplefilename = null;
  });
}

var samples = ['title.html', 'youtube_kids.html', 'w3schools_img.html', 'stackoverflow_1.html']

describe('Test HTML parsing via regex', function () {
  it('Load html regex parser', function () {
    setGlobal('parseHtml', require('../htmlparser_regex')(lib));
  });
  samples.forEach(testIt);
});
