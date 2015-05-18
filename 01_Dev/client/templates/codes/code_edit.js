Template.codeEdit.events({
  'submit form': function (e) {
    e.preventDefault();

    var currentCodeId = this.code._id;

    var code = Codes.findOne(currentCodeId);
    if (!ownsDocument(Meteor.userId(), code)) {
      alert("今編集しようとしているコードは、あなたのコードではありません。送信をキャンセルします。");
      Router.go('codesList');
    }

    var codeAttributes = {
      name: $(e.target).find('[name=name]').val(),
      typescript: $(e.target).find('[name=typescript]').val(),
      javascript: $(e.target).find('[name=javascript]').val(),
      userId: code.userId,
      author: code.author,
      submitted: code.submitted
    };

    Meteor.call('codeUpdate', {codeId:currentCodeId, codeAttributes:codeAttributes}, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      Router.go('codeEdit', {_id: currentCodeId});
    });

  }
});