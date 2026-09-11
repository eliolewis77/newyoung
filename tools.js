function nMonthsOf(years){
  var full=Math.floor(years);
  var rem=(years-full)*12;
  var add=rem>=6?1:(rem>0?0.5:0);
  return full+add;
}
function calcN(){
  var y=parseFloat(document.getElementById('years').value);
  var s=parseFloat(document.getElementById('salary').value);
  var capRaw=document.getElementById('cap').value;
  var cap=capRaw?parseFloat(capRaw):null;
  var illegal=document.getElementById('illegal').value==='1';
  if(!(y>0)||!(s>0)){document.getElementById('nResult').textContent='请先填工作年限和月平均工资。';return;}
  var months=nMonthsOf(y);
  var base=s, note='';
  if(cap && s>cap){
    var yc=Math.min(y,12);
    months=nMonthsOf(yc);
    base=cap;
    note='（你的工资超过当地社平3倍，已按3倍封顶、年限最高12年计算）';
  }
  var econ=base*months;
  var comp=illegal?econ*2:econ;
  var nLabel=illegal?'2N 违法解除赔偿':'N 经济补偿';
  document.getElementById('nResult').innerHTML=
    '补偿月数：<b>'+months+' 个月</b><br>'+
    '计算基数：'+base.toLocaleString()+' 元 / 月 '+note+'<br>'+
    nLabel+'：<span class="big">'+comp.toLocaleString()+' 元</span>'+
    (illegal?'<br><span class="hint">合法解除一般另算代通知金（1个月），此处仅算赔偿部分。</span>':'');
}
function calcOT(){
  var m=parseFloat(document.getElementById('msalary').value);
  if(!(m>0)){document.getElementById('otResult').textContent='请先填月薪。';return;}
  var rate=m/21.75/8;
  var n=parseFloat(document.getElementById('otNormal').value)||0;
  var r=parseFloat(document.getElementById('otRest').value)||0;
  var h=parseFloat(document.getElementById('otHoliday').value)||0;
  var pay=rate*1.5*n+rate*2*r+rate*3*h;
  document.getElementById('otResult').innerHTML=
    '折算时薪：<b>'+rate.toFixed(2)+' 元/小时</b><br>'+
    '平日 '+n+'h ×1.5 + 休息日 '+r+'h ×2 + 法定 '+h+'h ×3<br>'+
    '应得加班费：<span class="big">'+pay.toFixed(2)+' 元</span>';
}
function updProgress(){
  var items=document.querySelectorAll('#checklist input');
  var done=0;items.forEach(function(i){if(i.checked)done++;});
  document.getElementById('pgBar').style.width=(done/items.length*100)+'%';
  document.getElementById('pgText').textContent='已确认 '+done+' / '+items.length;
}

function calcRetire(){
  var y=parseInt(document.getElementById('birthYear').value,10);
  var m=parseInt(document.getElementById('birthMonth').value,10);
  var type=document.getElementById('genderType').value;
  if(!(y>1940)||!(m>=1&&m<=12)){document.getElementById('retireResult').textContent='请填合法的出生年份和月份（1-12）。';return;}
  var baseY,baseM,origAge,step,cap;
  if(type==='m'){baseY=1965;baseM=1;origAge=720;step=4;cap=36;}
  else if(type==='f55'){baseY=1970;baseM=1;origAge=660;step=4;cap=36;}
  else{baseY=1975;baseM=1;origAge=600;step=2;cap=60;}
  var idx=(y-baseY)*12+(m-baseM);
  var delay=idx<0?0:Math.min(Math.floor(idx/step)+1,cap);
  var ra=origAge+delay;
  var ry=y+Math.floor((m-1+ra)/12);
  var rm=((m-1+ra)%12)+1;
  var ay=Math.floor(ra/12), am=ra%12;
  document.getElementById('retireResult').innerHTML=
    '你的法定退休年龄：<b>'+ay+' 岁'+(am?am+' 个月':'')+'</b><br>'+
    '预计退休时间：<span class="big">'+ry+' 年 '+(rm<10?'0'+rm:rm)+' 月</span><br>'+
    '<span class="hint">基于 2024 年渐进式延迟退休办法（2025-01-01 施行）通用算法估算，精确到月以官方对照表 / 12333 为准；还可自愿弹性提前或延迟不超过 3 年。</span>';
}

function jifa(age){
  if(age<=50)return 195;
  if(age<=55)return 170;
  if(age<=60)return 139;
  if(age<=65)return 101;
  return 90;
}
function calcPension(){
  var avg=parseFloat(document.getElementById('pAvg').value);
  var yrs=parseFloat(document.getElementById('pYears').value);
  var idx=parseFloat(document.getElementById('pIndex').value);
  var acct=parseFloat(document.getElementById('pAcct').value);
  var age=parseFloat(document.getElementById('pAge').value);
  if(!(avg>0)||!(yrs>0)||!(idx>0)||!(acct>=0)||!(age>0)){document.getElementById('penResult').textContent='请填完所有项。';return;}
  var base=avg*(1+idx)/2*yrs*0.01;
  var jf=jifa(age);
  var per=acct/jf;
  var total=base+per;
  document.getElementById('penResult').innerHTML=
    '基础养老金：<b>'+base.toFixed(2)+' 元/月</b><br>'+
    '个人账户养老金（计发月数 '+jf+'）：<b>'+per.toFixed(2)+' 元/月</b><br>'+
    '预估月养老金：<span class="big">'+total.toFixed(2)+' 元</span><br>'+
    '<span class="hint">公式：基础=社平×(1+指数)/2×缴费年限×1%；个人=账户储存额÷计发月数。指数约 0.6~3，社平/指数/计发月数均按简化假设，实际以当地社保局核算为准。</span>';
}

function calcDeposit(){
  var dep=parseFloat(document.getElementById('depAmount').value);
  if(!(dep>0)){document.getElementById('depResult').textContent='请先填押金金额。';return;}
  var rent=parseFloat(document.getElementById('depRent').value)||0;
  var util=parseFloat(document.getElementById('depUtil').value)||0;
  var dmg=parseFloat(document.getElementById('depDmg').value)||0;
  var pen=parseFloat(document.getElementById('depPen').value)||0;
  var ded=rent+util+dmg+pen;
  var back=dep-ded;
  var tips=[];
  if(dmg>0)tips.push('扣"损坏赔偿"要让房东拿维修票据或正规报价单；正常使用的损耗你不用赔（民法典第710条）。');
  if(pen>0)tips.push('违约金过分高于实际损失的，可以请求适当减少（民法典第585条）。');
  if(back<0)tips.push('出现"倒欠"，先逐项核对金额和依据，别急着补钱。');
  if(ded===0)tips.push('没有应扣项，押金应当全额返还。');
  var line=back>=0
    ? '预计应退：<span class="big">'+back.toFixed(2)+' 元</span>'
    : '预计需补缴：<span class="big">'+Math.abs(back).toFixed(2)+' 元</span>';
  document.getElementById('depResult').innerHTML=
    '押金 '+dep.toFixed(2)+' 元 − 扣除合计 '+ded.toFixed(2)+' 元<br>'+
    '（欠租 '+rent.toFixed(2)+' + 水电杂费 '+util.toFixed(2)+' + 损坏赔偿 '+dmg.toFixed(2)+' + 违约金 '+pen.toFixed(2)+'）<br>'+
    line+
    (tips.length?'<br><span class="hint">'+tips.join(' ')+'</span>':'');
}

function calcPayslip(){
  var base=parseFloat(document.getElementById('psBase').value);
  var yang=parseFloat(document.getElementById('psYang').value)||0;
  var yi=parseFloat(document.getElementById('psYi').value)||0;
  var shi=parseFloat(document.getElementById('psShi').value)||0;
  var gjj=parseFloat(document.getElementById('psGjj').value)||0;
  var minB=document.getElementById('psMin').value?parseFloat(document.getElementById('psMin').value):null;
  var maxB=document.getElementById('psMax').value?parseFloat(document.getElementById('psMax').value):null;
  if(!(base>0)){document.getElementById('psResult').innerHTML='请先填社保缴费基数。可以在工资条找"缴费基数"一栏，没有就填你的月应发工资估算。';return;}
  if(yang<=0&&yi<=0&&shi<=0&&gjj<=0){document.getElementById('psResult').innerHTML='请至少填一项代扣金额（养老 / 医疗 / 失业 / 公积金），把工资条对应栏的数字抄进来即可。';return;}

  function chk(name,ded,lo,hi,note){
    if(ded<=0)return{name:name,ded:0,ratio:0,flag:'bad',note:'未扣缴（或漏填）'};
    var r=ded/base*100, ok=r>=lo-0.3&&r<=hi+0.3;
    if(!ok)issues.push(name);
    return{name:name,ded:ded,ratio:r,flag:ok?'ok':'bad',note:ok?'正常 · '+note:'异常 · 应为 '+note};
  }
  var issues=[];
  var yangR=chk('养老保险',yang,8,8,'8%');
  var yiR=chk('医疗保险',yi,2,2,'2%');
  var shiR=chk('失业保险',shi,0.5,0.5,'0.5%');
  var gjjFlag,gjjNote,gjjRatio=0;
  if(gjj<=0){gjjFlag='bad';gjjNote='未缴（或漏填）';issues.push('住房公积金');}
  else{gjjRatio=gjj/base*100;var ok=gjjRatio>=5-0.3&&gjjRatio<=12+0.3;gjjFlag=ok?'ok':'bad';gjjNote=ok?'正常 · 5%–12%':'异常 · 应为 5%–12%';if(!ok)issues.push('住房公积金');}
  var gjjR={name:'住房公积金',ded:gjj,ratio:gjjRatio,flag:gjjFlag,note:gjjNote};

  var ssSum=yang+yi+shi, ssRatio=ssSum/base*100, ssOk=ssRatio>=10.5-0.6&&ssRatio<=10.5+0.6;
  var baseFlags=[];
  if(minB!==null&&base<minB){baseFlags.push('缴费基数低于当地下限（'+minB.toLocaleString()+' 元），单位可能按最低基数而非你的实际工资缴，属于少缴。');issues.push('缴费基数');}
  if(maxB!==null&&base>maxB){baseFlags.push('基数高于上限（'+maxB.toLocaleString()+' 元），已封顶，属正常。');}

  function row(r){
    var cls=r.flag==='ok'?'flag-ok':'flag-bad';
    var ratio=r.ded>0?r.ratio.toFixed(1)+'%':'—';
    return '<tr><td>'+r.name+'</td><td>'+r.ded.toLocaleString()+' 元</td><td>'+ratio+'</td><td class="'+cls+'">'+r.note+'</td></tr>';
  }
  var html=row(yangR)+row(yiR)+row(shiR)+row(gjjR);
  html+='<tr><td>社保个人合计</td><td>'+ssSum.toLocaleString()+' 元</td><td>'+ssRatio.toFixed(1)+'%</td><td class="'+(ssOk?'flag-ok':'flag-bad')+'">'+(ssOk?'≈ 基数×10.5%':'与 10.5% 偏差较大')+'</td></tr>';

  var reallyBad=issues.length>0;
  var verdictCls=reallyBad?'warn':'ok';
  var verdictTxt=reallyBad?('发现 '+issues.length+' 处需留意'):'各项比例基本正常';

  var out='<div class="verdict '+verdictCls+'">结论：'+verdictTxt+'</div>';
  out+='<table class="payslip"><tr><th>项目</th><th>个人代扣</th><th>推算比例</th><th>判定</th></tr>'+html+'</table>';

  var tips=[];
  if(issues.indexOf('养老保险')>-1)tips.push('养老保险个人应缴基数的 8%，比例明显不对请向单位核对。');
  if(issues.indexOf('医疗保险')>-1)tips.push('医疗保险个人应缴 2%。');
  if(issues.indexOf('失业保险')>-1)tips.push('失业保险个人应缴 0.5%。');
  if(issues.indexOf('住房公积金')>-1)tips.push('住房公积金单位和个人各 5%–12% 且比例相同；显示 0 可能是单位没缴，可查公积金 APP 核实。');
  if(minB!==null&&base<minB)tips.push('缴费基数低于当地下限，单位可能少缴；依据《社会保险法》第60条单位应按时足额缴纳，可向 12333 投诉。');
  baseFlags.forEach(function(f){if(f.indexOf('高于')>-1)tips.push(f);});
  if(tips.length)out+='<p class="hint">'+tips.join(' ')+'</p>';

  document.getElementById('psResult').innerHTML=out;
}
