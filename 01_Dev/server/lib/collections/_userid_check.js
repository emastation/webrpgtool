checkUserId = function(check, type) {
  if(typeof wrt_fixtureLoadedCount !== "undefined" && wrt_fixtureLoadedCount >= 4) {
    check(Meteor.userId(), type);
  }
};
