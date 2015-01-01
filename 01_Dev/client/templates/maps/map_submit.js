Template.mapSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var map = {
      title: $(e.target).find('[name=title]').val(),
      width: 5,
      height: 5,
      type_array:"1 N,1 W,1 N,1 W,1 W\n" +
      "1 N,1 W,1 N,1 W,1 W\n" +
      "1 N,1 N,1 N,1 N,1 N\n" +
      "1 W,1 W,1 N,1 W,1 W\n" +
      "1 W,1 W,1 N,1 W,1 W\n",
      height_array:"0 1,0 1,0 1,0 1,0 1\n" +
      "0 1,0 1,0 1,0 1,0 1\n" +
      "0 1,0 1,0 1,0 1,0 1\n" +
      "0 1,0 1,0 1,0 1,0 1\n" +
      "0 1,0 1,0 1,0 1,0 1\n"
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


