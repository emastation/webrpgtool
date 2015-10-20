Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  createStoryScene: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      name: String,
      choices: Array,
      order: Number
    });

    var StoryScenes = MongoCollections.StoryScenes;
    var storySceneWithSameName = StoryScenes.findOne({storyId: attributes.storyId, name: attributes.name});
    if (storySceneWithSameName) {
      return {
        storySceneExists: true,
        _id: storySceneWithSameName._id
      }
    }

    if (attributes.order < 0) {
      var order = StoryScenes.find({storyId: attributes.storyId}).count();
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

    var id = StoryScenes.insert(recordObj);

    return {
      _id: id
    };
  },

  insertStoryScene: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      name: String,
      choices: Array,
      order: Number
    });

    var StoryScenes = MongoCollections.StoryScenes;
    var countStoryScenes = StoryScenes.find({storyId:attributes.storyId}).count();

    var selector = {};
    selector["order"] = {$gte: attributes.order, $lt: countStoryScenes};
    selector[StoryScenes.sortingScope] = attributes.storyId;
    var ids = _.pluck(StoryScenes.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = 1;

    selector = {_id: {$in: ids}};

    StoryScenes.update(selector, modifier, {multi: true});

    var resultInsert = Meteor.call('createStoryScene', attributes);

    if (!_.isUndefined(resultInsert.storySceneExists && resultInsert.storySceneExists === true)) {

      // Undo adjust orders
      modifier.$inc["order"] = -1;
      StoryScenes.update(selector, modifier, {multi: true});

      return resultInsert;
    }

    return resultInsert;
  },

  addStoryScene: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      name: String,
      choices: Array,
      order: Number
    });

    if (attributes.order < 0) {
      return Meteor.call('createStoryScene', attributes);
    } else {
      return Meteor.call('insertStoryScene', attributes);
    }
  },

  deleteStoryScene: function (idToDelete) {
    check(Meteor.userId(), String);
    check(idToDelete, String);

    var StoryScenes = MongoCollections.StoryScenes;
    var storySceneToDelete = StoryScenes.findOne(idToDelete);

    var countStoryScenes = StoryScenes.find({storyId: storySceneToDelete.storyId}).count();
    var selector = {};
    selector["order"] = {$gt: storySceneToDelete.order, $lt: countStoryScenes};
    selector[StoryScenes.sortingScope] = storySceneToDelete.storyId;
    var ids = _.pluck(StoryScenes.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    // 既存StoryScenesのorder更新
    StoryScenes.update(selector, modifier, {multi: true});

    // StorySceneに属しているStoryItems削除
    Meteor.call('deleteAllStoryItemsOfStoryScene', idToDelete);

    // StoryScene削除
    StoryScenes.remove(idToDelete);

  },

  /**
   * このメソッドは、あるstoryに属するすべてのstoryScenesを消す時（全部消すので、orderの再計算が必要ない）だけに使う
   */
  deleteStorySceneWithoutSort: function (idToDelete) {
    check(idToDelete, String);

    // storySceneに属しているすべてのstoryItems削除
    Meteor.call('deleteAllStoryItemsOfStoryScene', idToDelete);

    // StoryScene削除
    MongoCollections.StoryScenes.remove(idToDelete);

  },

  deleteAllStoryScenesOfStory: function(storyId) {
    check(Meteor.userId(), String);
    check(storyId, String);
    var storyScenes = MongoCollections.StoryScenes.find({storyId:storyId}).fetch();
    storyScenes.forEach(function(storyScene){
      Meteor.call('deleteStorySceneWithoutSort', storyScene._id);
    });

  }
});
