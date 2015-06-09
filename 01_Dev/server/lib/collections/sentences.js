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
  },

  sentencePush: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      comment: String,
      text: String
    });

    var storyItemAttributes = {
      storyId: attributes.storyId,
      contentId: '',
      comment: attributes.comment,
      order: -1
    };

    var storyItemId = Meteor.call('storyItemInsert', storyItemAttributes);

    var sentenceAttributes = {
      text: attributes.text,
      storyItemId: storyItemId._id
    };

    var sentenceId = Meteor.call('sentenceInsert', sentenceAttributes);

    var storyItemAttributes = {
      contentId: sentenceId._id
    };

    StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      sentenceId: sentenceId._id
    };
  }
});
