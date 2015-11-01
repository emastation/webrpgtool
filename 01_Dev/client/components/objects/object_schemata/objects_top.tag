<objects-top>
  <object-schemata-submit if={isLogin}></object-schemata-submit>
  <object-schemata-list></object-schemata-list>
  <script>
    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>
</objects-top>
