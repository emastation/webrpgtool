Meteor.methods({

  // リストの末尾に追加したい場合は、storyAttributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  createStory: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String,
      order: Number
    });

    var Stories = MongoCollections.Stories;
    var storyWithSameTitle = Stories.findOne({title: storyAttributes.title});
    if (storyWithSameTitle) {
      return {
        storyExists: true,
        _id: storyWithSameTitle._id
      }
    }

    if (storyAttributes.order < 0) {
      var order = Stories.find().count();
    } else {
      var order = storyAttributes.order
    }

    var user = Meteor.user();
    var story = _.extend(storyAttributes, {
      userId: user ? user._id : '', // Fixtureから呼ばれた際には、userはnullなのでその対策
      author: user ? user.username : 'unknown',
      submitted: new Date(),
      order: order
    });

    var storyId = Stories.insert(story);

    return {
      _id: storyId
    };
  },

  insertStory: function (story) {
    check(Meteor.userId(), String);
    check(story, {
      title: String,
      order: Number
    });

    var Stories = MongoCollections.Stories;
    var countStories = Stories.find().count();

    var selector = {};
    selector["order"] = {$gte: story.order, $lt: countStories};
    var ids = _.pluck(Stories.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = 1;

    selector = {_id: {$in: ids}};

    Stories.update(selector, modifier, {multi: true});

    var resultInsert = Meteor.call('createStory', story);
    if (!_.isUndefined(resultInsert.storyExists && resultInsert.storyExists === true)) {

      // Undo adjust orders
      modifier.$inc["order"] = -1;
      Stories.update(selector, modifier, {multi: true});

      return resultInsert;
    }

    return resultInsert;
  },


  deleteStory: function (idToDelete) {
    check(Meteor.userId(), String);
    check(idToDelete, String);

    var Stories = MongoCollections.Stories;
    var storyToDelete = Stories.findOne(idToDelete);

    var countStories = Stories.find().count();
    var selector = {};
    selector["order"] = {$gt: storyToDelete.order, $lt: countStories};
    var ids = _.pluck(Stories.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    // 既存Storiesのorder更新
    Stories.update(selector, modifier, {multi: true});

    // storyに属しているすべてのstoryScenesの削除
    Meteor.call('allStoryScenesOfStoryDelete', idToDelete);

    Stories.remove(idToDelete);
  }
});
