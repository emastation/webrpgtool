var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.StoryItems = new Mongo.Collection('storyItems');
_global.MongoCollections.StoryItems['sortingScope'] = "sceneId"; // orderの管理を分ける基準となるScopeプロパティを指定する

_global.MongoCollections.StoryItems.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
