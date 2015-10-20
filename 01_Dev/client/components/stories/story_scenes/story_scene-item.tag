<story-scene-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide column">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <span class="badge one wide column">{opts.story_scene.order}</span>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertStory}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="name twelve wide column" ondblclick={editableThisStory}>
      <span if={!contentEditable}>{opts.story_scene.name}</span>
      <input if={contentEditable} type="text" name="storySceneName" value={opts.story_scene.name} onblur={completeEditing} onkeydown={completeEditing}>
    </div>
    <div class="two wide column">
      <a href="#story/{opts.story_id}/scene/{opts.story_scene._id}">
        <button if={isLogin} type="button" class="edit circular ui icon button">
          <i class="edit icon"></i>
        </button>
      </a>
      <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteStory}>
        <i class="remove icon"></i>
      </button>
    </div>
  </div>

  <script>
    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.update();
    });

    this.on('mount', ()=>{
      this.editable = false;
    });

    this.on('update', ()=>{
      this.contentEditable = this.editable && this.isLogin;
    });

    editableThisStory() {
      this.editable = true;
      this.update();
    }

    insertStory(e) {
      var storySceneModelClicked = MongoCollections.StoryScenes.findOne(opts.story_scene._id);

      var storyScene = {
        storyId: opts.story_id,
        name: '新規シーン',
        choices: [],
        order: storySceneModelClicked.order
      };

      Meteor.call('addStoryScene', storyScene, function(error, result) {
        if (error)
          return alert(error.reason);

        if (result.storyExists) {
          return alert('This Story has already been posted');
        }
      });
    }

    deleteStory() {
      Meteor.call('deleteStoryScene', opts.story_scene._id, function(error, result) {
  //      if (error)
  //        return alert(error.reason);
      });
    }

    completeEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      var storyScene = {
        name: this.storySceneName.value
      };

      MongoCollections.StoryScenes.update(opts.story_scene._id, {$set: storyScene}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });

      evt.target.blur();

      this.editable = false;
      this.update();
    }
  </script>

  <style scoped>
    input {
      width: 100%;
    }
  </style>
</story-scene-item>
