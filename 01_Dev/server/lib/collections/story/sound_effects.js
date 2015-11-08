Meteor.methods({
  createSoundEffect: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      soundEffectAudioId: String,
      storyItemId: String,
      volume: Number
    });

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user ? user._id : '', // Fixtureから呼ばれた際には、userはnullなのでその対策
      author: user ? user.username : 'unknown',
      submitted: new Date()
    });

    var id = MongoCollections.SoundEffects.insert(recordObj);

    return {
      _id: id
    };
  },

  createSoundEffectAndStoryItem: function(data) {
    check(data, {
      storyItemAttributes: Object,
      soundEffectAudioId: String,
      volume: Number
    });

    var storyItemId = Meteor.call('addStoryItem', data.storyItemAttributes);

    var soundEffectAttributes = {
      soundEffectAudioId: data.soundEffectAudioId,
      storyItemId: storyItemId._id,
      volume: data.volume
    };

    var soundEffectId = Meteor.call('createSoundEffect', soundEffectAttributes);

    var storyItemAttributes = {
      contentId: soundEffectId._id
    };

    MongoCollections.StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      soundEffectId: soundEffectId._id
    };
  },

  pushSoundEffect: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      needClick: Boolean,
      soundEffectAudioId: String,
      volume: Number
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'soundEffect',
      comment: attributes.comment,
      needClick: attributes.needClick,
      order: -1
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      soundEffectAudioId: attributes.soundEffectAudioId,
      volume: attributes.volume,
    };

    return Meteor.call('createSoundEffectAndStoryItem', data);

  },

  insertSoundEffect: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      needClick: Boolean,
      soundEffectAudioId: String,
      volume: Number,
      order: Number
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'soundEffect',
      comment: attributes.comment,
      needClick: attributes.needClick,
      order: attributes.order
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      soundEffectAudioId: attributes.soundEffectAudioId,
      volume: attributes.volume
    };

    return Meteor.call('createSoundEffectAndStoryItem', data);

  },

  deleteSoundEffect: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    MongoCollections.SoundEffects.remove(id);
  }
});
