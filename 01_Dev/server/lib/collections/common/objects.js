Meteor.methods({
  createObject: function(attribute) {
    check(Meteor.userId(), String);
    check(attribute, {
      identifier: String,
      attributes: Array
    });

    var Objects = MongoCollections.Objects;

    // check duplicated identifier
    var sameIdentifierObject = Objects.findOne({identifier: attribute.identifier});
    if (sameIdentifierObject) {
      return {
        exists: true,
        _id: sameIdentifierObject._id
      }
    }

    var user = Meteor.user();
    var map = _.extend(attribute, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = Objects.insert(map);

    return {
      _id: id
    };
  }
});
