<background-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide columns">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertBackground}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="four wide columns">
      <select value={opts.background_item.backgroundImageId} onchange={onChangeSelectBackgroundImageId}>
        <option each={window.wrtBackgroundImages} value={_id}>{name}</option>
      </select>
    </div>
    <div class="name nine wide column">
      <img src={backgroundImage.thumbnailUrl} />
    </div>
    <span class="badge">{opts.story_item.order}</span>
    <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteBackground}>
      <i class="remove icon"></i>
    </button>
  </div>

  <script>
    insertBackground(id) {
      var storyItemModelClicked = MongoCollections.StoryItems.findOne(opts.story_item._id);
      var attributes = {
        sceneId: opts.scene_id,
        comment: "This is a background.",
        backgroundImageId: opts.background_item.backgroundImageId,
        order: storyItemModelClicked.order
      };

      Meteor.call('insertBackground', attributes, function(error, result) { // display the error to the user and abort
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });
    }

    deleteBackground() {
      Meteor.call('deleteStoryItem', opts.background_item.storyItemId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });
    }

    onChangeSelectBackgroundImageId(e) {
      this.selectedBackgroundImageId = e.target.value;

      var background = {
        backgroundImageId: e.target.value
      };

      MongoCollections.Backgrounds.update(opts.background_item._id, {$set: background}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    this.on('update', ()=>{
      if (!opts.background_item) {
        return;
      }
      var results = _.filter(window.wrtBackgroundImages, (backgroundImage)=>{
        return backgroundImage._id === opts.background_item.backgroundImageId;
      });
      if (results.length !== 1) {
        console.error("background data and backgroundImage data are not match. something is wrong!");
        return
      }
      this.backgroundImage = results[0];
      this.update();
    });
  </script>

</background-item>
