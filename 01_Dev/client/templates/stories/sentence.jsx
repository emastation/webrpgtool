Sentence = React.createClass({

  getInitialState: function() {
    return {
      editable: false
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
      storyId: Router.current().params._id,
      comment: "This is a sentence.",
      text: 'New Sentence',
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

  deleteSentence: function(id) {

    Meteor.call('storyItemDelete', id, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  render: function() {
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
