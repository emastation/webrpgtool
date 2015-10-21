Meteor.publish('maps', function() {
  return MongoCollections.Maps.find();
});

Meteor.publish('map_textures', function() {
  return MongoCollections.MapTextures.find();
});

Meteor.publish('map_tile_types', function() {
  return MongoCollections.MapTileTypes.find();
});

Meteor.publish('codes', function() {
  return MongoCollections.Codes.find();
});

Meteor.publish('uiScreens', function() {
  return MongoCollections.UiScreens.find();
});

Meteor.publish('uiTables', function() {
  return MongoCollections.UiTables.find();
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

Meteor.publish('backgrounds', function() {
  return MongoCollections.Backgrounds.find();
});

Meteor.publish('backgroundImages', function() {
  return MongoCollections.BackgroundImages.find();
});

Meteor.publish('bgms', function() {
  return MongoCollections.Bgms.find();
});

Meteor.publish('bgmAudios', function() {
  return MongoCollections.BgmAudios.find();
});

Meteor.publish('objectSchemata', function() {
  return MongoCollections.ObjectSchemata.find();
});

Meteor.publish('objects', function() {
  return MongoCollections.Objects.find();
});
