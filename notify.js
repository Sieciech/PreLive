function newUpdate() {
	var ts = new Date().getTime();
	$.get("lastpred.php", {
		ts: ts,
		type: liveopts.join('|'),
		group: groupopts.join('|'),
		group_ignore: group_ignore,
		pretimezone: pretimezone,
		timezone: timezone 
	}, function(data) {
		$("#livetable").html(data);
		console.log('newUpdate');
		window.setTimeout(newUpdate, 3000);
	});
}
var liveopts_str = "";
var groups_str = "";
var group_ignore = 0;
var timezone = "0";
var pretimezone = 0;

if (liveopts_str.length > 0) {
	var liveopts = $.trim(liveopts_str).split('|');
	$.each(liveopts, function(index, value) { 
		var cell = $('tr', '#filter_tbl').children().filter(function(){ return $(this).text() == value; });
		if (cell) {
			cell.css('color','white');
		}
	});
} else {
	var liveopts = new Array();
}

if (groups_str.length > 0) {
	var groupopts = $.trim(groups_str).split('|');
	$.each(groupopts, function(index, value) { 
		if (value.length > 0) {
			$('#group_list', '#filter_tbl').append('<option opt="group">'+value+'</option>');
		}
	});
} else {
	var groupopts = new Array();
}

if (group_ignore) {
	$("td[opt='group_ignore']", '#filter_tbl').css('color','white');
} else {
	$("td[opt='group_ignore']", '#filter_tbl').css('color','');
}
window.origSetTimeout = window.setTimeout;
window.setTimeouts = [];
window.setTimeout = function(func, time)
{
  var fstr = func.toString();
  var updater = fstr.match(/window\.setTimeout\(update,\s/i)?true:false;
  console.log('func', updater);

  if(updater)
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


