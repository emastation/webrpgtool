var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.ObjectSchemata = new Mongo.Collection('objectSchemata');

_global.MongoCollections.ObjectSchemata.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return true; }
});
