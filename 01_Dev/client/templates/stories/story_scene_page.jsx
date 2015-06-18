var SortableStoryItems = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
    handle: ".sortable-handle",
    model: "storyItems"
  },

  collectionName: "storyItems", // SortableMixinに、どのCollectionのorderを操作するか指定する
  sortingScopeValue: '', // collectionNameで指定したCollectionで、このコンポーネントで操作する対象のScopeプロパティの値を指定する

  getInitialState: function() {
    this.sortingScopeValue = Router.current().params._id2;
    return {
    };
  },

  renderSentence: function(model, i) {
    return <Sentence key={model._id} sentence={this.props.sentences[i]} storyItem={ model } meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StoryItemList" key="1">
      { this.props.storyItems.map(this.renderSentence) }
    </ul>;
  }
});


var StoryScenePage = ReactMeteor.createClass({
  templateName: "storyScenePage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newText: '',
      selectedCharacterId: null,
      selectedCharacterImageId: null
    };
  },

  startMeteorSubscriptions: function() {
    Meteor.subscribe("storyScenes"); // goBackToSceneListのためだけ
    Meteor.subscribe("storyItems");
    Meteor.subscribe("sentences");
    Meteor.subscribe("characters");
    Meteor.subscribe("characterImages");
  },

  goBackToSceneList: function() {
    var storyId = Router.current().params._id;

    Router.go('storyPage', {_id: storyId});
  },

  getMeteorState: function() {
    var sceneId = Router.current().params._id2;

    var storyItems = MongoCollections.StoryItems.find({sceneId:sceneId}, {sort: { order: 1 }}).fetch();
    var sentenceIds = [];
    storyItems.map(function(storyItem){
      sentenceIds.push(storyItem.contentId);
    });

    var selector = {_id: {$in: sentenceIds}};
    var sentencesTmp = MongoCollections.Sentences.find(selector).fetch();
    var sentences = [];
    storyItems.map(function(storyItem){
      var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
      sentences.push(sentence);
    });

    var characters = Characters.find({useForNovel: true}).fetch();
    var characterImages = CharacterImages.find().fetch();
    if (characters.length > 0 && characterImages.length > 0) {
      if (this.state.selectedCharacterId === null) {
        var characterId = characters[0]._id;
      } else {
        var characterId = this.state.selectedCharacterId;
      }
      characterImages = CharacterImages.find({characterId: characterId}).fetch();
      if (this.state.selectedCharacterImageId === null) {
        var characterImageId = characterImages[0]._id;
      } else {
        var characterImageId = this.state.selectedCharacterImageId;
      }

    } else {
      var characterId = null;
      var characterImageId = null;
    }
    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      storyItems: storyItems,
      sentences: sentences,
      characters: characters,
      characterImages: characterImages,
      selectedCharacterId: characterId,
      selectedCharacterImageId: characterImageId
    };
  },


  newTextChange: function(e) {
    this.setState({
      newText: e.target.value
    });
  },

  onChangeSelectCharacterId: function(e) {
    this.setState({selectedCharacterId: e.target.value});
  },

  onChangeSelectCharacterImageId: function(e) {
    this.setState({selectedCharacterImageId: e.target.value});
  },

  submitNewItem: function(e) {
    e.preventDefault();

    var sceneId = Router.current().params._id2;

    var attributes = {
      sceneId: sceneId,
      comment: "This is a sentence.",
      text: this.state.newText,
      characterId: this.state.selectedCharacterId,
      characterImageId: this.state.selectedCharacterImageId
    };

    var that = this;
    Meteor.call('sentencePush', attributes, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      that.setState({
        newText: ''
      });
    });

  },

  render: function() {
    var characterOptions = this.state.characters.map(function(character) {
      return <option value={character._id} key={character._id}>{character.name}</option>;
    });
    var characterImageOptions = this.state.characterImages.map(function(characterImage) {
      return <option value={characterImage._id} key={characterImage._id}>{characterImage.pose}</option>;
    });

    if (this.state.displaySubmitForm) {
      var form = <form className="main form" onSubmit={this.submitNewItem}>
        <div className="form-group">
          <label className="control-label" htmlFor="title">センテンス</label>
          <div className="controls">
            <select value={this.state.selectedCharacterId} onChange={this.onChangeSelectCharacterId}>
              {characterOptions}
            </select>
            <select value={this.state.selectedCharacterImageId} onChange={this.onChangeSelectCharacterImageId}>
              {characterImageOptions}
            </select>
            <textarea name="text" id="text" placeholder="Name your new sentence." className="form-control" onChange={this.newTextChange}>{this.state.newText}</textarea>
          </div>
        </div>
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>;
    } else {
      var form = {}
    }

    return <div className="StoryPage">
      { form }
      <p><a href="#" onClick={this.goBackToSceneList}>シーンリストに戻る</a></p>
      <SortableStoryItems sentences={ this.state.sentences } storyItems={ this.state.storyItems } meteorUserExist={this.state.displaySubmitForm} />
    </div>;

  }

});
