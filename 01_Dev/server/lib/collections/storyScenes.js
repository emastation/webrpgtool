Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  storySceneCreate: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      name: String,
      order: Number
    });

    if (attributes.order < 0) {
      var order = StoryScenes.find({storyId: attributes.storyId}).count();
    } else {
      var order = attributes.order
    }

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      order: order
    });

    var id = StoryScenes.insert(recordObj);

    return {
      _id: id
    };
  },

  storySceneDelete: function (idToDelete) {
    check(Meteor.userId(), String);
    check(idToDelete, String);

    var storySceneToDelete = StoryScenes.findOne(idToDelete);

    var countStoryScenes = StoryScenes.find({storyId: storySceneToDelete.storyId}).count();
    var selector = {};
    selector["order"] = {$gt: storySceneToDelete.order, $lt: countStoryScenes};
    selector[StoryScenes.sortingScope] = storySceneToDelete.storyId;
    var ids = _.pluck(StoryScenes.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    StoryScenes.update(selector, modifier, {multi: true});

    StoryScenes.remove(idToDelete);
  }
});
