<sentence-item>
  <div class="sortable-item removable ui grid segment">
    <div class="two wide columns">
      <i if={isLogin} class="sortable-handle mdi-action-view-headline">=&nbsp;</i>
      <button if={isLogin} type="button" class="plus circular ui icon button" onclick={insertSentence}>
        <i class="plus icon"></i>
      </button>
    </div>
    <div class="four wide columns">
      <select value={selectedCharacterId} onchange={onChangeSelectCharacterId}>
        <option each={characters} value={_id}>{name}</option>
      </select>
      <select value={selectedCharacterImageId} onchange={onChangeSelectCharacterImageId}>
        <option each={characterImages} value={_id}>{pose}</option>
      </select>
      <select value={opts.sentence_item.position} onchange={onChangeSelectCharacterPosition}>
        <option each={characterPositions} value={identifier}>{name}</option>
      </select>
    </div>
    <div class="name nine wide column" ondblclick={editableThisStory}>
      <span if={!contentEditable}>{sentenceTextForSpan}</span>
      <input if={contentEditable} type="text" name="sentenceText" value={sentenceTextForSpan} onblur={completeEditing} onkeydown={completeEditing}>
    </div>
    <span class="badge">{opts.story_item.order}</span>
    <button if={isLogin} type="button" class="close circular ui icon button" data-dismiss="alert" onclick={deleteSentence}>
      <i class="remove icon"></i>
    </button>
  </div>

  <script>
    this.characterPositions = CHARACTER_POSITIONS;

    insertSentence(id) {

      var storyItemModelClicked = MongoCollections.StoryItems.findOne(opts.story_item._id);

      window.wrtSubmitMasterRiotComponent.trigger('insertStoryItem', storyItemModelClicked.order);
    }

    completeEditing(evt) {

      if (!this.isLogin) {
        return;
      }
      if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
        return true; // 処理を抜ける
      }

      var sentence = {
        text: this.sentenceText.value
      };

      MongoCollections.Sentences.update(opts.sentence_item._id, {$set: sentence}, (error)=> {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
        this.sentenceTextForSpan = this.sentenceText.value;
        this.update();

      });

      evt.target.blur();

      this.editable = false;

    }

    deleteSentence() {
      Meteor.call('deleteStoryItem', opts.sentence_item.storyItemId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
        Session.set('storyItems_changed', Date.now());
      });
    }

    onChangeSelectCharacterId(e) {
      var characterImage = MongoCollections.CharacterImages.find({characterId: e.target.value}).fetch()[0];

      this.selectedCharacterId = e.target.value;
      this.selectedCharacterImageId = characterImage._id

      var sentence = {
        characterId: e.target.value,
        characterImageId: characterImage._id
      };

      MongoCollections.Sentences.update(opts.sentence_item._id, {$set: sentence}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    onChangeSelectCharacterImageId(e) {
      this.selectedCharacterImageId = e.target.value;

      var sentence = {
        characterImageId: e.target.value
      };

      MongoCollections.Sentences.update(opts.sentence_item._id, {$set: sentence}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    onChangeSelectCharacterPosition(e) {
      var sentence = {
        position: e.target.value
      };

      MongoCollections.Sentences.update(opts.sentence_item._id, {$set: sentence}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    }

    this.getData = ()=> {
      if (!opts.sentence_item) {
        return;
      }
      this.characters = MongoCollections.Characters.find({useForNovel: true}).fetch();
      this.characterImages = MongoCollections.CharacterImages.find({characterId: opts.sentence_item.characterId}).fetch();
      opts.sentence_item.characterImageId;

      this.selectedCharacterId = opts.sentence_item.characterId
      this.selectedCharacterImageId = opts.sentence_item.characterImageId
      this.update();

    }

    this.on('update', ()=>{
      this.contentEditable = this.editable && this.isLogin;
      if (!this.sentenceTextForSpan && opts.sentence_item) {
        this.sentenceTextForSpan = opts.sentence_item.text;
      }
      this.getData();
      this.update();
    });

    editableThisStory() {
      this.editable = true;
      this.update();
    }

    this.on('mount', ()=>{
      Meteor.subscribe('characters', {
        onReady: ()=>{
          Meteor.subscribe('characterImages', {
            onReady: ()=>{
              this.getData();
            }
          });
        }
      });
      Meteor.subscribe('sentences');
      Meteor.subscribe('sentenceImages');
    });

    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.getData();
    });

  </script>

  <style scoped>
    input {
      width: 100%;
    }
  </style>
</sentence-item>
