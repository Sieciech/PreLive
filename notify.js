newUpdateHTML = '';
newUpdateTime = 0;
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
function updateTime(time)
{
	var newTime = Math.floor(new Date(time).getTime()/1000);
	var actDate = new Date();
	var actTime = Math.floor(actDate.getTime()/1000)-7200;
	var diffTime = actTime - newTime;
	$('#newTimer').html('<div>+'+diffTime+'</div><div>'+actDate+'</div>');
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
		updateTime(newUpdateTime);
		//console.log('data', data);
		var m = data.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2}\s{0,}[0-9]{2}:[0-9]{2}:[0-9]{2})/);
		//console.log('match', m);
		if(m)
		{
			var last = m[1];
			updateTime(last);
			if(newUpdateHTML != last)
			{
				$("#livetable").html(data);
				var as = document.getElementById('livetable').getElementsByTagName('a');
				var group = as.length > 0?as[0].innerHTML:'';
				var lastdate = last.substr(11)+' '+group;
				if(newUpdateStart == false)	
				{
					newUpdateStart = true;
					newUpdateHTML = last;
					document.title = lastdate;
					changeFaviconGreen();
					console.log('Cos starszego ', last);
				}
				else if(newUpdateHTML > last)
				{
					newUpdateStart = true;
					newUpdateHTML = last;
					document.title = lastdate;
					blinkFavicon();
					console.log('Cos starego ', last);
				}
				else
				{
					newUpdateCount++;
					newUpdateHTML = last;
					document.title = lastdate;
					blinkFavicon();
					blinkTitle();
					console.log('Cos nowego ', last);
					new Audio('http://michal.sieciechowicz.pl/live-pre/sfx.wav').play();
				}
			}
		}

		window.origSetTimeout(newUpdate, 1000);
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
  else
  {
    window.setTimeout = window.origSetTimeout;
  }
};

window.liveopts_str = "";
window.groups_str = "";
window.group_ignore = 0;
window.timezone = "0";
window.pretimezone = 0;
var t = document.createElement('div');
t.style.position = 'absolute';
t.style.top = '0px';
t.style.zIndex = '10000';
t.style.left = '0px';
t.style.width = '100%';
t.innerHTML = '<div style="max-width:100%;text-align:right;color:#888;margin:0px auto;height:1px;"><div id="newTimer"></div></div>';
document.body.appendChild(t);
console.log('Live Pre Notifier started');
setTimeout(newUpdate, 200);

