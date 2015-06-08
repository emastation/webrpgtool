Meteor.methods({
  sentenceInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      text: String,
      storyItemId: String
    });

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = Sentences.insert(recordObj);

    return {
      _id: id
    };
  }
});
