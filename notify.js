top.xo = true;
window.origSetTimeout = window.setTimeout;
window.setTimeouts = [];
window.setTimeout = function(func, time)
{
  var i = window.origSetTimeout(func, time);
  window.setTimeouts.push({
    i: i,
    func: func,
    time: time,
  });
};
console.log('Live Pre Notifier started');
console.log(window, top);
