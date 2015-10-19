Meteor.autorun(function() {
  Meteor.subscribe('backgroundImages', {
    onReady: ()=> {
      window.wrtBackgroundImages = MongoCollections.BackgroundImages.find().fetch();
    }
  });
  Meteor.subscribe('bgmAudios', {
    onReady: ()=> {
      window.wrtBgmAudios = MongoCollections.BgmAudios.find().fetch();
    }
  });
});
