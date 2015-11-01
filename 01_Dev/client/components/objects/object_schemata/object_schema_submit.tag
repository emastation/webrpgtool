<object-schema-submit>
  <div class="ui segment">
    <form id="object-schema-form" class="ui form" onsubmit={submitNewObjectSchema}>
      <div className="field">
        <label>名前</label>
        <input name="name" id="name" type="text" placeholder="追加したいオブジェクトスキーマの名前を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <div className="field">
        <label>identifier</label>
        <input name="identifier" id="identifier" type="text" placeholder="追加したいオブジェクトスキーマのユニークな識別子を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <input type="submit" id="object-schema-submit" class="ui button" value="追加" />
    </form>
  </div>

  <script>
    submitNewObjectSchema(e) {
      e.preventDefault();

      if (this.name.value === '') {
        alert('名前を入力してください。');
        return;
      }

      if (this.identifier.value === '') {
        alert('識別子を入力してください。');
        return;
      }

      var attribute = {
        name: this.name.value,
        identifier: this.identifier.value,
        extends: '',
        attributes: []
      };

      Meteor.call('createObjectSchema', attribute, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.exists)
          alert('すでに登録されている識別子です。');

        this.name.value = ''
      });

    }
  </script>

</object-schema-submit>
