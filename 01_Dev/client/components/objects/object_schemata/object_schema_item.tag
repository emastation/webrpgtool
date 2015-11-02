<object-schema-item>
  <div class="ui grid segment">
    <div class="fourteen wide column">
      <div class="ui grid">
        <div class="eight wide column" ondblclick={editableName}>
          <label>名前</label>
          <span if={!this.contentEditableName}>{opts.object_schema.name}</span>
          <input if={this.contentEditableName} type="text" value={opts.object_schema.name} onblur={completeNameEditing} onkeydown={completeNameEditing}>
        </div>
        <div class="eight wide column" ondblclick={editableIdentifier}>
          <label>識別子</label>
          <span if={!contentEditableIdentifier}>{opts.object_schema.identifier}</span>
          <input if={contentEditableIdentifier} type="text" value={opts.object_schema.identifier} onblur={completeIdentifierEditing} onkeydown={completeIdentifierEditing}>
        </div>
      </div>
      <h4>継承</h4>
      <p>
        {opts.object_schema.extend}
      </p>
      <h4>アトリビュート</h4>
      <div each={attribute, i in opts.object_schema.attributes} class="ui grid segment">
        <div class="one wide column">
          <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertAttribute.bind(this, i)}>
            <i class="plus icon"></i>
          </button>
        </div>
        <div class="four wide column" ondblclick={editableThisAttributeIdentifier.bind(this, i)}>
          <label>識別子</label>
          <span if={_.isUndefined(this.contentEditableAttributeIdentifiers[i]) || this.contentEditableAttributeIdentifiers[i] === false}>{attribute.identifier}</span>
          <input if={(!_.isUndefined(this.contentEditableAttributeIdentifiers[i])) && this.contentEditableAttributeIdentifiers[i] === true} type="text" value={attribute.identifier} onblur={completeAttributeIdentifierEditing.bind(this, i)} onkeydown={completeAttributeIdentifierEditing.bind(this, i)}>
        </div>
        <div class="five wide column" ondblclick={editableThisAttributeName.bind(this, i)}>
          <label>名前</label>
          <span if={_.isUndefined(this.contentEditableAttributeNames[i]) || this.contentEditableAttributeNames[i] === false}>{attribute.name}</span>
          <input if={(!_.isUndefined(this.contentEditableAttributeNames[i])) && this.contentEditableAttributeNames[i] === true} type="text" value={attribute.name} onblur={completeAttributeNameEditing.bind(this, i)} onkeydown={completeAttributeNameEditing.bind(this, i)}>
        </div>
        <div class="four wide column" ondblclick={editableThisAttributeName.bind(this, i)}>
          <label>タイプ</label>
          <select if={isLogin} value={attribute.type} onchange={onChangeSelectAttributeType.bind(this, i)}>
            <option value="number">数値</option>
            <option value="string">文字列</option>
            <option value="boolean">真偽値</option>
          </select>
        </div>
        <div class="two wide column">
          <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteThisAttribute.bind(this, i)}>
            <i class="remove icon"></i>
          </button>
        </div>
      </div>
      <div class="ui grid segment no-boader">
        <div class="one wide column">
          <button if={isLogin} type="button" class="plus circular ui icon button" onclick={pushNewAttribute}>
            <i class="plus icon"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="two wide column">
      <a href="#schema/{opts.object_schema._id}">
        <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert">
          <i class="edit icon"></i>
        </button>
      </a>
      <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteObjectSchema}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>

  <script>
    this.contentEditableAttributeNames = [];
    this.contentEditableAttributeIdentifiers = [];
    this.initialAttributeName = "新規アトリビュート名";
    this.initialAttributeIdentifier = "new_identifier"
    this.contentEditableName = false;
    this.contentEditableIdentifier = false;

    editableName() {
      this.contentEditableName = this.isLogin;
      this.update();
    }

    editableIdentifier() {
      this.contentEditableIdentifier = this.isLogin;
      this.update();
    }

    editableThisAttributeName(i) {
      this.contentEditableAttributeNames[i] = this.isLogin;
      this.update();
    }

    editableThisAttributeIdentifier(i) {
      this.contentEditableAttributeIdentifiers[i] = this.isLogin;
      this.update();
    }

    saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes) {
      Meteor.call('updateObjectSchemaAttributes', {
        objectSchemaId: opts.object_schema._id,
        attributes: attributes
      }, (error, result)=> {
        if (result) {
          alert(result);
          opts.object_schema.attributes = backupAttributes;
        }
        this.update();
      });
    }

    completeNameEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      var objectSchema = {
        name: evt.target.value
      };

      Meteor.call('updateObjectSchema', {
        objectSchemaId: opts.object_schema._id,
        objectSchema: objectSchema
      }, (error, result)=> {
        if (!_.isUndefined(result) && result.exists) {
          alert(result);
        }
        this.update();
      });


      evt.target.blur();

      this.contentEditableName = false;
      this.update();
    }

    completeIdentifierEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object_schema.identifier || evt.target.value === '') {
        return;
      }

      var backupIdentifier = opts.object_schema.identifier;
      opts.object_schema.identifier = evt.target.value;

      var objectSchema = {
        identifier: evt.target.value
      };

      Meteor.call('updateObjectSchema', {
        objectSchemaId: opts.object_schema._id,
        objectSchema: objectSchema
      }, (error, result)=> {
        if (!_.isUndefined(result) && result.exists) {
          alert(result);
          opts.object_schema.identifier = backupIdentifier;
        }
        this.update();
      });

      evt.target.blur();

      this.contentEditableIdentifier = false;
      this.update();
    }

    completeAttributeNameEditing(i, evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object_schema.attributes[i].name || evt.target.value === '') {
        return true;
      }

      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].name = evt.target.value;

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);


      evt.target.blur();
      this.contentEditableAttributeNames[i] = false;

    }

    completeAttributeIdentifierEditing(i, evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      if (evt.target.value === opts.object_schema.attributes[i].identifier || evt.target.value === '') {
        return true;
      }

      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].identifier = evt.target.value;

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);


      evt.target.blur();
      this.contentEditableAttributeIdentifiers[i] = false;

    }

    onChangeSelectAttributeType(i, evt) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes[i].type = evt.target.value;

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    insertAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.splice(i, 0, {
        identifier: this.initialAttributeIdentifier,
        name: this.initialAttributeName,
        type: "number",
      });

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    pushNewAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.push({
        identifier: this.initialAttributeIdentifier,
        name: this.initialAttributeName,
        type: "number",
      });

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    deleteThisAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.splice(i, 1);

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    deleteObjectSchema() {
      MongoCollections.ObjectSchemata.remove(opts.object_schema._id);
    }

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false;
      this.update();
    });
  </script>

  <style scoped>
    :scope>div {
      margin: 10px !important;
    }

    label {
      display: block;
      font-weight: bold;
    }

    .no-boader {
      border: none !important;
      box-shadow: none !important;
    }
  </style>
</object-schema-item>
