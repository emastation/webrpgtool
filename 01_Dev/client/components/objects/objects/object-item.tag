<object-item>
  <div class="ui grid segment">
    <div class="sixteen wide column" ondblclick={editableIdentifier}>
      <label>識別子</label>
      <span if={!contentEditableIdentifier}>{opts.object.identifier}</span>
      <input if={contentEditableIdentifier} type="text" value={opts.object.identifier} onblur={completeIdentifierEditing} onkeydown={completeIdentifierEditing}>
    </div>
    <div class="sixteen wide column" each={opts.object.attributes}>
      <label>{name}</label>
      <input if={type==='string'} type="text" id="object_item_{parent.opts.object._id}_text_{identifier}" value={value} kl_vkbd_parsed="true" onchange={changeAttribute.bind(this, identifier, type)} />
      <input if={type==='number'} type="number" id="object_item_{parent.opts.object._id}_number_{identifier}" value={value} kl_vkbd_parsed="true" onchange={changeAttribute.bind(this, identifier, type)} />
      <input if={type==='boolean'} type="checkbox" id="object_item_{parent.opts.object._id}_checkbox_{identifier}" checked={value} onchange={changeAttribute.bind(this, identifier, type)} />
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

    changeAttribute(attrbuteIdentifier, dataType) {
      console.log("" + opts.object._id + " " + attrbuteIdentifier + " " + dataType);

      var attributes = opts.object.attributes;
      var index = lodash.findIndex(attributes, {identifier: attrbuteIdentifier});

      if (dataType === 'string') {
        var value = $('#object_item_' + opts.object._id + '_text_' + attrbuteIdentifier).val();
      } else if (dataType === 'number') {
        var value = parseFloat($('#object_item_' + opts.object._id + '_number_' + attrbuteIdentifier).val());
      } else if (dataType === 'boolean') {
        var value = $('#object_item_' + opts.object._id + '_checkbox_' + attrbuteIdentifier).prop('checked');;
      }

      attributes[index] = {
        identifier: attrbuteIdentifier,
        value: value
      };

      Meteor.call('updateObjectAttributes', {
        objectId: opts.object._id,
        objectAttributes: attributes
      }, function(error, result) { // display the error to the user and abort
        if (error) {
          return alert(error.reason);
        }
        Session.set('ObjectItem_changed', Date.now());
      });

    }
  </script>
</object-item>
