<object-submit>
  <div class="ui segment">
    <form id="object-schema-form" class="ui form" onsubmit={submitNewObjectSchema}>
      <div className="field">
        <label>identifier</label>
        <input name="identifier" id="identifier" type="text" placeholder="追加したいオブジェクトのユニークな識別子を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <input type="submit" id="map-submit" class="ui button" value="追加" />
    </form>
  </div>

  <script>
    submitNewObjectSchema(e) {
      e.preventDefault();

      if (this.name.value === '') {
        alert('識別子を入力してください。');
        return;
      }

      var attribute = {
        identifier: this.identifier.value,
        extends: '',
        attributes: []
      };

      Meteor.call('createObject', attribute, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.exists)
          alert('すでに登録されている識別子です。');

        this.name.value = ''
      });

    }
  </script>

</object-submit>
