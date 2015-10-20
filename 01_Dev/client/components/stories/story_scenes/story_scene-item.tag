<story-scene-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide column">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <span class="badge one wide column">{opts.story_scene.order}</span>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertStory}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="name twelve wide column">
      <div ondblclick={editableThisStorySceneName}>
        <span if={!contentEditableThisStorySceneName}>{opts.story_scene.name}</span>
        <input if={contentEditableThisStorySceneName} type="text" name="storySceneName" value={opts.story_scene.name} onblur={completeEditing} onkeydown={completeEditing}>
      </div>
      <label class="choices-label">分岐選択肢</label>
      <div class="ui grid segment" each={choice, i in opts.story_scene.choices}>
        <div class="one wide column">
          <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertChoice.bind(this, i)}>
            <i class="plus icon"></i>
          </button>
        </div>
        <div class="ten wide column">
          <div ondblclick={editableThisStorySceneChoice.bind(this, i)}>
            <span if={_.isUndefined(this.contentEditableStorySceneChoices[i]) || this.contentEditableStorySceneChoices[i] === false}>{choice.sentence}</span>
            <input if={(!_.isUndefined(this.contentEditableStorySceneChoices[i])) && this.contentEditableStorySceneChoices[i] === true} type="text" value={choice.sentence} onblur={completeChoiceEditing.bind(this, i)} onkeydown={completeChoiceEditing.bind(this, i)}>
          </div>
        </div>
        <div class="three wide column">
          <select if={isLogin} value={choice.goTo} onchange={onChangeSelectChoiceGoto.bind(this, i)}>
            <option each={parent.opts.story_scenes} value={_id}>{name}</option>
          </select>
        </div>
        <div class="two wide column">
          <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteThisChoice.bind(this, i)}>
            <i class="remove icon"></i>
          </button>
        </div>
      </div>
      <div class="ui grid segment no-boader">
        <div class="one wide column">
          <button if={isLogin} type="button" class="plus circular ui icon button" onclick={pushNewChoice}>
            <i class="plus icon"></i>
          </button>
        </div>
      </div>
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
    this.contentEditableStorySceneChoices = [];
    this.initialChoiceSentence = "この選択肢の文章を編集してください。";
    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.update();
    });

    this.on('mount', ()=>{
      this.editable = false;
    });

    editableThisStorySceneName() {
      this.contentEditableThisStorySceneName = this.isLogin;
      this.update();
    }
    editableThisStorySceneChoice(i) {
      this.contentEditableStorySceneChoices[i] = this.isLogin;
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

      this.contentEditableThisStorySceneName = false;
      this.update();
    }

    completeChoiceEditing(i, evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      var choices = opts.story_scene.choices;
      choices[i].sentence = evt.target.value;

      var storyScene = {
        choices: choices
      };

      MongoCollections.StoryScenes.update(opts.story_scene._id, {$set: storyScene}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });

      evt.target.blur();

      this.contentEditableStorySceneChoices[i] = false;
      this.update();

    }

    saveEditedChoicesOfThisStoryScene(choices) {
      var storyScene = {
        choices: choices
      };

      MongoCollections.StoryScenes.update(opts.story_scene._id, {$set: storyScene}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
      this.update();
    }

    onChangeSelectChoiceGoto(i, evt) {
      var choices = opts.story_scene.choices;
      choices[i].goTo = evt.target.value;

      this.saveEditedChoicesOfThisStoryScene(choices);
    }

    insertChoice(i) {
      var choices = opts.story_scene.choices;
      choices.splice(i, 0, {
        sentence: this.initialChoiceSentence,
        goTo: opts.story_scenes[0]._id
      });

      this.saveEditedChoicesOfThisStoryScene(choices);
    }

    pushNewChoice(i) {
      var choices = opts.story_scene.choices;
      choices.push({
        sentence: this.initialChoiceSentence,
        goTo: opts.story_scenes[0]._id
      });

      this.saveEditedChoicesOfThisStoryScene(choices);
    }

    deleteThisChoice(i) {
      var choices = opts.story_scene.choices;
      choices.splice(i, 1);

      this.saveEditedChoicesOfThisStoryScene(choices);
    }
  </script>

  <style scoped>
    input {
      width: 100%;
    }

    .no-boader {
      border: none !important;
      box-shadow: none !important;
    }

    .choices-label {
      margin-top: 10px !important;
      font-weight: bold !important;
      display: inline-block;
    }
  </style>
</story-scene-item>
