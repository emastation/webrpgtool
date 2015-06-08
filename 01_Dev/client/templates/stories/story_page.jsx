var StoryPage = ReactMeteor.createClass({
  templateName: "storyPage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newText: ''
    };
  },

  getMeteorState: function() {
    var stories = StoryItems.find({}, {sort: { order: 1 }}).fetch();
    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      stories: stories
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
      comment: 'This is a sentence.'
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
      Hello {storyId}.
    </div>;

  }

});
