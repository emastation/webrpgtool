Meteor.publish('maps', function() {
  return MongoCollections.Maps.find();
});

Meteor.publish('map_textures', function() {
  return MongoCollections.MapTextures.find();
});

Meteor.publish('map_tile_types', function() {
  return MongoCollections.MapTileTypes.find();
});
