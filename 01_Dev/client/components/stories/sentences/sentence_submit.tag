<sentence-submit>
  <form class="ui form" onsubmit={submitNewItem}>
    <div class="field">
      <select name="characterSelect" onchange={onChangeSelectCharacterId}>
        <option each={characters} value={_id}>{name}</option>
      </select>
      <select name="characterImageSelect">
        <option each={characterImages} value={_id}>{pose}</option>
      </select>
      <select name="characterPositionSelect">
        <option each={characterPositions} value={identifier}>{name}</option>
      </select>
      <textarea name="text" placeholder="セリフを入力してください。" />
    </div>
    <input type="submit" value="追加" class="ui submit button"/>
  </form>

  <script>
    this.characterPositions = CHARACTER_POSITIONS;


    submitNewItem(e) {
      e.preventDefault();

      var sceneId = opts.scene_id;

      if (!this.selectedCharacterId) {
        return;
      }

      var attributes = {
        sceneId: sceneId,
        comment: "This is a sentence.",
        text: this.text.value,
        characterId: this.selectedCharacterId,
        characterImageId: this.characterImageSelect.value,
        position: this.characterPositionSelect.value
      };

      var that = this;
      Meteor.call('pushSentence', attributes, (error, result)=> {
        if (error) {
          return alert(error.reason);
        }
        this.text.value = ''
        Session.set('storyItems_changed', Date.now());
      });

    }

    onChangeSelectCharacterId(e) {
      var characterImage = MongoCollections.CharacterImages.find({characterId: e.target.value}).fetch()[0];
      this.selectedCharacterId = e.target.value;
      this.characterImages = MongoCollections.CharacterImages.find({characterId: this.selectedCharacterId}).fetch();
      this.selectedCharacterImageId = characterImage._id;

      this.update();
    }

    this.getCharacters = ()=> {
      this.characters = MongoCollections.Characters.find({useForNovel: true}).fetch();
    };
    this.getCharacterImages = ()=> {
      this.characterImages = MongoCollections.CharacterImages.find({characterId: this.selectedCharacterId}).fetch();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('characters', {
        onReady: ()=>{
          this.getCharacters();
          this.selectedCharacterId = this.characters[0]._id;
          Meteor.subscribe('characterImages', {
            onReady: ()=>{
              this.getCharacterImages();
              this.selectedCharacterImageId = this.characterImages[0]._id;
              this.update();
            }
          });
        }
      });
    });

    Meteor.autorun(()=> {
      this.getCharacters();
      if (this.characters && this.characters[0]) {
        this.selectedCharacterId = this.characters[0]._id;
        this.getCharacterImages();
      }
      this.update();
    });
  </script>
</sentence-submit>
