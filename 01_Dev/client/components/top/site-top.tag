<site-top>
  <game-submit if={isLogin}></game-submit>
  <games-list></games-list>

  <script>
    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>
</site-top>
