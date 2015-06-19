var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.UiOperations = new Mongo.Collection(null); // Client side only collection
_global.MongoCollections.UiOperations.insert({
  operation: 'L_UI_NO_MOVE',
  times: 0
});

_global.MongoCollections.UiStatuses = new Mongo.Collection(null); // Client side only collection
_global.MongoCollections.UiStatuses.insert({
  type: 'CurrentUiScreen',
  value: 'system'
});
