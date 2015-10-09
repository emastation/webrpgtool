Meteor.autorun(function() {
  Meteor.subscribe('backgroundImages', {
    onReady: ()=> {
      window.wrtBackgroundImages = MongoCollections.BackgroundImages.find().fetch();
    }
  });
});
