/* 顶部 tab 导航：首页 / 工作 / 生活 三选一高亮；按当前文件名判断默认分组 */
(function () {
  var GROUPS = {
    work: [
      { f: 'interview.html', t: '面试提问' },
      { f: 'contract.html', t: '合同试用期' },
      { f: 'wage.html', t: '工资社保' },
      { f: 'social-security.html', t: '社保公积金' },
      { f: 'leave.html', t: '离职竞业' },
      { f: 'retire.html', t: '退休养老' },
      { f: 'rights.html', t: '维权证据' },
      { f: 'tools.html', t: '工具箱' }
    ],
    life: [
      { f: 'rent.html', t: '租房' }
    ]
  };

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file) file = 'index.html';

  // 当前页落在哪个 tab：首页 / 工作 / 生活
  function tabOf(f) {
    if (GROUPS.work.some(function (p) { return p.f === f; })) return 'work';
    if (GROUPS.life.some(function (p) { return p.f === f; })) return 'life';
    return 'home';
  }

  var curTab = tabOf(file); // 唯一高亮项

  var nav = document.getElementById('topnav');
  if (!nav) return;

  function linksHtml(list) {
    return list.map(function (p) {
      var cur = (p.f === file) ? ' cur' : '';
      return '<a href="' + p.f + '" class="' + cur.trim() + '">' + p.t + '</a>';
    }).join('');
  }

  function panelHtml() {
    if (curTab === 'life') {
      return linksHtml(GROUPS.life) + '<span class="navnote">生活篇暂时只有这一个模块</span>';
    }
    if (curTab === 'home') {
      // 首页：展示全部分类，作为站点总览，区别于「工作」tab 的纯工作链接
      return '<span class="navgrp">工作</span>' + linksHtml(GROUPS.work) +
             '<span class="navgrp">生活</span>' + linksHtml(GROUPS.life);
    }
    return linksHtml(GROUPS.work); // 工作 tab：仅工作类
  }

  function render() {
    function tabCls(z) { return 'tab' + (curTab === z ? ' active' : ''); }

    nav.innerHTML =
      '<div class="wrap">' +
        '<div class="nav-row1">' +
          '<div class="brand"><span class="dot">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>' +
          '</span>青年劳动权益手册</div>' +
          '<div class="navtabs">' +
            '<a href="index.html" class="' + tabCls('home') + '">首页</a>' +
            '<button class="' + tabCls('work') + '" data-zone="work">工作</button>' +
            '<button class="' + tabCls('life') + '" data-zone="life">生活</button>' +
          '</div>' +
        '</div>' +
        '<div class="navpanel">' + panelHtml() + '</div>' +
      '</div>';

    var tabs = nav.querySelectorAll('.tab[data-zone]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        curTab = this.getAttribute('data-zone');
        render();
      });
    }
  }

  render();
})();
