<background-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="field">
      <label>背景</label>
      <select name="backgroundImageSelect" onchange={onChangeSelectBackgroundId}>
        <option each={backgroundImages} value={_id}>{name}</option>
      </select>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
    window.wrtBackgroundSubmitRiotComponent = this;
    submitNewItem(e) {
      e.preventDefault();

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a background.",
        needClick: true,
        backgroundImageId: this.backgroundImageSelect.value,
      };

      var that = this;
      Meteor.call('pushBackground', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    }

    this.getBackgroundImages = ()=> {
      this.backgroundImages = MongoCollections.BackgroundImages.find().fetch();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('backgroundImages', {
        onReady: ()=>{
          this.getBackgroundImages();
        }
      });
    });

    this.on('insertBackground', (order)=>{

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a background.",
        needClick: true,
        backgroundImageId: this.backgroundImageSelect.value,
        order: order
      };

      var that = this;
      Meteor.call('insertBackground', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });

    });

    Meteor.autorun(()=> {
      this.getBackgroundImages();
      this.update();
    });
  </script>
</background-submit>
