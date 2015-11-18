<story-submit if={isLogin}>
  <div class="ui segment">
    <form class="ui form" onsubmit={submitNewStory}>
      <div class="field">
        <label>タイトル</label>
        <input name="title" id="title" type="text" placeholder="新しいストーリーのタイトルを入力してください。" kl_vkbd_parsed="true" />
      </div>
      <input type="submit" value="投稿  " class="ui submit button"/>
    </form>
  </div>

  <script>
    submitNewStory(e) {
      e.preventDefault();

      var story = {
        title: this.title.value,
        game_id: opts.game_id,
        order: -1
      };

      Meteor.call('createStory', story, function(error, result) { // display the error to the user and abort
        if (error)
          return alert(error.reason);

        if (result.storyExists)
          return alert('This Story has already been posted');

      });

      this.title.value = '';
      Session.set('StoryItem_changed', Date.now());
    }
    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false
      this.update();
    });
  </script>

</story-submit>
