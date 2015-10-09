<background-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="field">
      <select name="backgroundSelect" onchange={onChangeSelectBackgroundId}>
        <option each={backgroundImages} value={_id}>{name}</option>
      </select>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
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
