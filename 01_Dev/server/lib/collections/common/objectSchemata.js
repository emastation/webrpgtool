Meteor.methods({
  createObjectSchema: function(attribute) {
    check(Meteor.userId(), String);
    check(attribute, {
      name: String,
      identifier: String,
      game_id: String,
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
    var data = {
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

    // check dupllicated identifeir of attribute.options
    for(let k=0; k<attributes.length; k++) {
      let options = attributes[k].options;
      for(let i=0; i<options.length; i++) {
        for(let j=i+1; j<options.length; j++) {
          if (options[i].identifier === options[j].identifier) {
            return 'duplicated Option Identifier.';
          }
        }
      }
    };


    var objectSchema = MongoCollections.ObjectSchemata.findOne(obj.objectSchemaId);
    var objects = MongoCollections.Objects.find({schema_identifier: objectSchema.identifier}).fetch();

    if (objectSchema.attributes.length === data.attributes.length) {
      var doConvert = true;

      // change the object.attribute.identifier if you change any objectSchama.attribute.identifier.
      var matchIdentifers = [];
      data.attributes.forEach(function(newAttribute){
        var resultArray = _.filter(objectSchema.attributes, function(currentAttribute){
          if (newAttribute.identifier === currentAttribute.identifier) {
            matchIdentifers.push(newAttribute.identifier);
          }
          return newAttribute.identifier === currentAttribute.identifier;
        });
      });
      var currentIdentifiers = _.map(objectSchema.attributes, function(currentAttribute) {
        return currentAttribute.identifier;
      });
      var newIdentifiers = _.map(data.attributes, function(newAttribute) {
        return newAttribute.identifier;
      });
      var currentDiffArray = lodash.xor(matchIdentifers, currentIdentifiers);
      var newDiffArray = lodash.xor(matchIdentifers, newIdentifiers);
      if (currentDiffArray.length !== 0) {
        var changedCurrentIdentifier = currentDiffArray[0];
        var changedNewIdentifier = newDiffArray[0];
        objects.forEach(function(object) {
          var index = lodash.findIndex(object.attributes, {identifier: changedCurrentIdentifier});
          object.attributes[index].identifier = changedNewIdentifier;
          var attribute = {
            objectId: object._id,
            objectAttributes: object.attributes
          };
          Meteor.call('updateObjectAttributes', attribute);
        });
        doConvert = false;
      }

      if (doConvert) {
        // convert the object.attribute.value if you change any objectSchema.attribute.type.
        objectSchema.attributes.forEach(function(currentAttribute){
          data.attributes.forEach(function(newAttribute){
            if (currentAttribute.identifier === newAttribute.identifier) {
              objects.forEach(function(object){
                var index = lodash.findIndex(object.attributes, {identifier: newAttribute.identifier});
                if ((currentAttribute.type === 'number' || currentAttribute.type === 'boolean') && newAttribute.type === 'string') {
                  object.attributes[index].value = object.attributes[index].value.toString(10);
                } else if (currentAttribute.type === 'boolean' && newAttribute.type === 'number') {
                  object.attributes[index].value = Number(object.attributes[index].value);
                } else if ((currentAttribute.type === 'number' || currentAttribute.type === 'string' || currentAttribute.type === 'select')
                            && newAttribute.type === 'boolean') {
                  object.attributes[index].value = Boolean(object.attributes[index].value);
                } else if ((currentAttribute.type === 'string' || currentAttribute.type === 'select') && newAttribute.type === 'number') {
                  var convertedVal = parseInt(object.attributes[index].value, 10);
                  object.attributes[index].value = _.isNaN(convertedVal) ? 0 : convertedVal;
                } else if (currentAttribute.type !== 'select' && newAttribute.type === 'select') {
                  object.attributes[index].value = newAttribute.options[0] ? newAttribute.options[0].identifier : '';
                } else if (currentAttribute.type === 'select' && newAttribute.type === 'string') {
                  // no need to convert
                }

                var attribute = {
                  objectId: object._id,
                  objectAttributes: object.attributes
                };
                Meteor.call('updateObjectAttributes', attribute);

              });

              return;
            }
          });
        });
      }
    } else if (objectSchema.attributes.length < data.attributes.length) {
      // if added a new attribute to objectSchema, add the new attribute initial value to objects.
      var initValue = function(type, attributeOfNewObjectSchama) {
        if (type === 'string') {
          return 'foo';
        } else if (type === 'number') {
          return 0;
        } else if (type === 'boolean') {
          return true;
        } else if (type === 'select') {
          return attributeOfNewObjectSchama.options[0] ? attributeOfNewObjectSchama.options[0].identifier : '';
        }
      };
      data.attributes.forEach(function(newAttribute) {
        var resultArray = lodash.filter(objectSchema.attributes, function(currentAttribute){
          return currentAttribute.identifier === newAttribute.identifier;
        });
        if (resultArray.length === 0) {
          objects.forEach(function(object) {
            object.attributes.push({
              identifier: newAttribute.identifier,
              value: initValue(newAttribute.type, newAttribute)
            });

            var attribute = {
              objectId: object._id,
              objectAttributes: object.attributes
            };
            Meteor.call('updateObjectAttributes', attribute);
          });
        }
      });
    } else if (objectSchema.attributes.length > data.attributes.length) {
      // if removed a attribute from objectSchema, remove the attribute value from objects.
      objectSchema.attributes.forEach(function(currentAttribute) {
        var resultArray = lodash.filter(data.attributes, function(newAttribute){
          return currentAttribute.identifier === newAttribute.identifier;
        });
        if (resultArray.length === 0) {
          objects.forEach(function(object) {
            lodash.remove(object.attributes, function(attribute) {
              return attribute.identifier === currentAttribute.identifier;
            });

            var attribute = {
              objectId: object._id,
              objectAttributes: object.attributes
            };
            Meteor.call('updateObjectAttributes', attribute);
          });
        }
      });
    }

    MongoCollections.ObjectSchemata.update(obj.objectSchemaId, {$set: data}, function(error) {
      if (error) {
        return error.reason;
      }
    });
  }
});
