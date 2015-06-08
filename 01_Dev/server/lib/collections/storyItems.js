Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  storyItemInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      contentId: String,
      comment: String,
      order: Number
    });

    if (attributes.order < 0) {
      var order = StoryItems.find().count();
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

    var id = StoryItems.insert(recordObj);

    return {
      _id: id
    };
  }
});
