var _global = (this || 0).self || global;
_global.MongoCollections = _global.MongoCollections || {};
_global.MongoCollections.Maps = new Mongo.Collection('maps');

_global.MongoCollections.Maps.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

_global.MongoCollections.Maps.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title', 'width', 'height', 'type_array', 'height_array', 'script_array').length > 0);
  }
});

Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  mapCreate: function(mapAttributes) {
    check(Meteor.userId(), String);
    check(mapAttributes, {
      title: String,
      width: Number,
      height: Number,
      type_array: String,
      height_array: String,
      script_array: String
    });

    var Maps = _global.MongoCollections.Maps;
    var mapWithSameTitle = Maps.findOne({title: mapAttributes.title});
    if (mapWithSameTitle) {
      return {
        mapExists: true,
        _id: mapWithSameTitle._id
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
