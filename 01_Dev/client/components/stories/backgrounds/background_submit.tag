<background-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="field">
      <select name="backgroundImageSelect" onchange={onChangeSelectBackgroundId}>
        <option each={backgroundImages} value={_id}>{name}</option>
      </select>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>

    submitNewItem(e) {
      e.preventDefault();

      var sceneId = opts.scene_id;

      var attributes = {
        sceneId: sceneId,
        comment: "This is a background.",
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

    Meteor.autorun(()=> {
      this.getBackgroundImages();
      this.update();
    });
  </script>
</background-submit>
