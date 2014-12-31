Template.mapItem.helpers({
  ownMap: function() {
    return this.userId === Meteor.userId();
  }
});
