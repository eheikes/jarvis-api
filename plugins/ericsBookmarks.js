//
// Plugin for Eric's custom bookmark app: https://github.com/eheikes/toread
//
var Q       = require('q');
var request = require('request');

function EricsBookmarks(name, opts) {
  this.name = name;
  this.url  = opts.url;
}

// Returns parsed JSON from a Q.nfcall(request, ...)
function getBody(nfcallResponse) {
  return JSON.parse(nfcallResponse[1]);
}

EricsBookmarks.prototype.getInfo = function() {
  return Q.nfcall(request, this.url + '?count=0&offset=0').then(function(response) {
    return getBody(response);
  }).catch(console.log.bind(console));
};

EricsBookmarks.prototype.getItems = function(opts) {
  var offset = opts.offset;
  var count  = opts.count;
  return Q.nfcall(request, this.url + '?random&count=' + count + '&offset=' + offset).then(function(response) {
    return getBody(response).links;
  }).catch(console.log.bind(console));
};

EricsBookmarks.prototype.getStats = function() {
  return this.getInfo().then(function(info) {
    return {
      today: { added: info.stats.addedToday, deleted: info.stats.deletedToday },
      week: { added: info.stats.addedThisWeek, deleted: info.stats.deletedThisWeek }
    };
  }).catch(console.log.bind(console));
};

EricsBookmarks.prototype.getSuggestions = function() {
  var _this = this;
  return this.getInfo().then(function(info) {
    var count = Math.max(0, info.stats.addedToday - info.stats.deletedToday);
    var offset = info.total - count;
    return _this.getItems({ count: count, offset: offset });
  }).then(function(items) {
    return items.map(function(item) {
      return {
        service: _this.name,
        id: item.id + '',
        name: item.title,
        url: item.link,
        summary: (item.description ? item.description : '') +
          (item.tags.length > 0 ? ' (' + item.tags.join(', ') + ')' : ''),
        reason: 'random',
        actions: ['delete']
      };
    });
  }).catch(console.log.bind(console));
};

module.exports = EricsBookmarks;
