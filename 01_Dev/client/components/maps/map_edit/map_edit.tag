<map-edit>
  <div class="ui grid">
    <map-edit-main-form map={map}></map-edit-main-form>
    <map-edit-manipulate-panel map={map} map_textures={mapTextures} map_tile_types={mapTileTypes}
                            height_tile_div_style_str_array={heightTileDivStyleStrArray}></map-edit-manipulate-panel>
    <div class="eight wide column"></div>
    <map-edit-script-panel codes={this.data.codes}></map-edit-script-panel>
  </div>
  <div id="map-container">
    <canvas id="world" />
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.getMap = ()=> {
      if (opts.map_id) {
        this.map = MongoCollections.Maps.findOne({_id: opts.map_id});
        this.update();
      }
    }

    this.getMapTextures = ()=> {
      this.mapTextures = MongoCollections.MapTextures.find().fetch();
      this.update();
    }

    this.getMapTileTypes = ()=> {
      this.mapTileTypes = MongoCollections.MapTileTypes.find().fetch();
      this.update();
    }

    this.on('mount', ()=>{
      Meteor.subscribe('maps', {
        onReady: ()=>{
          this.getMap();
        }
      });
      Meteor.subscribe('map_textures', {
        onReady: ()=>{
          this.getMapTextures();
        }
      });
      Meteor.subscribe('map_tile_types', {
        onReady: ()=>{
          this.getMapTileTypes();
        }
      });
    });

    this.on('update', ()=>{
      this.getMap();
      this.getMapTextures();
      this.getMapTileTypes();
    });

  </script>

  <style scoped>
    :scope {
      position: relative;
      top: 20px;
      left: 10px;
    }
  </style>
</map-edit>
