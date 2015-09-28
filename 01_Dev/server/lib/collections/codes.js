Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  createCode: function (codeAttributes) {
    check(Meteor.userId(), String);
    check(codeAttributes, {
      name: String,
      identifier: String,
      javascript: String
    });

    var Codes = MongoCollections.Codes;
    var codeWithSameTitle = Codes.findOne({name: codeAttributes.name});
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
  },
  updateCode: function (obj) {
    check(Meteor.userId(), String);
    check(obj, Object);
    check(obj.codeAttributes, {
      name: String,
      identifier: String,
      javascript: String,
      userId: String,
      author: String,
      submitted: Date
    });

    MongoCollections.Codes.update(obj.codeId, {$set: obj.codeAttributes}, function (error) {
      return error;
    });

    return {
      _id: obj.codeId
    };
  },

  deleteCode: function (idToDelete) {
    check(Meteor.userId(), String);
    check(idToDelete, String);

    MongoCollections.Codes.remove(idToDelete);
  },

  excecuteJailedCode: function (api) {
    check(api, Object);

    var jailed = Meteor.npmRequire('jailed');

    var code = "application.remote.alert('Hello from the plugin!');";

    var api = {
      alert: console.log
    };

    var plugin = new jailed.DynamicPlugin(code, api);

  }
});
