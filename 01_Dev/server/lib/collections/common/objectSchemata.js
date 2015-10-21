Meteor.methods({
  createObjectSchema: function(attribute) {
    check(Meteor.userId(), String);
    check(attribute, {
      name: String,
      identifier: String,
      extends: String,
      attributes: Array
    });

    var ObjectSchemata = MongoCollections.ObjectSchemata;

    // check duplicated identifier
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
  },

  updateObjectSchema: function(obj) {

    var ObjectSchemata = MongoCollections.ObjectSchemata;

    // if obj has 'identiifer', check duplicated identiifer
    if (_.has(obj.objectSchema,'identifier')); {
      var sameIdentifierObjectSchema = ObjectSchemata.findOne({identifier: obj.objectSchema.identifier});
      if (sameIdentifierObjectSchema) {
        return {
          exists: true,
          _id: sameIdentifierObjectSchema._id
        }
      }
    }

    ObjectSchemata.update(obj.objectSchemaId, {$set: obj.objectSchema}, function(error) {
      if (error) {
        return {
          error: error.reason
        };
      }
    });
  },

  updateObjectSchemaAttributes: function(obj) {
    var attributes = obj.attributes
    var objectSchema = {
      attributes: attributes
    };

    // check duplicated identifier of attributes
    for(let i=0; i<attributes.length; i++) {
      for(let j=i+1; j<attributes.length; j++) {
        if (attributes[i].identifier === attributes[j].identifier) {
          return 'duplicated Attribute Identifier.';
        }
      }
    }

    MongoCollections.ObjectSchemata.update(obj.objectSchemaId, {$set: objectSchema}, function(error) {
      if (error) {
        return error.reason;
      }
    });
  }
});
