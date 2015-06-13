StoryItems = new Mongo.Collection('storyItems');
StoryItems['sortingScope'] = "sceneId"; // orderの管理を分ける基準となるScopeプロパティを指定する

StoryItems.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
