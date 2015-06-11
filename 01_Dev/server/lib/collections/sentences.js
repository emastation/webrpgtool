Meteor.methods({
  sentenceCreate: function(attributes) {
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

  sentenceAndStoryItemCreate: function(data) {
    check(data, {
      storyItemAttributes: Object,
      text: String
    });

    var storyItemId = Meteor.call('storyItemAdd', data.storyItemAttributes);

    var sentenceAttributes = {
      text: data.text,
      storyItemId: storyItemId._id
    };

    var sentenceId = Meteor.call('sentenceCreate', sentenceAttributes);

    var storyItemAttributes = {
      contentId: sentenceId._id
    };

    StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      sentenceId: sentenceId._id
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
      contentType: 'sentence',
      comment: attributes.comment,
      order: -1
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      text: attributes.text
    };

    return Meteor.call('sentenceAndStoryItemCreate', data);
    /*
    var storyItemId = Meteor.call('storyItemAdd', storyItemAttributes);

    var sentenceAttributes = {
      text: attributes.text,
      storyItemId: storyItemId._id
    };

    var sentenceId = Meteor.call('sentenceCreate', sentenceAttributes);

    var storyItemAttributes = {
      contentId: sentenceId._id
    };

    StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      sentenceId: sentenceId._id
    };
    */
  },

  sentenceInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      comment: String,
      text: String,
      order: Number
    });

    var storyItemAttributes = {
      storyId: attributes.storyId,
      contentId: '',
      contentType: 'sentence',
      comment: attributes.comment,
      order: attributes.order
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      text: attributes.text
    };

    return Meteor.call('sentenceAndStoryItemCreate', data);

    /*
    var storyItemId = Meteor.call('storyItemAdd', storyItemAttributes);

    var sentenceAttributes = {
      text: attributes.text,
      storyItemId: storyItemId._id
    };

    var sentenceId = Meteor.call('sentenceCreate', sentenceAttributes);

    var storyItemAttributes = {
      contentId: sentenceId._id
    };

    StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      sentenceId: sentenceId._id
    };

*/
  },

  sentenceDelete: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    Sentences.remove(id);
  }
});
