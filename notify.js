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
  var icon = 'http://michal.sieciechowicz.pl/live-pre/red_'+newUpdateCount+'.png';
  console.log('icon', icon)
  changeFavicon(icon);
};
function changeFaviconGreen()
{
  var icon = 'http://michal.sieciechowicz.pl/live-pre/green_'+newUpdateCount+'.png';
  console.log('icon', icon)
  changeFavicon(icon);
};
function blinkFavicon()
{
  changeFaviconRed();
  window.origSetTimeout(changeFaviconGreen, 1000);
  window.origSetTimeout(changeFaviconRed, 1500);
  window.origSetTimeout(changeFaviconGreen, 2500);
  window.origSetTimeout(changeFaviconRed, 3000);
  window.origSetTimeout(changeFaviconGreen, 3500);
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
function getLiveOpts()
{
	var tds = document.getElementsByTagName('td');
	var types = [];
	for(var i=0; i<tds.length; i++)
	{
		var td = tds[i];
		if(td.hasAttribute('opt') && td.getAttribute('opt') == 'type')
		{
		  if(td.style.color == 'white')
		    types.push(td.innerHTML);
		}
	}
	return types.join('|');
}
function getGroupOpts()
{
	var tds = document.getElementById('group_list');
	var types = [];
	for(var i=0; i<tds.children.length; i++)
	{
		var td = tds.children[i];
		if(td.hasAttribute('opt') && td.getAttribute('opt') == 'group')
		{
		  types.push(td.innerHTML);
		}
	}
	return types.join('|');
}
function getGroupIgnore()
{
	var tds = document.getElementsByTagName('td');
	var types = [];
	for(var i=0; i<tds.length; i++)
	{
		var td = tds[i];
		if(td.hasAttribute('opt') && td.getAttribute('opt') == 'group_ignore')
		{
		  return (td.style.color == 'white')?1:0;
		}
	}
	return 0;
	
}
function newUpdate() {

	var ts = new Date().getTime();
	$.get("lastpred.php", {
		ts: ts,
		type: getLiveOpts(),
		group: getGroupOpts(),
		group_ignore: getGroupIgnore(),
		pretimezone: pretimezone,
		timezone: timezone 
	}, function(data) {
		$("#livetable").html(data);
		//console.log('data', data);
		var m = data.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2}\s{0,}[0-9]{2}:[0-9]{2}:[0-9]{2})/);
		//console.log('match', m);
		if(m)
		{
			var last = m[1];
			if(newUpdateHTML != last)
			{
				if(newUpdateStart == false)	
				{
					newUpdateStart = true;
					newUpdateHTML = last;
					document.title = last;
					changeFaviconGreen();
					console.log('Cos starszego ', last);
	
				}
				else if(newUpdateHTML > last)
				{
					newUpdateStart = true;
					newUpdateHTML = last;
					document.title = last;
					blinkFavicon();
					console.log('Cos starego ', last);
		
				}
				else
				{
					newUpdateCount++;
					newUpdateHTML = last;
					document.title = last;
					blinkFavicon();
					blinkTitle();
					console.log('Cos nowego ', last);
					new Audio('http://michal.sieciechowicz.pl/live-pre/sfx.wav').play();
				}
			}
		}

		window.origSetTimeout(newUpdate, 750);
	});
};
window.origSetTimeout = window.setTimeout;
window.setTimeouts = [];
window.setTimeout = function(func, time)
{
  var fstr = func.toString();
  var updater = fstr.match(/window\.setTimeout\(update,\s/i)?true:false;
  //console.log('func', updater);

  if(!updater)
  {
    window.origSetTimeout(func, time);
  }
};

window.liveopts_str = "";
window.groups_str = "";
window.group_ignore = 0;
window.timezone = "0";
window.pretimezone = 0;


console.log('Live Pre Notifier started');
setTimeout(newUpdate, 400);

