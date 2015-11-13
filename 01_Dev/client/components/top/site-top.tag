<site-top>
  <game-submit if={isLogin}></game-submit>
  <games-list is_login={isLogin}></games-list>

  <script>
    Meteor.autorun(()=> {
      this.isLogin = Meteor.userId() ? true : false;
      this.update();
    });
  </script>
</site-top>
