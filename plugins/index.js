var Q = require('kew');

var plugins = [];

exports.getSuggestions = function() {
  return Q.all(plugins.map(function(plugin) {
    return plugin.getSuggestions();
  }));
};
