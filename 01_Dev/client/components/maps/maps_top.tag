<maps-top>
  <map-submit if={isLogin}></map-submit>
  <maps-list></maps-list>
  <script>
    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>
</maps-top>
