StoryScenes = new Mongo.Collection('storyScenes');
StoryScenes['sortingScope'] = "storyId"; // orderの管理を分ける基準となるScopeプロパティを指定する

StoryScenes.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
