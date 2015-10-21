Meteor.methods({
  createObjectSchema: function(attribute) {
    check(Meteor.userId(), String);
    check(attribute, {
      name: String,
      identifier: String,
      extends: String,
      attributes: Object
    });

    var ObjectSchemata = MongoCollections.ObjectSchemata;
    var sameIdentifierObjectSchema = ObjectSchemata.findOne({identifier: attribute.identifier});
    if (sameIdentifierObjectSchema) {
      return {
        exists: true,
        _id: sameIdentifierObjectSchema._id
      }
    }

    var user = Meteor.user();
    var map = _.extend(attribute, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = ObjectSchemata.insert(map);

    return {
      _id: id
    };
  }
});
