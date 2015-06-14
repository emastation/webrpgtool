Sentence = ReactMeteor.createClass({

  getInitialState: function() {
    return {
      editable: false,
      selectedCharacterId: null,
      selectedCharacterImageId: null
    };
  },

  startMeteorSubscriptions: function() {
    Meteor.subscribe("characters");
    Meteor.subscribe("characterImages");
  },

  getMeteorState: function() {

    var characters = Characters.find().fetch();
    var characterImages = CharacterImages.find().fetch();
    if (characters.length > 0 && characterImages.length > 0) {
      if (this.state.selectedCharacterId === null) {
        var characterId = _.isUndefined(this.props.sentence) ? null : this.props.sentence.characterId;
      } else {
        var characterId = this.state.selectedCharacterId;
      }
      characterImages = CharacterImages.find({characterId: characterId}).fetch();
      if (this.state.selectedCharacterImageId === null) {
        var characterImageId = _.isUndefined(this.props.sentence) ? null : this.props.sentence.characterImageId;
      } else {
        var characterImageId = this.state.selectedCharacterImageId;
      }

    } else {
      var characterId = null;
      var characterImageId = null;
    }
    return {
      characters: characters,
      characterImages: characterImages,
      selectedCharacterId: characterId,
      selectedCharacterImageId: characterImageId
    };
  },


  editableThisStory: function() {
    this.setState({
      editable: true
    });
  },

  insertSentence: function(id) {
    var storyItemModelClicked = StoryItems.findOne(id);
    var attributes = {
      sceneId: Router.current().params._id2,
      comment: "This is a sentence.",
      text: 'New Sentence',
      characterId: this.state.selectedCharacterId,
      characterImageId: this.state.selectedCharacterImageId,
      order: storyItemModelClicked.order
    };

    Meteor.call('sentenceInsert', attributes, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

    });
  },

  completeEditing: function(id, evt) {

    if (!this.props.meteorUserExist) {
      return;
    }
    if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
      return; // 処理を抜ける
    }

    var sentence = {
      text: evt.target.textContent
    };

    Sentences.update(id, {$set: sentence}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      }
    });

    evt.target.blur();

    this.setState({
      editable: false
    });
  },

  onChangeSelectCharacterId: function(id, e) {
    this.setState({selectedCharacterId: e.target.value});

    var sentence = {
      characterId: e.target.value
    };

    Sentences.update(id, {$set: sentence}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      }
    });
  },

  onChangeSelectCharacterImageId: function(id, e) {
    this.setState({selectedCharacterImageId: e.target.value});

    var sentence = {
      characterImageId: e.target.value
    };

    Sentences.update(id, {$set: sentence}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      }
    });
  },

  deleteSentence: function(id) {
    Meteor.call('storyItemDelete', id, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  render: function() {
    var characterOptions = this.state.characters.map(function(character) {
      return <option value={character._id} key={character._id}>{character.name}</option>;
    });
    var characterImageOptions = this.state.characterImages.map(function(characterImage) {
      return <option value={characterImage._id} key={characterImage._id}>{characterImage.pose}</option>;
    });

    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
      var plusButton = <button type="button" className="plus" data-dismiss="alert" onClick={this.insertSentence.bind(this, this.props.storyItem._id)}>
        <span aria-hidden="true">+</span><span className="sr-only">Plus</span>
      </button>;
      var closeButton = <button type="button" className="close" data-dismiss="alert" onClick={this.deleteSentence.bind(this, this.props.storyItem._id)}>
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
    }

    var text = _.isUndefined(this.props.sentence) ? '' : this.props.sentence.text;
    var sentenceId = _.isUndefined(this.props.sentence) ? '' : this.props.sentence._id;
    var contentEditable = this.state.editable && this.props.meteorUserExist;

    return <li data-id={this.props.storyItem._id} data-order={this.props.storyItem.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      { plusButton }
      <select value={this.state.selectedCharacterId} onChange={this.onChangeSelectCharacterId.bind(this, sentenceId)}>
        {characterOptions}
      </select>
      <select value={this.state.selectedCharacterImageId} onChange={this.onChangeSelectCharacterImageId.bind(this, sentenceId)}>
        {characterImageOptions}
      </select>
      <span className="name" contentEditable={contentEditable}
            onClick={this.editableThisStory}
            onBlur={this.completeEditing.bind(this, sentenceId)}
            onKeyDown={this.completeEditing.bind(this, sentenceId)}
          >{text}</span>
      <span className="badge">{this.props.storyItem.order}</span>
      { closeButton }
    </li>
  }
});
