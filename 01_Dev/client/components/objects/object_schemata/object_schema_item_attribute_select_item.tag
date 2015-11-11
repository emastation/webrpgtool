<object-schema-item-attribute-select-item>
  <div class="ui grid segment">
    <div class="one wide column">
      <button if={opts.is_login} type="button" class="plus circular ui icon button" onclick={insertOption}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="six wide column" ondblclick={editableIdentifier}>
      <label>識別子</label>
      <span if={!contentEditableIdentifier}>{opts.option.identifier}</span>
      <input if={contentEditableIdentifier} type="text" value={opts.option.identifier} onblur={completeOptionIdentifierEditing} onkeydown={completeOptionIdentifierEditing}>
    </div>
    <div class="six wide column" ondblclick={editableName}>
      <label>名前</label>
      <span if={!this.contentEditableName}>{opts.option.name}</span>
      <input if={this.contentEditableName} type="text" value={opts.option.name} onblur={completeOptionNameEditing} onkeydown={completeOptionNameEditing}>
    </div>
    <div class="one wide column">
      <button if={opts.is_login} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteThisOption}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>

  <script>
    this.contentEditableName = false;
    this.contentEditableIdentifier = false;

    editableIdentifier() {
      this.contentEditableIdentifier = opts.is_login;
      this.update();
    }

    editableName() {
      this.contentEditableName = opts.is_login;
      this.update();
    }

    completeOptionIdentifierEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true;
      }

      if (evt.target.value === '') {
        return true;
      }

      // check evt.target.value is not same as existing identifiers.
      var isSame = false;
      opts.object_schema.attributes[opts.attribute_idx].options.forEach((option)=>{
        if (option.identifier === evt.target.value) {
          isSame = true;
        }
      });
      if (isSame) {
        return true;
      }


      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[opts.attribute_idx].options[opts.option_idx].identifier = evt.target.value;

      opts.parent.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);

      evt.target.blur();
      this.contentEditableIdentifier = false;

    }

    completeOptionNameEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true;
      }

      if (evt.target.value === '') {
        return true;
      }

      // check evt.target.value is not same as existing names.
      var isSame = false;
      opts.object_schema.attributes[opts.attribute_idx].options.forEach((option)=>{
        if (option.name === evt.target.value) {
          isSame = true;
        }
      });
      if (isSame) {
        return true;
      }

      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[opts.attribute_idx].options[opts.option_idx].name = evt.target.value;

      opts.parent.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);

      evt.target.blur();
      this.contentEditableName = false;

    }

    insertOption() {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[opts.attribute_idx].options.splice(opts.option_idx, 0, opts.parent.initialOptionValue);

      opts.parent.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    deleteThisOption() {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[opts.attribute_idx].options.splice(opts.option_idx, 1);

      opts.parent.parent.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }
  </script>
</object-schema-item-attribute-select-item>
