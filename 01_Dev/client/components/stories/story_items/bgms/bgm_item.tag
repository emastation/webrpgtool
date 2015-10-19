<bgm-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide columns">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertBgm}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="four wide columns">
      <select value={opts.bgm_item.bgmAudioId} onchange={onChangeSelectBgmAudioId}>
        <option each={window.wrtBgmAudios} value={_id}>{name}</option>
      </select>
    </div>
    <div class="name nine wide column">
      <audio src={bgmAudio.audioUrl} controls volume={bgmAudio.volume} id="bgm_audio_{opts.bgm_item._id}"/>
      <select value={opts.bgm_item.transition} onchange={onChangeSelectBgmTransition}>
        <option each={bgmTransitions} value={identifier}>{name}</option>
      </select>
      <input type="range" name="volume" min="0" max="1" step="0.01" value={opts.bgm_item.volume} onchange={onChangeBgmVolume}>
    </div>
    <span class="badge">{opts.story_item.order}</span>
    <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteBgm}>
      <i class="remove icon"></i>
    </button>
  </div>

  <script>
    this.bgmTransitions = WRT_BGM_TRANSITIONS;

    insertBgm(id) {
      var storyItemModelClicked = MongoCollections.StoryItems.findOne(opts.story_item._id);

      window.wrtSubmitMasterRiotComponent.trigger('insertStoryItem', storyItemModelClicked.order);
    }

    deleteBgm() {
      Meteor.call('deleteStoryItem', opts.bgm_item.storyItemId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });
    }

    onChangeSelectBgmAudioId(e) {
      var bgm = {
        bgmAudioId: e.target.value
      };

      MongoCollections.Bgms.update(opts.bgm_item._id, {$set: bgm}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    onChangeSelectBgmTransition(e) {
      var bgm = {
        transition: e.target.value
      };

      MongoCollections.Bgms.update(opts.bgm_item._id, {$set: bgm}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    onChangeBgmVolume(e) {
      var bgm = {
        volume: parseFloat(e.target.value)
      };

      MongoCollections.Bgms.update(opts.bgm_item._id, {$set: bgm}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    this.on('update', ()=>{
      if (!opts.bgm_item) {
        return;
      }
      var results = _.filter(window.wrtBgmAudios, (bgmAudio)=>{
        return bgmAudio._id === opts.bgm_item.bgmAudioId;
      });
      if (results.length !== 1) {
        console.error("background data and backgroundImage data are not match. something is wrong!");
        return
      }
      this.bgmAudio = results[0];
      this.update();
      setTimeout(()=>{
        $('#bgm_audio_' + opts.bgm_item._id).get(0).volume = opts.bgm_item.volume;
      }, 0)
    });
  </script>

</bgm-item>
