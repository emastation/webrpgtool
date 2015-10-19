Meteor.methods({
  createBgm: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      bgmAudioId: String,
      storyItemId: String,
      volume: Number,
      transition: String
    });

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user ? user._id : '', // Fixtureから呼ばれた際には、userはnullなのでその対策
      author: user ? user.username : 'unknown',
      submitted: new Date()
    });

    var id = MongoCollections.Backgrounds.insert(recordObj);

    return {
      _id: id
    };
  },

  createBgmAndStoryItem: function(data) {
    check(data, {
      storyItemAttributes: Object,
      bgmAudioId: String,
      volume: Number,
      transition: String
    });

    var storyItemId = Meteor.call('addStoryItem', data.storyItemAttributes);

    var bgmAttributes = {
      bgmAudioId: data.bgmAudioId,
      storyItemId: storyItemId._id,
    };

    var bgmId = Meteor.call('createBgm', bgmAttributes);

    var storyItemAttributes = {
      contentId: bgmId._id
    };

    MongoCollections.StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      bgmId: bgmId._id
    };
  },

  pushBgm: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      bgmAudioId: String,
      volume: Number,
      transition: String
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'bgm',
      comment: attributes.comment,
      order: -1
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      bgmAudioId: attributes.bgmAudioId,
      volume: Number,
      transition: String
    };

    return Meteor.call('createBgmAndStoryItem', data);

  },

  insertBgm: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      bgmAudioId: String,
      volume: Number,
      transition: String,
      order: Number
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'bgm',
      comment: attributes.comment,
      order: attributes.order
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      bgmAudioId: attributes.bgmAudioId,
      volume: Number,
      transition: String
    };

    return Meteor.call('createBgmAndStoryItem', data);

  },

  deleteBgm: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    MongoCollections.Bgms.remove(id);
  }
});
