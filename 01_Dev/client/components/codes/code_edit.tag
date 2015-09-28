<code-edit>
  <div class="ui segment">
    <form class="ui form" onsubmit={submitFunc}>
      <div class="field">
        <label>タイトル</label>
        <input name="name" id="name" type="text" value={code.name} placeholder="スクリプトのタイトルを入力してください。" kl_vkbd_parsed="true" />
      </div>
      <div class="field">
        <label>識別子</label>
        <input name="identifier" id="identifier" type="text" value={code.identifier} placeholder="スクリプトの識別子を入力してください。" kl_vkbd_parsed="true" />
      </div>
      <div class="field">
        <label>JavaScript</label>
        <textarea name="javascript" id="javascript" kl_vkbd_parsed="true" value={code.javascript}></textarea>
      </div>
      <input type="submit" value={titleOfSubmitButton} class="ui submit button"/>
    </form>
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    submitNewCode(e) {
      e.preventDefault();

      var code = {
        name: this.name.value,
        identifier: this.identifier.value,
        javascript: this.javascript.value
      };

      Meteor.call('createCode', code, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        if (result.codeExists) {
          alert('This title has already been posted');
        }
        window.location.href = "#/code/" + result._id + "/edit";
      });
    }

    updateCode(e) {
      e.preventDefault();

      var currentCodeId = this.code._id;
      var codeAttributes = {
        name: this.name.value,
        identifier: this.identifier.value,
        javascript: this.javascript.value,
        userId: this.code.userId,
        author: this.code.author,
        submitted: this.code.submitted
      };

      Meteor.call('updateCode', {codeId:currentCodeId, codeAttributes:codeAttributes}, function(error, result) { // display the error to the user and abort
        if (error) {
          return alert(error.reason);
        }
      });
    }


    this.getCode = ()=> {
      if (opts.code_id) {
        this.code = MongoCollections.Codes.findOne({_id: opts.code_id});
        this.update();
        this.isEditing = true;
        this.titleOfSubmitButton = "変更";
      } else {
        this.isEditing = false;
        this.titleOfSubmitButton = "新規投稿";
      }

      this.submitFunc = this.isEditing ? this.updateCode : this.submitNewCode;
    }

    this.on('mount', ()=>{
      Meteor.subscribe('codes', {
        onReady: ()=>{
          this.getCode();
        }
      });
    });

    this.on('update', ()=>{
      this.getCode();
    });
  </script>
</code-edit>
