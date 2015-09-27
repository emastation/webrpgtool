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
          <height-tile-div-style-str-array each={opts.height_tile_div_style_str_array} model={this} floor_or_ceiling="floor"/>
        </div>
      </div>
    </div>
    <div class="fields">
      <div class="field">
        <label>天井の高さ</label>
        <div class="clearfix">
          <height-tile-div-style-str-array each={opts.height_tile_div_style_str_array} model={this} floor_or_ceiling="ceiling"/>
        </div>
      </div>
    </div>
  </div>
</map-edit-manipulate-panel>
