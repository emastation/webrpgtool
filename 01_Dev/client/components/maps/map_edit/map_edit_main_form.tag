<map-edit-main-form>
  <div class="eight wide column">
    <form id="map-data-form" class="ui form segment">
      <div class="fields">
        <div class="field">
          <label>Title</label>
          <input name="title" id="title" type="text" value={opts.map.title} placeholder="マップのタイトルを入力してください" kl_vkbd_parsed="true" />
        </div>
        <div class="field">
          <label>横幅</label>
          <input name="width" id="width" type="number" value={opts.map.width}
            placeholder="マップの横幅を入力してください" kl_vkbd_parsed="true" onchange={changeMapWidth} />
        </div>
        <div class="field">
          <label>高さ</label>
          <input name="height" id="height" type="number" value={opts.map.height}
            placeholder="マップの高さを入力してください" kl_vkbd_parsed="true" onchange={changeMapHeight} />
        </div>
      </div>
      <div class="fields">
        <div class="field">
          <label class="control-label" htmlFor="type_array">タイルタイプ文字列</label>
          <textarea name="type_array" id="type_array" value={opts.map.type_array}  />
        </div>
        <div class="field">
          <label class="control-label" htmlFor="height_array">タイル高さ文字列</label>
          <textarea name="height_array" id="height_array" value={opts.map.height_array} />
        </div>
        <div class="field">
          <label class="control-label" htmlFor="script_array">スクリプト文字列</label>
          <textarea name="script_array" id="script_array" value={opts.map.script_array} />
        </div>
      </div>
      <button id="map-data-submit" class="ui blue button" onclick={saveMap}>登録</button>
      <button id="map-data-rollback" class="ui green button" onclick={resetMap}>元に戻す</button>
      <button id="map-data-reload" class="ui yellow button" onclick={reloadMap}>文字列データをマップ反映</button>
      <button id="map-data-delete" class="ui red button" onclick={deleteMap}>削除する</button>
    </form>
  </div>

  <script>
    saveMap(e) {
      e.preventDefault();

      if (this.title.value === '') {
        alert('タイトルを空にはできません。')
        return;
      }

      var currentMapId = opts.map._id;
      var mapProperties = {
        title: this.title.value,
        width: parseInt(this.width.value),
        height: parseInt(this.height.value),
        type_array: this.type_array.value,
        height_array: this.height_array.value,
        script_array: this.script_array.value
      };

      MongoCollections.Maps.update(currentMapId, {$set: mapProperties}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        } else {
          window.location = '#map/'+currentMapId;
        }
      });
    }

    deleteMap(e) {
      e.preventDefault();

      var currentMapId = opts.map._id;
      MongoCollections.Maps.remove(currentMapId);
      window.location = '#maps';
    }

    reloadCurrentMapDataFromMapManager() {
      var map = WRT.map.mapManager.getMap();
      this.type_array.value = map.type_array,
      this.height_array.value = map.height_array,
      this.script_array.value = map.script_array
    }

    resetMap(e) {
      e.preventDefault();

      this.title.value = opts.map.title;
      this.width.value = opts.map.width;
      this.height.value = opts.map.height;
      this.type_array.value = opts.map.type_array;
      this.height_array.value = opts.map.height_array;
      this.script_array.value = opts.map.script_array;

      WRT.map.mapManager.setMap(opts.map);
      WRT.map.mapManager.reloadMap();

      // 赤い四角の選択を、テクスチャ０番目に戻す
      mapEditUpdateSelectedClass($("a[id^='texture_']>div").get(0));
    }

    changeMapWidth(e) {
      var newWidth = parseInt(e.target.value, 10);
      WRT.map.mapManager.setMapWidth(newWidth);
    }

    changeMapHeight(e) {
      var newHeight = parseInt(e.target.value, 10);
      WRT.map.mapManager.setMapHeight(newHeight);
    }

    this.on('updated', ()=>{
      if (!_.isUndefined(WRT.map.mapManager) && _.isNull(WRT.map.mapManager.callbackOnChangeMap)) {
        WRT.map.mapManager.callbackOnChangeMap = this.reloadCurrentMapDataFromMapManager;
      }
    });

  </script>
</map-edit-main-form>
