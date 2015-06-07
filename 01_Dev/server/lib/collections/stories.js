Sortable.collections = ['stories'];


Meteor.methods({
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String
    });

    var storyWithSameTitle = Stories.findOne({title: storyAttributes.title});
    if (storyWithSameTitle) {
      return {
        storyExists: true,
        _id: storyWithSameTitle._id
      }
    }

    var count = Stories.find().count();

    var user = Meteor.user();
    var story = _.extend(storyAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      order: count
    });

    var storyId = Stories.insert(story);

    return {
      _id: storyId
    };
  }
});
