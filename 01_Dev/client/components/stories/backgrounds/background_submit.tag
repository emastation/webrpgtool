<background-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="field">
      <select name="backgroundSelect" onchange={onChangeSelectBackgroundId}>
        <option each={backgrounds} value={_id}>{name}</option>
      </select>
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
    this.getBackgrounds = ()=> {
      this.backgrounds = MongoCollections.Backgrounds.find().fetch();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('backgrounds', {
        onReady: ()=>{
          this.getBackgrounds();
        }
      });
    });

    Meteor.autorun(()=> {
      this.getBackgrounds();
      this.update();
    });
  </script>
</background-submit>
