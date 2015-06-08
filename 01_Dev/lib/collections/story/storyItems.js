StoryItems = new Mongo.Collection('storyItems');

StoryItems.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

StoryItems.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'storyId', 'contentId', 'comment').length > 0);
  }
});

