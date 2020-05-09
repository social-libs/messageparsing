function testIt (testobj) {
  it('Testing regexparsing of sample '+testobj.sample, function () {
    var path, htmlsample, ret;
    try {
      path = require('path').join(__dirname, 'htmlsamples', testobj.sample);
      htmlsample = require('fs').readFileSync(path).toString();
    } catch (e) {
      console.error('Could not read', testobj.sample, ', that was interpreted as', path);
    }
    ret = parseHtml(htmlsample);
    console.log(testobj.sample, '=>', ret);
    ret = expect(ret).to.include(testobj.expect);
    testobj = null;
    return ret;
  });
}

var samples = [{
  sample: 'title.html',
  expect: {
    title: 'BLA'
  }
},{
  sample: 'youtube_kids.html',
  expect: {
    title: 'Red Yellow Green Blue | + More Kids Songs | Super Simple Songs - YouTube',
    description: 'Watch videos from Super Simple in the Super Simple App for iOS! ► http://apple.co/2nW5hPd Sing along with The Bumble Nums to this color-themed song for kids,...',
    image: 'https://i.ytimg.com/vi/v-BvRlsbUiU/maxresdefault.jpg'
  }
},{
  sample: 'w3schools_img.html',
  expect: {
    title: 'HTML img tag',
    description: 'Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, PHP, Python, Bootstrap, Java and XML.'
  }
},{
  sample: 'stackoverflow_1.html',
  expect: {
    title: 'javascript - What is a good regular expression to match a URL? - Stack Overflow',
    description: 'Currently I have an input box which will detect the URL and parse the data.&#xA;&#xA;So right now, I am using:&#xA;&#xA;var urlR = /^(?:([A-Za-z]&#x2B;):)?(\\/{0,3})([0-9.\\-A-Za-z]&#x2B;)&#xA;           (?::(\\d&#x2B;))?(?:\\/([^?#]*))...',
    image: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded'
  }
}]

describe('Test HTML parsing via regex', function () {
  it('Load html regex parser', function () {
    setGlobal('parseHtml', require('../htmlparser_regex')(lib));
  });
  samples.forEach(testIt);
});
