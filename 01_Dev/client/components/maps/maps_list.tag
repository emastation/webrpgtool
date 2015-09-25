<maps-list>
  <map-item each={maps} map={this}></map-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('maps');
      Meteor.subscribe('map_textures');
      Meteor.subscribe('map_tile_types');
    });

    Meteor.autorun(()=> {
      this.maps = MongoCollections.Maps.find().fetch();
      this.update();
    })
  </script>
</maps-list>
