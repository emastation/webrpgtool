var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.Stories = new Mongo.Collection('stories');

_global.MongoCollections.Stories.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
