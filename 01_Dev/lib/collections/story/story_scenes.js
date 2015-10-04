var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.StoryScenes = new Mongo.Collection('storyScenes');
_global.MongoCollections.StoryScenes['sortingScope'] = "storyId"; // orderの管理を分ける基準となるScopeプロパティを指定する

_global.MongoCollections.StoryScenes.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
