Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  storyItemInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      contentId: String,
      contentType: String,
      comment: String,
      order: Number
    });

    if (attributes.order < 0) {
      var order = StoryItems.find({storyId:attributes.storyId}).count();
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
  },

  storyItemDelete: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      id: String, 
      sortingScopeValue: String
    });

    var storyItemToDelete = StoryItems.findOne(attributes.id);

    var countStoryItems = StoryItems.find({storyId:storyItemToDelete.storyId}).count();
    var selector = {};
    selector["order"] = {$gt: storyItemToDelete.order, $lt: countStoryItems};
    selector[StoryItems.sortingScope] = attributes.sortingScopeValue;
    var ids = _.pluck(StoryItems.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    StoryItems.update(selector, modifier, {multi: true});

    StoryItems.remove(attributes.id);
    Meteor.call(storyItemToDelete.contentType +'Delete', storyItemToDelete.contentId);
  }
});
