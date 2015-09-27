<map-tile-type>
  <a id={'tiletype_' + opts.map_tile_type.name} href="javascript:void(0)">
    <div data-mttid={opts.map_tile_type.mttId} class="control-tile"
         style="background-image: url({opts.map_tile_type.image_url});"
         onClick={selectMapTileType}>
    </div>
  </a>

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
</map-tile-type>
