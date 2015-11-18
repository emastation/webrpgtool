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
      <object-schema-item-attribute each={attribute, i in opts.object_schema.attributes} parent={parent} is_login={isLogin} object_schema={parent.opts.object_schema} attribute={attribute} i={i} />
      <div class="ui grid segment no-boader">
        <div class="one wide column">
          <button if={isLogin} type="button" class="plus circular ui icon button" onclick={pushNewAttribute}>
            <i class="plus icon"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="two wide column">
      <a href="#game/{opts.game_id}/schema/{opts.object_schema._id}">
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
    this.contentEditableName = false;
    this.contentEditableIdentifier = false;
    this.initialAttributeValue = {
        identifier: "new_identifier",
        name: "新規アトリビュート名",
        type: "number",
        options: []
      }
    editableName() {
      this.contentEditableName = this.isLogin;
      this.update();
    }

    editableIdentifier() {
      this.contentEditableIdentifier = this.isLogin;
      this.update();
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

    pushNewAttribute(i) {
      var attributes = opts.object_schema.attributes;
      var backupAttributes = lodash.cloneDeep(attributes);
      attributes.push(this.initialAttributeValue);

      this.saveEditedAttributesOfThisObjectSchema(attributes, backupAttributes);
    }

    deleteObjectSchema() {
      MongoCollections.ObjectSchemata.remove(opts.object_schema._id);
      Session.set('ObjectSchemaItem_changed', Date.now());
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
