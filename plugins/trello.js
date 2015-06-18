//
// Trello plugin.
//
// This plugin requires 3 options: "key", "token" (unless you're only looking at public boards),
//   and "board" with your Trello board ID.
// To get your app key, go to: https://trello.com/app-key
// To get a token, go to: https://trello.com/1/authorize?key=APPKEY&name=JARVIS&expiration=never&response_type=token&scope=read,write
//   where APPKEY is replaced with your key.
//
var Q       = require('q');
var request = require('request');
var Trello  = require('node-trello');

function TrelloPlugin(name, opts) {
  this.name = name;
  this.trello = new Trello(opts.key, opts.token);
  this.boardId = opts.board;
}

function getOneDayAgo() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString();
}

function getWeekAgo() {
  var date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString();
}

TrelloPlugin.prototype.getStats = function() {
  var _this = this;
  return Q.ninvoke(
    this.trello, 'get',
    '/1/boards/' + this.boardId + '/actions',
    {
      filter: 'createCard,updateCard:closed',
      fields: 'date,type',
      limit: 1000, // max
      since: getWeekAgo(),
      memberCreator: false
    }
  ).then(function(actions) {
    var initial = {
      today: { added: 0, deleted: 0 },
      week: { added: 0, deleted: 0 },
      plugin: _this.name
    };
    return actions.reduce(function(previousVal, currentVal) {
      var key = (currentVal.type === 'createCard' ? 'added' : 'deleted');
      previousVal.week[key]++;
      if (currentVal.date > getOneDayAgo()) {
        previousVal.today[key]++;
      }
      return previousVal;
    }, initial);
  }).catch(console.log.bind(console));
};

TrelloPlugin.prototype.getSuggestions = function() {
  var _this = this;
  var count = 10;
  return Q.all([
    this.getStats(),
    Q.ninvoke(
      this.trello, 'get',
      '/1/boards/' + this.boardId + '/cards',
      {
        filter: 'open',
        fields: 'idShort,name,desc,labels,url,dateLastActivity'
      }
    )
  ]).spread(function(info, cards) {
    // Sort and return the first X cards.
    var count = Math.max(0, info.today.added - info.today.deleted);
    return cards.sort(function(a, b) {
      if (a === b) { return 0; }
      return (a.dateLastActivity < b.dateLastActivity) ? -1 : 1;
    }).slice(0, count);
  }).then(function(cards) {
    return cards.map(function(card) {
      return {
        service: _this.name,
        id: card.id,
        name: card.name,
        url: card.url,
        summary: card.desc.slice(0, 200) +
          (card.labels.length > 0 ? ' (' + card.labels.map(function(label) {
            return label.name;
          }).join(', ') + ')' : ''),
        reason: 'old',
        actions: ['archive']
      };
    });
  }).catch(console.log.bind(console));
};

module.exports = TrelloPlugin;
