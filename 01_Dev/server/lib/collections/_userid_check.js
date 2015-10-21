checkUserId = function(check, type) {
  if(typeof wrt_fixtureLoadedCount !== "undefined" && wrt_fixtureLoadedCount >= 5) {
    check(Meteor.userId(), type);
  }
};
