Meteor.methods({
  // リストの末尾に追加したい場合は、attributes.orderにマイナスの値を渡すこと。途中に入れる場合は、適切なorder値を指定すること。
  storyItemCreate: function(attributes) {
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

  storyItemInsert: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      contentId: String,
      contentType: String,
      comment: String,
      order: Number
    });

    var countStoryItems = StoryItems.find({storyId:attributes.storyId}).count();

    var selector = {};
    selector["order"] = {$gte: attributes.order, $lt: countStoryItems};
    selector[StoryItems.sortingScope] = attributes.storyId;
    var ids = _.pluck(StoryItems.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = 1;

    selector = {_id: {$in: ids}};

    StoryItems.update(selector, modifier, {multi: true});

    return Meteor.call('storyItemCreate', attributes);
  },

  storyItemAdd: function (attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      storyId: String,
      contentId: String,
      contentType: String,
      comment: String,
      order: Number
    });

    if (attributes.order < 0) {
      return Meteor.call('storyItemCreate', attributes);
    } else {
      return Meteor.call('storyItemInsert', attributes);
    }
  },

  storyItemDelete: function(id) {
    check(Meteor.userId(), String);
    check(id, String);

    var storyItemToDelete = StoryItems.findOne(id);

    var countStoryItems = StoryItems.find({storyId:storyItemToDelete.storyId}).count();
    var selector = {};
    selector["order"] = {$gt: storyItemToDelete.order, $lt: countStoryItems};
    selector[StoryItems.sortingScope] = storyItemToDelete.storyId;
    var ids = _.pluck(StoryItems.find(selector, {fields: {_id: 1}}).fetch(), '_id');

    var modifier = {$inc: {}};
    modifier.$inc["order"] = -1;

    selector = {_id: {$in: ids}};

    StoryItems.update(selector, modifier, {multi: true});

    StoryItems.remove(id);
    Meteor.call(storyItemToDelete.contentType +'Delete', storyItemToDelete.contentId);
  }
});
