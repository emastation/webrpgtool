Meteor.methods({
  createObject: function(attribute) {
    check(Meteor.userId(), String);
    check(attribute, {
      identifier: String,
      schema_identifier: String,
      game_id: String,
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
  },

  updateObjectIdentifier: function(obj) {

    var Objects = MongoCollections.Objects;

    var attribute = {
      identifier: obj.objectIdentifier
    }

    var object = Objects.findOne(obj.objectId);
    var backupAttributes = {
      identifier: object.identifier
    }

    // update
    Objects.update(obj.objectId, {$set: attribute});

    // check duplication
    var sameIdentifierObjects = Objects.find({identifier: obj.objectIdentifier}).fetch();
    var uniqedSameIdentifierObjects = _.uniq(sameIdentifierObjects, false, function(object) {
      return object.schema_identifier;
    });

    if (sameIdentifierObjects.length !== uniqedSameIdentifierObjects.length) {

      // rollback
      Objects.update(obj.objectId, {$set: backupAttributes}, function(error) {
        if (error) {
          return {
            error: error.reason
          };
        }
      });

      return {
        exists: true
      }
    }

  },

  updateObjectAttributes: function(obj) {

    var Objects = MongoCollections.Objects;

    var attribute = {
      attributes: obj.objectAttributes
    }

    // update
    Objects.update(obj.objectId, {$set: attribute});

  }
});
