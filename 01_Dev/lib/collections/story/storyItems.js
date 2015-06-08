StoryItems = new Mongo.Collection('storyItems');

StoryItems.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
