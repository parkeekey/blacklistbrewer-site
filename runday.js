/* Blacklist Brewer — Run Day counter
 *
 * The big DAY number increases by 1 every Sunday (Asia/Bangkok time).
 * The last-Sunday date and the total time since the first Run Day update too.
 *
 * MANUAL OVERRIDE
 *   To force a specific number, set RUN_DAY_OVERRIDE to a number (e.g. 142).
 *   Set it back to null to resume automatic counting.
 *
 * REFERENCE
 *   The count is anchored to a confirmed Sunday. If the confirmed count changes,
 *   update KNOWN_RUN_DAY and KNOWN_SUNDAY below.
 */
(function () {
  var RUN_DAY_OVERRIDE = null;        // null = automatic; e.g. 142 to force
  var KNOWN_RUN_DAY = 141;            // confirmed count
  var KNOWN_SUNDAY = '2026-11-08';    // the Sunday that count belongs to

  var MS_WEEK = 7 * 24 * 60 * 60 * 1000;

  function bangkokToday() {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return new Date(Number(o.year), Number(o.month) - 1, Number(o.day));
  }

  function parseYMD(s) {
    var p = s.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function addDays(d, n) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  }

  function lastSunday(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - x.getDay()); // Sunday = 0
    return x;
  }

  function fmtDate(d) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
  }

  function ymdDiff(a, b) {
    var y = b.getFullYear() - a.getFullYear();
    var m = b.getMonth() - a.getMonth();
    var d = b.getDate() - a.getDate();
    if (d < 0) {
      m -= 1;
      d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    }
    if (m < 0) { y -= 1; m += 12; }
    return { y: y, m: m, d: d };
  }

  var baseSunday = parseYMD(KNOWN_SUNDAY);
  var sunday = lastSunday(bangkokToday());

  var runDay;
  if (typeof RUN_DAY_OVERRIDE === 'number') {
    runDay = RUN_DAY_OVERRIDE;
  } else {
    var weeks = Math.round((sunday - baseSunday) / MS_WEEK);
    runDay = KNOWN_RUN_DAY + weeks;
  }
  if (runDay < 1) runDay = 1;

  var firstSunday = addDays(sunday, -(runDay - 1) * 7);

  var diff = ymdDiff(firstSunday, sunday);
  var duration = [
    diff.y + (diff.y === 1 ? ' year' : ' years'),
    diff.m + (diff.m === 1 ? ' month' : ' months'),
    diff.d + (diff.d === 1 ? ' day' : ' days')
  ].join(', ');

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  setText('.masthead .num', String(runDay));
  setText('.masthead .since-date', 'Last Sunday · ' + fmtDate(sunday));
  setText('.masthead .since-ago', duration + ' since the first Run Day (' + fmtDate(firstSunday) + ')');
})();
