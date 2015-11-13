Meteor.methods({
  createGame: function (gameAttributes) {
    check(Meteor.userId(), String);
    check(gameAttributes, {
      title: String,
      identifier: String
    });

    var Games = MongoCollections.Games;
    var gameWithSameIdentifier = Games.findOne({title: gameAttributes.title});
    if (gameWithSameIdentifier) {
      return {
        exists: true,
        _id: gameWithSameIdentifier._id
      }
    }

    var user = Meteor.user();
    var game = _.extend(gameAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var gameId = Games.insert(game);

    return {
      _id: gameId
    };
  }
});
