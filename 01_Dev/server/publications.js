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
