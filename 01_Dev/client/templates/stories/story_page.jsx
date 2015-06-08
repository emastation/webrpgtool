var Sentence = React.createClass({

  render: function() {
    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
    } else {
      var sortableHandle = {};
    }

    return <li data-id={this.props.storyItem._id} data-order={this.props.storyItem.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      <span className="name">{this.props.sentence.text}</span>
      <span className="badge">{this.props.storyItem.order}</span>
    </li>
  }
});

var SortableStoryItems = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
    handle: ".sortable-handle",
    model: "storyItems"
  },

  collectionName: "storyItems",

  renderSentence: function(model, i) {
    return <Sentence key={model._id} sentence={this.props.sentences[i]} storyItem={ model } meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StoryItemList" key="1">
      { this.props.storyItems.map(this.renderSentence) }
    </ul>;
  }
});


var StoryPage = ReactMeteor.createClass({
  templateName: "storyPage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newText: ''
    };
  },

  startMeteorSubscriptions: function() {
    Meteor.subscribe("storyItems");
    Meteor.subscribe("sentences");
  },

  getMeteorState: function() {
    var storyId = Router.current().params._id;

    var storyItems = StoryItems.find({storyId:storyId}, {sort: { order: 1 }}).fetch();
    var sentenceIds = [];
    storyItems.map(function(storyItem){
      sentenceIds.push(storyItem.contentId);
    });

    var selector = {_id: {$in: sentenceIds}};
    var sentencesTmp = Sentences.find(selector).fetch();
    var sentences = [];
    storyItems.map(function(storyItem){
      var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
      sentences.push(sentence);
    });


    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      storyItems: storyItems,
      sentences: sentences
    };
  },


  newTextChange: function(e) {
    this.setState({
      newText: e.target.value
    });
  },

  submitNewItem: function(e) {
    e.preventDefault();

    var storyId = Router.current().params._id;

    var storyItem = {
      storyId: storyId,
      contentId: '',
      comment: 'This is a sentence.',
      order: -1
    };

    var that = this;
    var promise = new RSVP.Promise(function(fulfill, reject) {
      Meteor.call('storyItemInsert', storyItem, function(err, resOne) {
        if (err) {
          return reject(err);
        }
        fulfill(resOne);
      });
    });
    promise.then(function(resOne) {
      return new RSVP.Promise(function(fulfill, reject) {
        var sentence = {
          text: that.state.newText,
          storyItemId: resOne._id
        };
        Meteor.call('sentenceInsert', sentence, function(err, resTwo) {
          if (err) {
            return reject(err);
          }
          fulfill({resOne:resOne, resTwo:resTwo});
        });
      });
    }).then(function(obj) {
      return new RSVP.Promise(function(fulfill, reject) {
        var storyItem = {
          contentId: obj.resTwo._id
        };
        StoryItems.update(obj.resOne._id, {$set: storyItem}, function(err) {
          if (err) {
            reject(err);
          }
          fulfill();
        });
      });
    }).then(function() {
      console.log("OK!");
      that.setState({
        newText: ''
      });
    }).catch(function(err) {
      console.log(err);
    });

  },

  render: function() {

    if (this.state.displaySubmitForm) {
      var form = <form className="main form" onSubmit={this.submitNewItem}>
        <div className="form-group">
          <label className="control-label" htmlFor="title">センテンス</label>
          <div className="controls">
            <input name="title" id="title" type="text" value={this.state.newText} placeholder="Name your new sentence." className="form-control" onChange={this.newTextChange}/>
          </div>
        </div>
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>;
    } else {
      var form = {}
    }

    var storyId = Router.current().params._id;

    return <div className="StoryPage">
      { form }
      <SortableStoryItems sentences={ this.state.sentences } storyItems={ this.state.storyItems } meteorUserExist={this.state.displaySubmitForm} />
    </div>;

  }

});
