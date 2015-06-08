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

Meteor.methods({
  storyItemInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      contentId: String,
      comment: String
    });

    /*
     var sameTitleRecord = Stories.findOne({text: attributes.text});
     if (sameTitleRecord) {
     return {
     alreadyExists: true,
     _id: sameTitleRecord._id
     }
     }
     */

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = StoryItems.insert(recordObj);

    return {
      _id: id
    };
  }
});
