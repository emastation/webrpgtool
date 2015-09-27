<map-edit-manipulate-panel>
  <div class="eight wide column">
    <div class="fields">
      <div class="field">
        <label>テクスチャ</label>
        <div class="clearfix">
          <map-texture each={opts.map_textures} map_texture={this} />
        </div>
      </div>
    </div>
    <div class="fields">
      <div class="field">
        <label>タイルタイプ</label>
        <div class="clearfix">
          <map-tile-type each={opts.map_tile_types} map_tile_type={this} />
        </div>
      </div>
    </div>
    <div class="fields">
      <div class="field">
        <label>床の高さ</label>
        <div class="clearfix">
          { this.props.heightTileDivStyleStrArray.map(this.renderFloorHeightTileDivStyleStrArray) }
        </div>
      </div>
    </div>
    <div class="fields">
      <div class="field">
        <label>天井の高さ</label>
        <div class="clearfix">
          { this.props.heightTileDivStyleStrArray.map(this.renderCeilingHeightTileDivStyleStrArray) }
        </div>
      </div>
    </div>
  </div>

  <script>

  </script>
</map-edit-manipulate-panel>
