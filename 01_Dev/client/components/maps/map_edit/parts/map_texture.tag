<map-texture>
  <a id={'texture_' + opts.map_texture.name} href="javascript:void(0)">
    <div data-mtid={opts.map_texture.mtId} class="control-tile"
        style="background-image: url({opts.map_texture.tooltex_url});"
        onclick={selectMapTexture}>
    </div>
  </a>


  <script>
    this.on('mount', ()=>{
      setTimeout(function(){
        $($("a[id^='texture_']>div").get(0)).addClass('selected'); // select texture of index 0 at first
      }, 0)
    });

    selectMapTexture(e) {
      e.preventDefault();

      WRT.map.mapManager.switchMapLayer(0);
      WRT.map.mapManager.setCurrentTileIndex($(e.target).data('mtid'));

      mapEditUpdateSelectedClass(e.target);
    }
  </script>


  <style scoped>
    .control-tile {
      float: left;
      width: 64px;
      height: 64px;
    }

    .control-tile.selected {
      border: solid 2px red;
    }

  </style>
</map-texture>
