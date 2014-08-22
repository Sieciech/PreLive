newUpdateHTML = '';
newUpdateStart = false;
newUpdateCount = 0;
function clearFavicon()
{
	var links = document.getElementsByTagName('link');
	for(var i=0; i<links.length; i++)
	{
		var l = links[i];
		if(l.hasAttribute('rel'))
		{
			var rel = l.getAttribute('rel');
			if(rel == 'icon' || rel == 'shortcut icon')
			{
				l.parentNode.removeChild(l);
			}
		}
	}
};
function changeFavicon(src)
{
	clearFavicon();
  var link = document.createElement('link'),
  oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  if (oldLink)
  {
   document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
};
function rand()
{
	return Math.round(Math.random()*1000000000);
};
function changeFaviconRed()
{
  var icon = 'http://michal.sieciechowicz.pl/live-pre/red_'+newUpdateCount+'.png?rnd='+rand();
  console.log('icon', icon)
  changeFavicon(icon);
};
function changeFaviconGreen()
{
  var icon = 'http://michal.sieciechowicz.pl/live-pre/green_'+newUpdateCount+'.png?rnd='+rand();
  console.log('icon', icon)
  changeFavicon(icon);
};
function blinkFavicon()
{
  changeFaviconRed();
  window.origSetTimeout(changeFaviconGreen, 3000);
};
function blinkTitle()
{
  window.oldTitle = document.title;
  window.netTitle = 'Aktualizacja! '+document.title
  document.title = window.netTitle;
  window.origSetTimeout(function()
  {
  	if(document.title == window.netTitle)
  	  document.title = window.oldTitle;
  }, 3000);
};
function newUpdate() {




	window.liveopts_str = "";
	window.groups_str = "";
	window.group_ignore = 0;
	window.timezone = "0";
	window.pretimezone = 0;
	
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
	  //console.log('func', updater);
	
	  if(!updater)
	  {
	    var i = window.origSetTimeout(func, time);
	    window.setTimeouts.push({
	      i: i,
	      func: func,
	      time: time,
	    });
	  }
	};

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
		//console.log('data', data);
		var m = data.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2}\s{0,}[0-9]{2}:[0-9]{2}:[0-9]{2})/);
		//console.log('match', m);
		var last = m[1];
		if(newUpdateHTML != last)
		{
			if(newUpdateStart == false)	
			{
				newUpdateStart = true;
				newUpdateHTML = last;
				document.title = newUpdateCount+') '+last;
				changeFaviconGreen();
				console.log('Cos starego ', last);

			}
			else
			{
				newUpdateCount++;
				newUpdateHTML = last;
				document.title = newUpdateCount+') '+last;
				blinkFavicon();
				blinkTitle();
				console.log('Cos nowego ', last);
				new Audio('http://michal.sieciechowicz.pl/live-pre/sfx.wav').play();
				//alert('Coś nowego!');
			}
		}

		//console.log('newUpdate');
		window.origSetTimeout(newUpdate, 1000);
	});
};

console.log('Live Pre Notifier started');
setTimeout(newUpdate, 400);



