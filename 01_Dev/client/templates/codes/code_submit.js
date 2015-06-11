Template.codeSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var code = {
      name: $(e.target).find('[name=name]').val(),
      typescript: $(e.target).find('[name=typescript]').val(),
      javascript: $(e.target).find('[name=javascript]').val()
    };

    Meteor.call('codeCreate', code, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.codeExists)
        alert('This title has already been posted');

      Router.go('codeEdit', {_id: result._id});
    });
  }
});
