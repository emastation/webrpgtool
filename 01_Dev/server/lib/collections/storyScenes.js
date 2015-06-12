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
  }
});
