<map-texture>
  <a id={'texture_' + opts.map_texture.name} href="javascript:void(0)">
    <div data-mtid={opts.map_texture.mtId} class="control-tile"
        style="background-image: url({opts.map_texture.tooltex_url});"
        onclick={selectMapTexture}>
    </div>
  </a>

  <script>

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
