<object-item>
  <div class="ui grid segment">
    <div ondblclick={editableIdentifier}>
      <label>識別子</label>
      <span if={!contentEditableIdentifier}>{opts.object.identifier}</span>
      <input if={contentEditableIdentifier} type="text" value={opts.object.identifier} onblur={completeIdentifierEditing} onkeydown={completeIdentifierEditing}>
    </div>
  </div>

  <script>
    this.contentEditableIdentifier = false;

    editableIdentifier() {
      this.contentEditableIdentifier = opts.is_login;
      this.update();
    }

    completeIdentifierEditing(evt) {

      if (!opts.is_login) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object.identifier || evt.target.value === '') {
        return;
      }

      var backupIdentifier = opts.object.identifier;
      opts.object.identifier = evt.target.value;

      Meteor.call('updateObjectIdentifier', {
        objectId: opts.object._id,
        objectIdentifier: evt.target.value
      }, (error, result)=> {
        if (!_.isUndefined(result) && result.exists) {
          alert("識別子が重複しています。");
          opts.object.identifier = backupIdentifier;
        }
        this.update();
        Session.set('ObjectItem_changed', Date.now());
      });

      evt.target.blur();

      this.contentEditableIdentifier = false;
      this.update();
    }
  </script>
</object-item>
