<game-submit>
  <div class="ui segment">
    <form id="object-schema-form" class="ui form" onsubmit={submitNewGame}>
      <div className="field">
        <label>タイトル</label>
        <input name="title" id="title" type="text" placeholder="追加したいゲームのタイトルを入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <div className="field">
        <label>識別子</label>
        <input name="identifier" id="identifier" type="text" placeholder="追加したいゲームのユニークな識別子を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <input type="submit" id="map-submit" class="ui button" value="追加" />
    </form>
  </div>

  <script>
    submitNewGame(e) {
      e.preventDefault();

      if (this.title.value === '') {
        alert('名前を入力してください。');
        return;
      }

      if (this.identifier.value === '') {
        alert('識別子を入力してください。');
        return;
      }

      var attribute = {
        title: this.title.value,
        identifier: this.identifier.value
      };

      Meteor.call('createGame', attribute, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.exists)
          alert('すでに登録されている識別子です。');

        this.name.value = ''
        this.identifier.value = ''
      });

    }
  </script>

</game-submit>
