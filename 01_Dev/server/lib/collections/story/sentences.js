Meteor.methods({
  sentenceCreate: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      text: String,
      characterId: String,
      characterImageId: String,
      storyItemId: String
    });

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = MongoCollections.Sentences.insert(recordObj);

    return {
      _id: id
    };
  },

  sentenceAndStoryItemCreate: function(data) {
    check(data, {
      storyItemAttributes: Object,
      text: String,
      characterId: String,
      characterImageId: String
    });

    var storyItemId = Meteor.call('storyItemAdd', data.storyItemAttributes);

    var sentenceAttributes = {
      text: data.text,
      characterId: data.characterId,
      characterImageId: data.characterImageId,
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
      sceneId: String,
      comment: String,
      text: String,
      characterId: String,
      characterImageId: String
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'sentence',
      comment: attributes.comment,
      order: -1
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      text: attributes.text,
      characterId: attributes.characterId,
      characterImageId: attributes.characterImageId

    };

    return Meteor.call('sentenceAndStoryItemCreate', data);

  },

  sentenceInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      text: String,
      characterId: String,
      characterImageId: String,
      order: Number
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'sentence',
      comment: attributes.comment,
      order: attributes.order
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      text: attributes.text,
      characterId: attributes.characterId,
      characterImageId: attributes.characterImageId
    };

    return Meteor.call('sentenceAndStoryItemCreate', data);

  },

  sentenceDelete: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    MongoCollections.Sentences.remove(id);
  }
});
