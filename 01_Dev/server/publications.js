Meteor.publish('maps', function() {
  return Maps.find();
});

Meteor.publish('map_textures', function() {
  return MapTextures.find();
});

Meteor.publish('map_tile_types', function() {
  return MapTileTypes.find();
});

Meteor.publish('codes', function() {
  return Codes.find();
});

Meteor.publish('stories', function() {
  return Stories.find();
});

Meteor.publish('storyScenes', function() {
  return StoryScenes.find();
});

Meteor.publish('storyItems', function() {
  return StoryItems.find();
});

Meteor.publish('sentences', function() {
  return Sentences.find();
});

Meteor.publish('characters', function() {
  return Characters.find();
});

Meteor.publish('characterImages', function() {
  return CharacterImages.find();
});

Meteor.publish('uiTables', function() {
  return UiTables.find();
});
