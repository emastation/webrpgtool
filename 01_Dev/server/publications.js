Meteor.publish('maps', function() {
  return Maps.find();
});

