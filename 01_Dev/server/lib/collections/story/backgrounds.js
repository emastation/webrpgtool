Meteor.methods({
  createBackground: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      backgroundImageId: String,
      storyItemId: String
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

  createBackgroundAndStoryItem: function(data) {
    check(data, {
      storyItemAttributes: Object,
      backgroundImageId: String,
    });

    var storyItemId = Meteor.call('addStoryItem', data.storyItemAttributes);

    var backgroundAttributes = {
      backgroundImageId: data.backgroundImageId,
      storyItemId: storyItemId._id,
    };

    var backgroundId = Meteor.call('createBackground', backgroundAttributes);

    var storyItemAttributes = {
      contentId: backgroundId._id
    };

    MongoCollections.StoryItems.update(storyItemId._id, {$set: storyItemAttributes});

    return {
      storyItemId: storyItemId._id,
      backgroundId: backgroundId._id
    };
  },

  pushBackground: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      backgroundImageId: String,
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'background',
      comment: attributes.comment,
      order: -1
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      backgroundImageId: attributes.backgroundImageId,
    };

    return Meteor.call('createBackgroundAndStoryItem', data);

  },

  insertBackground: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      sceneId: String,
      comment: String,
      backgroundImageId: String,
      order: Number
    });

    var storyItemAttributes = {
      sceneId: attributes.sceneId,
      contentId: '',
      contentType: 'background',
      comment: attributes.comment,
      order: attributes.order
    };

    var data = {
      storyItemAttributes: storyItemAttributes,
      backgroundImageId: attributes.text,
    };

    return Meteor.call('createBackgroundAndStoryItem', data);

  },

  deleteBackground: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    MongoCollections.Background.remove(id);
  }
});
