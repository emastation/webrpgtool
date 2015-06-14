CharacterImages = new Mongo.Collection('characterImages');

CharacterImages.allow({
  update: function(userId, post) { return true; },
  remove: function(userId, post) { return true; } //ownsDocument(userId, post); }
});
