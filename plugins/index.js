var config = require('config');
var Q      = require('q');

// Make sure that the plugins object exists.
config.plugins = config.plugins || {};

// Load the plugins.
var plugins = Object.keys(config.plugins).map(function(name) {
  var pluginConfig = config.plugins[name];
  var type = pluginConfig.type;
  if (!type) return;
  var PluginConstructor = require('./' + type);
  return new PluginConstructor(name, pluginConfig);
});

var callEachPlugin = function(methodName) {
  return plugins.map(function(plugin) {
    return plugin[methodName]();
  })
};

exports.getStats = function() {
  return Q.all(callEachPlugin('getStats')).then(function(results) {
    var initialStats = {
      today: { added: 0, deleted: 0 },
      week:  { added: 0, deleted: 0 }
    };
    return results.reduce(function(prev, current) {
      return {
        today: {
          added: prev.today.added + current.today.added,
          deleted: prev.today.deleted + current.today.deleted,
        },
        week: {
          added: prev.week.added + current.week.added,
          deleted: prev.week.deleted + current.week.deleted,
        }
      };
    }, initialStats);
  });
};

exports.getSuggestions = function() {
  return Q.all(callEachPlugin('getSuggestions')).then(function(results) {
    return Array.prototype.concat.apply([], results); // flatten results
  });
};
