<sound-effect-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide columns">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertSoundEffect}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="four wide columns">
      <select value={opts.sound_effect_item.soundEffectAudioId} onchange={onChangeSelectSoundEffectAudioId}>
        <option each={window.wrtSoundEffectAudios} value={_id}>{name}</option>
      </select>
    </div>
    <div class="name nine wide column">
      <audio src={soundEffectAudio.audioUrl} controls volume={soundEffectAudio.volume} id="sound_effect_audio_{opts.sound_effect_item._id}"/>
      <input type="range" name="volume" min="0" max="1" step="0.01" value={opts.sound_effect_item.volume} onchange={onChangeSoundEffectVolume}>
    </div>
    <span class="badge">{opts.story_item.order}</span>
    <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteSoundEffect}>
      <i class="remove icon"></i>
    </button>
  </div>

  <script>
    this.bgmTransitions = WRT_BGM_TRANSITIONS;

    insertSoundEffect(id) {
      var storyItemModelClicked = MongoCollections.StoryItems.findOne(opts.story_item._id);

      window.wrtSubmitMasterRiotComponent.trigger('insertStoryItem', storyItemModelClicked.order);
    }

    deleteSoundEffect() {
      Meteor.call('deleteStoryItem', opts.sound_effect_item.storyItemId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });
    }

    onChangeSelectSoundEffectAudioId(e) {
      var soundEffect = {
        soundEffectAudioId: e.target.value
      };

      MongoCollections.SoundEffects.update(opts.sound_effect_item._id, {$set: soundEffect}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    onChangeSoundEffectVolume(e) {
      var soundEffect = {
        volume: parseFloat(e.target.value)
      };

      MongoCollections.SoundEffects.update(opts.sound_effect_item._id, {$set: soundEffect}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    this.on('update', ()=>{
      if (!opts.sound_effect_item) {
        return;
      }
      var results = _.filter(window.wrtSoundEffectAudios, (soundEffectAudio)=>{
        return soundEffectAudio._id === opts.sound_effect_item.soundEffectAudioId;
      });
      if (results.length !== 1) {
        console.error("background data and backgroundImage data are not match. something is wrong!");
        return
      }
      this.soundEffectAudio = results[0];
      this.update();
      setTimeout(()=>{
        audioTag = $('#sound_effect_audio_' + opts.sound_effect_item._id).get(0);
        if (audioTag) {
          audioTag.volume = opts.sound_effect_item.volume;
        }
      }, 0)
    });
  </script>

</sound-effect-item>
