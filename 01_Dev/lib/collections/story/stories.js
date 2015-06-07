Stories = new Mongo.Collection('stories');

Stories.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
/*
Stories.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});
*/
