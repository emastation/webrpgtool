<objects-top>
  <object-schema-submit if={isLogin}></object-schema-submit>
  <object-schemata-list></object-schemata-list>
  <script>
    Meteor.autorun(()=> {
      self.isLogin = Meteor.user();
      this.update();
    });
  </script>
</objects-top>
