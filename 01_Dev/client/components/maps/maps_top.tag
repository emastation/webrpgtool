<maps-top>
  <map-submit if={isLogin}></map-submit>

  <script>
    Meteor.autorun(()=> {
      Meteor.subscribe('maps');
      Meteor.subscribe('map_textures');
      Meteor.subscribe('map_tile_types');

      this.maps = MongoCollections.Maps.find().fetch();
      self.isLogin = Meteor.user();

      this.update();
    });
  </script>
</maps-top>
