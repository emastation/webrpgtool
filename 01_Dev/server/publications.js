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
