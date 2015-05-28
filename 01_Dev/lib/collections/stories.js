Stories = new Mongo.Collection('stories');

Stories.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Stories.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});

Meteor.methods({
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String
    });

    var storyWithSameTitle = Stories.findOne({title: storyAttributes.title});
    if (storyWithSameTitle) {
      return {
        storyExists: true,
        _id: storyWithSameTitle._id
      }
    }

    var user = Meteor.user();
    var story = _.extend(storyAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var storyId = Stories.insert(story);

    return {
      _id: storyId
    };
  }
});
