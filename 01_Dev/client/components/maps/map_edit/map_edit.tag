<map-edit>
  <div class="ui grid">
    <map-edit-main-form map={map}></map-edit-main-form>
    <map-edit-manipulate-panel mapTextures={this.data.mapTextures} mapTileTypes={this.data.mapTileTypes}
                            heightTileDivStyleStrArray={this.data.heightTileDivStyleStrArray}></map-edit-manipulate-panel>
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
      this.getMap();
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
