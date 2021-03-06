<object-submit>
  <div class="ui segment">
    <form id="object-schema-form" class="ui form" onsubmit={submitNewObject}>
      <h1>{objectSchema.name} のデータ管理</h1>
      <div class="field">
        <label>identifier</label>
        <input name="identifier" id="identifier" type="text" placeholder="追加したいオブジェクトのユニークな識別子を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <div class="field" each={objectSchema.attributes}>
        <label>{name}</label>
        <input each={type==='string' ? [true]:[]} name={identifier} type="text" id="object_submit_text_{identifier}" kl_vkbd_parsed="true" />
        <input each={type==='number' ? [true]:[]} name={identifier} type="number" id="object_submit_number_{identifier}" kl_vkbd_parsed="true" />
        <input each={type==='boolean' ? [true]:[]} name={identifier} id="object_submit_checkbox_{identifier}" type="checkbox" />
        <select each={type==='select' ? [true]:[]} name={identifier} id="object_submit_select_{identifier}">
          <option each={options} value={identifier}>{name}</option>
        </select>
      </div>
      <input type="submit" id="object-submit" class="ui button" value="追加" />
    </form>
  </div>

  <script>
    submitNewObject(e) {
      e.preventDefault();

      if (this.identifier.value === '') {
        alert('識別子を入力してください。');
        return;
      }

      var submitData = {
        identifier: this.identifier.value,
        game_id: opts.game_id,
        schema_identifier: this.objectSchema.identifier,
        attributes: []
      };

      this.objectSchema.attributes.forEach((attribute)=>{
        if (attribute.type === 'number') {
          var value = parseFloat($("#object_submit_number_" + attribute.identifier).val());
        } else if (attribute.type === 'string') {
          var value = $("#object_submit_text_" + attribute.identifier).val();
        } else if (attribute.type === 'boolean') {
          var value = $("#object_submit_checkbox_" + attribute.identifier).prop('checked');
        } else if (attribute.type === 'select') {
          var value = $("#object_submit_select_" + attribute.identifier).val();
          value = _.isNull(value) ? '' : value;
        }

        submitData.attributes.push({
          identifier: attribute.identifier,
          value: value
        });
      });


      Meteor.call('createObject', submitData, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.exists)
          alert('すでに登録されている識別子です。');

        Session.set('ObjectItem_changed', Date.now());

        this.identifier.value = ''
      });

    }

    getObjectSchema() {
      this.objectSchema = MongoCollections.ObjectSchemata.findOne({_id: opts.schema_id});
      this.update();
    }

    this.on('mount', ()=>{
      Meteor.subscribe('objectSchemata', {
        onReady: ()=>{
          this.getObjectSchema();
        }
      });
    });

    this.on('update', ()=>{
      this.getObjectSchema();
    });

    Meteor.autorun(()=> {
      this.getObjectSchema();
    });
  </script>
</object-submit>
