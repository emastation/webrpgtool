var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.BackgroundImages = new Mongo.Collection('backgroundImages');

_global.MongoCollections.BackgroundImages.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
