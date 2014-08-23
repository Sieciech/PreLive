newUpdateHTML = '';
newUpdateTime = 0;
newUpdateStart = false;
newUpdateCount = 0;
newUpdateColor = 'green';
newUpdateType = location.host=='trace.corrupt-net.org'?'trace':'pre';
newUpdateUrl = newUpdateType=='pre'?'lastpred.php':'lasttraced.php';
newUpdateSfx = newUpdateType=='pre'?'sfx.wav':'sfx2.wav';
newUpdateTimeout = 750;
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
  var theX = newUpdateType=='trace'?'':'_x';
  var icon = 'http://michal.sieciechowicz.pl/live-pre/'+newUpdateColor+'_'+newUpdateCount+theX+'.png';
  console.log('icon', icon)
  changeFavicon(icon);
};
function changeFaviconGreen()
{
  var theX = newUpdateType=='trace'?'_x':'';
  var icon = 'http://michal.sieciechowicz.pl/live-pre/'+newUpdateColor+'_'+newUpdateCount+theX+'.png';
  console.log('icon', icon)
  changeFavicon(icon);
};
function blinkFavicon()
{
  changeFaviconRed();
  window.origSetTimeout(changeFaviconGreen, 1000);
  window.origSetTimeout(changeFaviconRed, 1500);
  window.origSetTimeout(changeFaviconGreen, 2250);
  window.origSetTimeout(changeFaviconRed, 2750);
  window.origSetTimeout(changeFaviconGreen, 3000);
  window.origSetTimeout(changeFaviconGreen, 3500);
};
function blinkTitle()
{
  window.oldTitle = document.title;
  window.netTitle = 'Aktualizacja|'+document.title
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
  if(newUpdateType == 'pre')
  {
	  var newTime = Math.floor(new Date(time).getTime()/1000);
	  var actDate = new Date();
	  var actTime = Math.floor(actDate.getTime()/1000)-7200;
	  var diffTime = actTime - newTime;
	  var actDate = actDate.toJSON();
	  var actDate = actDate.substring(0, 19);
	  var actDate = actDate.replace('T', ' ');
	  var tH = Math.floor(diffTime/3600);
	  var diffTime = diffTime - (tH*3600);
	  var tM = Math.floor(diffTime/60);
	  var diffTime = diffTime - (tM*60);
	  var tS = diffTime%60;
	  var tH = tH%24;
	
	  if(tH < 10)  var tH = '0'+tH;
	  if(tM < 10)  var tM = '0'+tM;
	  if(tS < 10)  var tS = '0'+tS;

	  $('#newTimer').html('<div style="display:inline-block;vertical-align:top;padding-right:20px;color:#f00;">+'+tH+':'+tM+':'+tS+'</div><div style="display:inline-block;vertical-align:top;">'+actDate+'</div>');
	}
}
function strip_tags(input, allowed) {
  //  discuss at: http://phpjs.org/functions/strip_tags/
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

function newUpdatePre(data)
{
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
			var xtype = as.length > 0?as[0].innerHTML+'|':'';
			var group = as.length > 1?as[1].innerHTML+'|':'';
			newUpdateColor = as.length > 0?as[0].style.color:'green';
			if(newUpdateColor[0] == '#')
			{
			  newUpdateColor = 'xx'+newUpdateColor.substr(1);
			}
			else if(newUpdateColor.substr(0, 3) == 'rgb')
			{
			  var m = newUpdateColor.match(/\(([0-9]{1,3}),\s{0,}([0-9]{1,3}),\s{0,}([0-9]{1,3})/i);
			  if(m)
			  {
			    console.log('rgb', m[1], m[2], m[3], m);
			    newUpdateColor = 'xx'+dec2hex(m[1])+dec2hex(m[2])+dec2hex(m[3]);
			  }
			}
			var lastdate = xtype+group+last.substr(11);
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
				var sfx = new Audio('http://michal.sieciechowicz.pl/live-pre/'+newUpdateSfx);
				sfx.play();
			}
		}
	}
}
function newUpdateTrace(data)
{
	var text = strip_tags(data);
	var m = text.match(/\[([0-9a-z\s.]{5,})\]/i);
	if(m)
	{
	  var last = m[1];
	  if(last != newUpdateHTML)
	  {
			$("#livetable").html(data);
			var tds = document.getElementById('livetable').getElementsByTagName('td');
			newUpdateCount = tds.length>0?tds[0].innerHTML:'0';
			while(newUpdateCount.match('&nbsp;'))
			  newUpdateCount = newUpdateCount.replace('&nbsp;', '');
			newUpdateColor = tds.length>1?tds[1].style.color:'green';
			if(newUpdateColor[0] == '#')
			{
			  newUpdateColor = 'xx'+newUpdateColor.substr(1);
			}
			else if(newUpdateColor.substr(0, 3) == 'rgb')
			{
			  var m = newUpdateColor.match(/\(([0-9]{1,3}),\s{0,}([0-9]{1,3}),\s{0,}([0-9]{1,3})/i);
			  if(m)
			  {
			    console.log('rgb', m[1], m[2], m[3], m);
			    newUpdateColor = 'xx'+dec2hex(m[1])+dec2hex(m[2])+dec2hex(m[3]);
			  }
			}
			var group = tds.length>1?tds[1].innerHTML:'';
			while(group.match('&nbsp;'))
			  var group = group.replace('&nbsp;', '');
			var title = tds.length>2?'|'+tds[2].innerHTML:'';
			while(title.match('&nbsp;'))
			  var title = title.replace('&nbsp;', '');
			var lastdate = group+title;
			if(newUpdateStart == false)	
			{
				newUpdateStart = true;
				newUpdateHTML = last;
				document.title = lastdate;
				changeFaviconGreen();
				console.log('Cos starszego ', last);
			}
			else
			{
				//newUpdateCount++;
				newUpdateHTML = last;
				document.title = lastdate;
				blinkFavicon();
				blinkTitle();
				console.log('Cos nowego ', last);
				var sfx = new Audio('http://michal.sieciechowicz.pl/live-pre/'+newUpdateSfx);
				sfx.play();
			}
	  }
	}
}
function newUpdate() {

	var ts = new Date().getTime();
	$.get(newUpdateUrl, {
		ts: ts,
		type: getLiveOpts(),
		group: getGroupOpts(),
		group_ignore: getGroupIgnore(),
		pretimezone: pretimezone,
		timezone: timezone 
	}, function(data) {
		if(newUpdateType == 'pre')
			newUpdatePre(data);
		else if(newUpdateType == 'trace')
			newUpdateTrace(data);
	  window.origSetTimeout(newUpdate, newUpdateTimeout);	
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
function dec2hex(n){
    n = parseInt(n); var c = 'ABCDEF';
    var b = n / 16; var r = n % 16; b = b-(r/16); 
    b = ((b>=0) && (b<=9)) ? b : c.charAt(b-10);    
    return ((r>=0) && (r<=9)) ? b+''+r : b+''+c.charAt(r-10);
}
window.liveopts_str = "";
window.groups_str = "";
window.group_ignore = 0;
window.timezone = "0";
window.pretimezone = 0;
var t = document.createElement('div');
t.style.position = 'absolute';
t.style.top = '6px'; 
t.style.zIndex = '10000';
t.style.left = '0px';
t.style.width = '100%';
t.innerHTML = '<div style="max-width:954px;text-align:right;margin:0px auto;height:1px;color:#657383;"><div id="newTimer" style="height:1px;"></div></div>';
document.body.appendChild(t);
console.log('Live Pre Notifier started');
setTimeout(newUpdate, 200);
