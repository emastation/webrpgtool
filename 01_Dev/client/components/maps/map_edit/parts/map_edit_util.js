mapEditUpdateSelectedClass = function(target) {
  $("a[id^='texture_']>div").removeClass('selected');
  $("a[id^='tiletype_']>div").removeClass('selected');
  $("a[id^='floorheight_']>div").removeClass('selected');
  $("a[id^='ceilingheight_']>div").removeClass('selected');
  $("a[id^='script_']>div").removeClass('selected');

  $(target).addClass('selected');
};
