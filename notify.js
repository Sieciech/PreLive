function newUpdate() {
	var ts = new Date().getTime();
	$.get("lastpred.php", { ts: ts, type: liveopts.join('|'), group: groupopts.join('|'), group_ignore: group_ignore, pretimezone: pretimezone, timezone: timezone  }, function(data) {
		$("#livetable").html(data);
		console.log('newUpdate');
		window.setTimeout(update, 3000);
	});
}
window.origSetTimeout = window.setTimeout;
window.setTimeouts = [];
window.setTimeout = function(func, time)
{
  var fstr = func.toString();
  console.log(fstr, func);
  if(fstr.match(/window\.setTimeout\(update,/))
  {
    var i = window.origSetTimeout(newUpdate, time);
  }
  else
  {
    var i = window.origSetTimeout(func, time);
    window.setTimeouts.push({
      i: i,
      func: func,
      time: time,
    });
  }
};
console.log('Live Pre Notifier started');
console.log(window, top);


