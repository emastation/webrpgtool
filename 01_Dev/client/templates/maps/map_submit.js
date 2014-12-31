Template.mapSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var map = {
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('mapInsert', map, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.postExists)
        alert('This title has already been posted');

      Router.go('mapEdit', {_id: result._id});
    });
  }
});


