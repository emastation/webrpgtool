var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.Maps = new Mongo.Collection('maps');

_global.MongoCollections.Maps.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

_global.MongoCollections.Maps.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title', 'width', 'height', 'type_array', 'height_array', 'script_array').length > 0);
  }
});
