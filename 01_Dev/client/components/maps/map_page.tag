<map-page>
  <map-item map={map} game_id={gameId} />
  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.getMap = ()=> {
      if (opts.map_id) {
        this.map = MongoCollections.Maps.findOne({_id: opts.map_id});
        this.update();
      }
    }

    this.on('mount', ()=>{
      Meteor.subscribe('maps', {
        onReady: ()=>{
          this.getMap();
        }
      });
      Meteor.subscribe('map_textures');
      Meteor.subscribe('map_tile_types');
    });

    this.on('update', ()=>{
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.getMap();
    });
  </script>
</map-page>
