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

exports.getSuggestions = function() {
  return Q.all(plugins.map(function(plugin) {
    return plugin.getSuggestions();
  })).then(function(results) {
    return Array.prototype.concat.apply([], results); // flatten results
  });
};
