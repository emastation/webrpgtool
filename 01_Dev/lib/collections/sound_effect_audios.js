var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.SoundEffectAudios = new Mongo.Collection('soundEffectAudios');

_global.MongoCollections.SoundEffectAudios.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
