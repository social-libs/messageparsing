function createUtils (lib){

  //best stackoverflow answer about topic: https://stackoverflow.com/a/21925491
  //using this: https://stackoverflow.com/a/7123542
  // http://, https://, ftp://
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  // www. sans http:// or https://
  var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  // Email addresses
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

  return {
    urlPattern : urlPattern,
    pseudoUrlPattern : pseudoUrlPattern,
    emailAddressPattern : emailAddressPattern
  };
}

module.exports = createUtils;
