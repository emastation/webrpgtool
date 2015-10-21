Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  createStoryItem: function(attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      contentId: String,
      contentType: String,
      comment: String,
      needClick: Boolean,
      order: Number
    });

    var StoryItems = MongoCollections.StoryItems;
    if (attributes.order < 0) {
      var order = StoryItems.find({sceneId:attributes.sceneId}).count();
    } else {
      var order = attributes.order
    }

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user ? user._id : '', // Fixtureから呼ばれた際には、userはnullなのでその対策
      author: user ? user.username : 'unknown',
      submitted: new Date(),
      order: order
    });

    var id = StoryItems.insert(recordObj);

    return {
      _id: id
    };
  },

  insertStoryItem: function (attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      contentId: String,
      contentType: String,
      comment: String,
      needClick: Boolean,
      order: Number
    });

    var StoryItems = MongoCollections.StoryItems;
    var countStoryItems = StoryItems.find({sceneId:attributes.sceneId}).count();

    var selector = {};
    selector["order"] = {$gte: attributes.order, $lt: countStoryItems};
    selector[StoryItems.sortingScope] = attributes.sceneId;
    var ids = _.pluck(StoryItems.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = 1;

    selector = {_id: {$in: ids}};

    StoryItems.update(selector, modifier, {multi: true});

    return Meteor.call('createStoryItem', attributes);
  },

  addStoryItem: function (attributes) {
    checkUserId(check.bind(this), String);
    check(attributes, {
      sceneId: String,
      contentId: String,
      contentType: String,
      comment: String,
      needClick: Boolean,
      order: Number
    });

    if (attributes.order < 0) {
      return Meteor.call('createStoryItem', attributes);
    } else {
      return Meteor.call('insertStoryItem', attributes);
    }
  },

  deleteStoryItem: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    var StoryItems = MongoCollections.StoryItems;
    var storyItemToDelete = StoryItems.findOne(id);

    var countStoryItems = StoryItems.find({sceneId:storyItemToDelete.sceneId}).count();
    var selector = {};
    selector["order"] = {$gt: storyItemToDelete.order, $lt: countStoryItems};
    selector[StoryItems.sortingScope] = storyItemToDelete.sceneId;
    var ids = _.pluck(StoryItems.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    StoryItems.update(selector, modifier, {multi: true});

    StoryItems.remove(id);

    var _capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    Meteor.call('delete' + _capitalize(storyItemToDelete.contentType), storyItemToDelete.contentId);
  },

  /**
   * このメソッドは、あるstorySceneに属するすべてのstoryItemsを消す時（全部消すので、orderの再計算が必要ない）だけに使う
   */
  deleteStoryItemWithoutSort: function(id) {
    check(id, String);
    var StoryItems = MongoCollections.StoryItems;
    var storyItemToDelete = StoryItems.findOne(id);

    StoryItems.remove(id);

    var _capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    Meteor.call('delete' + _capitalize(storyItemToDelete.contentType), storyItemToDelete.contentId);
  },

  deleteAllStoryItemsOfStoryScene: function(storySceneId) {
    check(Meteor.userId(), String);
    check(storySceneId, String);

    var storyItems = MongoCollections.StoryItems.find({sceneId:storySceneId}).fetch();
    storyItems.forEach(function(storyItem){
      Meteor.call('deleteStoryItemWithoutSort', storyItem._id);
    });
  }
});
