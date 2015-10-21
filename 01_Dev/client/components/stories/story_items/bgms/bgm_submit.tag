<bgm-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="fields">
      <div class="five wide field">
        <label>BGM</label>
        <select name="bgmAudioSelect" onchange={onChangeSelectBgmId}>
          <option each={bgmAudios} value={_id}>{name}</option>
        </select>
      </div>
      <div class="two wide field">
        <label>音量</label>
        <input type="range" name="volume" min="0" max="1" step="0.01">
      </div>
      <div class="five wide field">
        <label>トランジション</label>
        <select name="bgmTransitionSelect">
          <option each={bgmTransitions} value={identifier}>{name}</option>
        </select>
      </div>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
    window.wrtBgmSubmitRiotComponent = this;
    this.bgmTransitions = WRT_BGM_TRANSITIONS;

    submitNewItem(e) {
      e.preventDefault();

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a bgm.",
        needClick: true,
        bgmAudioId: this.bgmAudioSelect.value,
        volume: parseFloat(this.volume.value),
        transition: this.bgmTransitionSelect.value
      };

      var that = this;
      Meteor.call('pushBgm', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    }

    this.getBgmAudios = ()=> {
      this.bgmAudios = MongoCollections.BgmAudios.find().fetch();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('bgmAudios', {
        onReady: ()=>{
          this.getBgmAudios();
        }
      });
    });

    this.on('insertBgm', (order)=>{

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a bgm.",
        needClick: true,
        bgmAudioId: this.bgmAudioSelect.value,
        volume: parseFloat(this.volume.value),
        transition: this.bgmTransitionSelect.value,
        order: order
      };

      var that = this;
      Meteor.call('insertBgm', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    });

    Meteor.autorun(()=> {
      this.getBgmAudios();
      this.update();
    });
  </script>
</bgm-submit>
