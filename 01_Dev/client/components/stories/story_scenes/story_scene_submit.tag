<story-scene-submit if={isLogin}>
  <div class="ui segment">
    <form class="ui form" onsubmit={submitNewItem}>
      <div class="field">
        <label>シーンの新規作成</label>
        <input name="title" id="title" type="text" value={this.state.newSceneName} placeholder="新しいシーンの名前を入力してください。" onChange={this.newSceneNameChange}/>
      </div>
      <input type="submit" value="Submit" class="ui submit button"/>
    </form>
  </div>

  <script>
    submitNewItem(e) {
      e.preventDefault();

      var storyId = opts.story_id;

      var attributes = {
        storyId: storyId,
        name: this.title.value,
        choices: [],
        clear: false,
        order: -1
      };

      var that = this;
      Meteor.call('createStoryScene', attributes, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        this.title.value = '';
      });
    }

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.update();
    });

  </script>
</story-scene-submit>
