Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  characterCreate: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      identifier: String,
      name: Number,
      position: String,
      useForNovel: Boolean
    });

    var Maps = MongoCollections.Maps;
    var characterWithSameIdentifier = Maps.findOne({title: attributes.identifier});
    if (characterWithSameIdentifier) {
      return {
        characterExists: true,
        _id: characterWithSameIdentifier._id
      }
    }

    var user = Meteor.user();
    var obj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = MongoCollections.Characters.insert(obj);

    return {
      _id: id
    };
  }
});
