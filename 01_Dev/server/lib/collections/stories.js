Sortable.collections = ['stories'];


Meteor.methods({

  // リストの末尾に追加したい場合は、storyAttributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String,
      order: Number
    });

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
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      order: order
    });

    var storyId = Stories.insert(story);

    return {
      _id: storyId
    };
  },
  storyUpdateDueToSomeOneDeleted: function (obj) {
    check(Meteor.userId(), String);
    check(obj, Object);
    Stories.update(obj.selector, obj.modifier, obj.flg);
  }
});
