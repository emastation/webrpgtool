Meteor.methods({
  createSentence: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      text: String,
      characterId: String,
      characterImageId: String,
      storyItemId: String,
      position: String
    });

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user ? user._id : '', // Fixtureから呼ばれた際には、userはnullなのでその対策
      author: user ? user.username : 'unknown',
      submitted: new Date()
    });

    var id = MongoCollections.Sentences.insert(recordObj);

    return {
      _id: id
    };
  },

  createSentenceAndStoryItem: function(data) {
    check(data, {
      storyItemAttributes: Object,
      text: String,
      characterId: String,
      characterImageId: String,
      position: String
    });

    var storyItemId = Meteor.call('addStoryItem', data.storyItemAttributes);

    var sentenceAttributes = {
      text: data.text,
      characterId: data.characterId,
      characterImageId: data.characterImageId,
      storyItemId: storyItemId._id,
      position: data.position
    };

    var sentenceId = Meteor.call('createSentence', sentenceAttributes);

    var storyItemAttributes = {
      contentId: sentenceId._id
    };

    MongoCollections.StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      sentenceId: sentenceId._id
    };
  },

  pushSentence: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      text: String,
      characterId: String,
      characterImageId: String,
      position: String
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
      characterImageId: attributes.characterImageId,
      position: attributes.position
    };

    return Meteor.call('createSentenceAndStoryItem', data);

  },

  insertSentence: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      text: String,
      characterId: String,
      characterImageId: String,
      position: String,
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
      characterImageId: attributes.characterImageId,
      position: attributes.position
    };

    return Meteor.call('createSentenceAndStoryItem', data);

  },

  deleteSentence: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    MongoCollections.Sentences.remove(id);
  }
});
