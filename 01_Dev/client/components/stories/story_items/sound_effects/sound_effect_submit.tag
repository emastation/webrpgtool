<sound-effect-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="fields">
      <div class="five wide field">
        <label>サウンドエフェクト</label>
        <select name="soundEffectAudioSelect" onchange={onChangeSelectBgmId}>
          <option each={soundEffectAudios} value={_id}>{name}</option>
        </select>
      </div>
      <div class="two wide field">
        <label>音量</label>
        <input type="range" name="volume" min="0" max="1" step="0.01">
      </div>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
    window.wrtSoundEffectSubmitRiotComponent = this;

    submitNewItem(e) {
      e.preventDefault();

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a bgm.",
        needClick: true,
        soundEffectAudioId: this.soundEffectAudioSelect.value,
        volume: parseFloat(this.volume.value),
      };

      var that = this;
      Meteor.call('pushSoundEffect', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    }

    this.getSoundEffectAudios = ()=> {
      this.soundEffectAudios = MongoCollections.SoundEffectAudios.find().fetch();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('soundEffectAudios', {
        onReady: ()=>{
          this.getSoundEffectAudios();
        }
      });
    });

    this.on('insertSoundEffect', (order)=>{

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a sound effect.",
        needClick: true,
        soundEffectAudioId: this.soundEffectAudioSelect.value,
        volume: parseFloat(this.volume.value),
        order: order
      };

      var that = this;
      Meteor.call('insertSoundEffect', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    });

    Meteor.autorun(()=> {
      this.getSoundEffectAudios();
      this.update();
    });
  </script>
</sound-effect-submit>
