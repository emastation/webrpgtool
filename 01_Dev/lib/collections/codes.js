Codes = new Mongo.Collection('codes');

Codes.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Codes.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title', 'code').length > 0);
  }
});

Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  codeInsert: function(codeAttributes) {
    check(Meteor.userId(), String);
    check(codeAttributes, {
      title: String,
      code: String
    });

    var codeWithSameTitle = Codes.findOne({title: codeAttributes.title});
    if (codeWithSameTitle) {
      return {
        codeExists: true,
        _id: codeWithSameTitle._id
      }
    }

    var user = Meteor.user();
    var code = _.extend(codeAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var codeId = Codes.insert(code);

    return {
      _id: codeId
    };
  }
});
