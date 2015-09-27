<height-tile-div-style-str-array>
  <a id="{opts.floor_or_ceiling}height_{opts.model.hid}" href="javascript:void(0)">
    <div data-hid={opts.model.hid} class="control-tile-half"
         style="background-image: url({opts.model.heightTileUrl}); background-position: -{opts.model.offset}px 0px;"
         onclick={selectHeight}>
    </div>
  </a>

  <script>
    selectHeight(e) {
      e.preventDefault();

      if (opts.floor_or_ceiling === 'floor') {
        var layer = 2;
      } else if (opts.floor_or_ceiling === 'ceiling') {
        var layer = 3;
      }

      WRT.map.mapManager.switchMapLayer(layer);
      WRT.map.mapManager.setCurrentTileIndex($(e.target).data('hid'));

      mapEditUpdateSelectedClass(e.target);
    }
  </script>

  <style scoped>
    .control-tile-half {
      float: left;
      width: 32px;
      height: 32px;
      background-size: 672px 32px;
    }

    .control-tile-half.selected {
      border: solid 2px red;
    }
  </style>

</height-tile-div-style-str-array>
