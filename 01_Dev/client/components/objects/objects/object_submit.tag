<object-submit>
  <div class="ui segment">
    <form id="object-schema-form" class="ui form" onsubmit={submitNewObject}>
      <h1>{objectSchema.name} のデータ管理</h1>
      <div className="field">
        <label>identifier</label>
        <input name="identifier" id="identifier" type="text" placeholder="追加したいオブジェクトのユニークな識別子を入力してください。" kl_vkbd_parsed="true"/>
      </div>
      <div className="field" each={objectSchema.attributes}>
        <label>{name}</label>
        <input if={type==='string'} name={identifier} type="text" id="object_submit_text_{identifier}" kl_vkbd_parsed="true" />
        <input if={type==='number'} name={identifier} type="number" id="object_submit_number_{identifier}" kl_vkbd_parsed="true" />
        <input if={type==='boolean'} name={identifier} id="object_submit_checkbox_{identifier}" type="checkbox" />
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
        attributes: []
      };

      this.objectSchema.attributes.forEach((attribute)=>{
        if (attribute.type === 'number') {
          var value = parseFloat($("#object_submit_number_" + attribute.identifier).val());
        } else if (attribute.type === 'string') {
          var value = $("#object_submit_text_" + attribute.identifier).val();
        } else if (attribute.type === 'boolean') {
          var value = $("#object_submit_checkbox_" + attribute.identifier).prop('checked');
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

        this.name.value = ''
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
      this.sortingScopeValue = opts.story_id;
      this.getObjectSchema();
    });

    Meteor.autorun(()=> {
      this.getObjectSchema();
    });
  </script>
</object-submit>
