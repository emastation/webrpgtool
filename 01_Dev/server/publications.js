Meteor.publish('maps', function() {
  return Maps.find();
});

Meteor.publish('map_textures', function() {
  return MongoCollections.MapTextures.find();
});

Meteor.publish('map_tile_types', function() {
  return MapTileTypes.find();
});

Meteor.publish('codes', function() {
  return MongoCollections.Codes.find();
});

Meteor.publish('stories', function() {
  return MongoCollections.Stories.find();
});

Meteor.publish('storyScenes', function() {
  return MongoCollections.StoryScenes.find();
});

Meteor.publish('storyItems', function() {
  return MongoCollections.StoryItems.find();
});

Meteor.publish('sentences', function() {
  return MongoCollections.Sentences.find();
});

Meteor.publish('characters', function() {
  return MongoCollections.Characters.find();
});

Meteor.publish('characterImages', function() {
  return MongoCollections.CharacterImages.find();
});

Meteor.publish('uiTables', function() {
  return MongoCollections.UiTables.find();
});
