var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.SoundEffects = new Mongo.Collection('soundEffects');

_global.MongoCollections.SoundEffects.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
