/* 顶部导航：工作 / 生活 并列两栏显示（不再用切换 tab） */
(function () {
  var GROUPS = {
    work: [
      { f: 'interview.html', t: '面试提问' },
      { f: 'contract.html', t: '合同试用期' },
      { f: 'wage.html', t: '工资社保' },
      { f: 'social-security.html', t: '社保公积金' },
      { f: 'tax.html', t: '个税汇算' },
      { f: 'leave.html', t: '离职竞业' },
      { f: 'retire.html', t: '退休养老' },
      { f: 'rights.html', t: '维权证据' },
      { f: 'internship.html', t: '实习权益' },
      { f: 'tools.html', t: '工具箱' }
    ],
    life: [
      { f: 'rent.html', t: '租房' }
    ]
  };

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file) file = 'index.html';

  var nav = document.getElementById('topnav');
  if (!nav) return;

  function colHtml(list, label) {
    var links = list.map(function (p) {
      var cur = (p.f === file) ? ' cur' : '';
      return '<a href="' + p.f + '" class="' + cur.trim() + '">' + p.t + '</a>';
    }).join('');
    return '<div class="navgroup"><span class="navgrp">' + label + '</span><div class="navlinks">' + links + '</div></div>';
  }

  nav.innerHTML =
    '<div class="wrap">' +
      '<div class="nav-row1">' +
        '<div class="brand"><span class="dot">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>' +
        '</span>新青年手册</div>' +
        '<div class="navtabs"><a href="index.html" class="' + (file === 'index.html' ? 'active' : '') + '">首页</a></div>' +
      '</div>' +
      '<div class="navpanel">' + colHtml(GROUPS.work, '工作') + colHtml(GROUPS.life, '生活') + '</div>' +
    '</div>';
})();
