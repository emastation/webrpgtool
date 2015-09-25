<map-edit-main-form>
  <div class="eight wide column">
    <form id="map-data-form" class="ui form">
      <div class="fields">
        <div class="field">
          <label>Title</label>
          <input name="title" id="title" type="text" value={opts.map.title} placeholder="マップのタイトルを入力してください" kl_vkbd_parsed="true" />
        </div>
        <div class="field">
          <label>横幅</label>
          <input name="width" id="width" type="number" value={opts.map.width} placeholder="マップの横幅を入力してください" kl_vkbd_parsed="true" />
        </div>
        <div class="field">
          <label>高さ</label>
          <input name="height" id="height" type="number" value={opts.map.height} placeholder="マップの高さを入力してください" kl_vkbd_parsed="true" />
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
        width: this.width.value,
        height: this.height.value,
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
  </script>
</map-edit-main-form>
