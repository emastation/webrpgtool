<map-submit>
  <div class="ui segment">
    <form id="map-form" class="ui form" onsubmit={submitNewMap}>
      <div class="field">
        <label>タイトル</label>
        <input name="title" id="title" type="text" placeholder="追加したいマップのタイトルを入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <input type="submit" id="map-submit" class="ui button" value="追加" />
    </form>
  </div>

  <script>
    submitNewMap(e) {
      e.preventDefault();

      if (this.title.value === '') {
        alert('タイトルを入力してください。');
        return;
      }

      var map = {
        title: this.title.value,
        width: 5,
        height: 5,
        type_array:"1 N,1 W,1 N,1 W,1 W\n" +
        "1 N,1 W,1 N,1 W,1 W\n" +
        "1 N,1 N,1 N,1 N,1 N\n" +
        "1 W,1 W,1 N,1 W,1 W\n" +
        "1 W,1 W,1 N,1 W,1 W\n",
        height_array:"0 1,0 1,0 1,0 1,0 1\n" +
        "0 1,0 1,0 1,0 1,0 1\n" +
        "0 1,0 1,0 1,0 1,0 1\n" +
        "0 1,0 1,0 1,0 1,0 1\n" +
        "0 1,0 1,0 1,0 1,0 1\n",
        script_array:"0,0,0,0,0\n" +
        "0,0,0,0,0\n" +
        "0,0,0,0,0\n" +
        "0,0,0,0,0\n" +
        "0,0,0,0,0\n"
      };

      Meteor.call('createMap', map, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.mapExists)
          alert('This title has already been posted');

        this.title.value = ''
      });

    }
  </script>
</map-submit>
