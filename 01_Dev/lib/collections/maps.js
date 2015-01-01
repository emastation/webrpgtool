Maps = new Mongo.Collection('maps');

Maps.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Maps.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title', 'width', 'height').length > 0);
  }
});

Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  mapInsert: function(mapAttributes) {
    check(Meteor.userId(), String);
    check(mapAttributes, {
      title: String,
      width: Number,
      height: Number
    });

    var postWithSameTitle = Maps.findOne({title: mapAttributes.title});
    if (postWithSameTitle) {
      return {
        postExists: true,
        _id: postWithSameTitle._id
      }
    }

    var user = Meteor.user();
    var map = _.extend(mapAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var mapId = Maps.insert(map);

    return {
      _id: mapId
    };
  }
});

