Sentences = new Mongo.Collection('sentences');

Sentences.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Sentences.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});

Meteor.methods({
  sentenceInsert: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      text: String
    });

    /*
    var sameTitleRecord = Stories.findOne({text: attributes.text});
    if (sameTitleRecord) {
      return {
        alreadyExists: true,
        _id: sameTitleRecord._id
      }
    }
    */

    var user = Meteor.user();
    var recordObj = _.extend(attributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var id = Sentences.insert(recordObj);

    return {
      _id: id
    };
  }
});
