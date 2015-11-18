Meteor.methods({
  createMap: function(mapAttributes) {
    check(Meteor.userId(), String);
    check(mapAttributes, {
      title: String,
      width: Number,
      height: Number,
      type_array: String,
      height_array: String,
      script_array: String,
      game_id: String
    });

    var Maps = MongoCollections.Maps;
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
