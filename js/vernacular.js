/**
 * 白话解读层（固定模板 · 非 AI）
 * 吸收《五行大义》判读框架 +《铁板神数实操框架》用语，
 * 并把《千里命稿》天干旺相思路浓缩为季节对照（不照搬全书）。
 */
const VERNACULAR = (() => {

  const DAYMASTER_PLAIN = {
    '甲': { vibe: '像大树一样往上长', life: '做事时更愿意自己扛大梁，外放、有冲劲；压力大时也可能显得固执。', tip: '适合需要开拓、带头的场景；也要记得留余地给协作。', season: '木气春令最旺，冬尚有相气；夏偏休，秋最受压。' },
    '乙': { vibe: '像藤蔓一样柔韧', life: '适应力强，善于借力、绕路；有时会显得犹豫或依赖环境。', tip: '适合需要协调、细作的场景；关键节点仍要自己拍板。', season: '同属木：春旺冬相，夏休秋死——柔木更怕硬砍，也更会绕路。' },
    '丙': { vibe: '像太阳一样外放', life: '热情、爱表达，容易带动气氛；也可能消耗快、情绪起伏更明显。', tip: '适合需要曝光、传播的场景；注意节奏，别把自己烧干。', season: '火气夏旺春相；秋囚冬死——外放的人，冬天更要养神。' },
    '丁': { vibe: '像灯火一样内亮', life: '细腻、有洞察力，擅长在细节里发光；有时会想太多、内耗。', tip: '适合需要精研、打磨的场景；把想法落成一件具体小事更安心。', season: '阴火同样夏旺；气细，怕狂风也怕湿冷，宜稳燃不宜爆。' },
    '戊': { vibe: '像山丘一样稳', life: '厚实、可靠，愿意承担责任；变化太快时可能反应偏慢。', tip: '适合需要沉淀、守成的场景；主动一点小调整，会更灵活。', season: '土旺于四季末（四立前一段）；夏有相气，春最弱。' },
    '己': { vibe: '像田土一样养人', life: '包容、会照顾关系，擅长把资源变成成果；也可能过度操心。', tip: '适合需要育人、运营的场景；先照顾好自己的边界。', season: '阴土同气：养人靠「含容」，过厚易埋没，过薄易散。' },
    '庚': { vibe: '像刀剑一样干脆', life: '原则清晰、执行力强；有时锋利过头、不够圆融。', tip: '适合需要决断、攻坚的场景；关键对话里留一句软话。', season: '金气秋旺；夏最受压（死令），需火炼也怕火过。' },
    '辛': { vibe: '像珠玉一样精致', life: '审美与标准感强，追求质感；也可能挑剔、敏感。', tip: '适合需要品质、品牌感的场景；完美主义要设截止线。', season: '阴金秋旺；质地细，忌埋、忌沉、忌熔——标准感应有边界。' },
    '壬': { vibe: '像江河一样流动', life: '思路开阔、社交与变通强；有时方向多变、难收束。', tip: '适合需要连接、拓展的场景；重要目标写成清单更稳。', season: '水气冬旺秋相；夏囚，四季土旺时最受堤防。' },
    '癸': { vibe: '像雨露一样渗透', life: '直觉细、共情强，擅长默默滋养；也可能情绪藏得深。', tip: '适合需要洞察、陪伴的场景；把感受说出来，别只自己消化。', season: '阴水冬旺；润物无声，也怕淤、怕沸、怕干涸。' }
  };

  // 《五行大义》体性 + 生活义（框架：名—性—数）
  const WX_LIFE = {
    '木': {
      body: '曲直——能伸能弯',
      strong: '行动欲、成长欲偏强，爱规划、爱推进；也可能急于求成。',
      weak: '启动偏慢，需要更多外部推动或清晰目标才会动起来。',
      wang: '春令木王：适合立项、发芽、谈新生；忌一味砍伐式批评。'
    },
    '火': {
      body: '炎上——照亮、发热、显明',
      strong: '表达欲、表现欲偏强，情绪与热情外露；也可能容易躁、容易空转。',
      weak: '外表可能偏淡，热情需要被点燃；适合小步热身再全力。',
      wang: '夏令火王：适合展示、宣传、曝光；忌无准备的纵火式推进。'
    },
    '土': {
      body: '稼穑——承载、含容、养出成果',
      strong: '务实、重承诺、重安全感；也可能偏保守、难放手。',
      weak: '根基感不足时更易焦虑，适合先把一件小事做稳。',
      wang: '四季末土旺：适合收尾、基建、安置；大动土宜择其时。'
    },
    '金': {
      body: '从革——切割、收束、立规矩',
      strong: '标准高、边界清、决断快；也可能显得硬、不留情面。',
      weak: '决断与收尾偏弱时，适合用清单和截止日补足。',
      wang: '秋令金王：适合立规、审核、收束；忌该收不收、继续乱铺摊子。'
    },
    '水': {
      body: '润下——流动、渗透、汇聚',
      strong: '思虑深、信息量大、适应快；也可能想太多、难落地。',
      weak: '信息与变通偏少时，多交流、多走动会补气。',
      wang: '冬令水王：适合沉淀、蓄势、疏通信息；忌硬开河、硬决堤。'
    }
  };

  // 休王五档白话（《五行大义》框架）
  const XIUWANG_PLAIN = {
    '王': '此刻力量最盛——主力在场，宜做主旋律的事。',
    '相': '得令之助——顺风帮手，可推进但非本体最旺。',
    '休': '退居休息——不是坏，是不宜硬抢戏份。',
    '囚': '被当令者压制——行动成本高，宜借力或换时点。',
    '死': '最受压制——不等于坏事，常表示此刻不宜主动强推。'
  };

  // 粗略：以月支估当令（教学简化，非天文）
  const BRANCH_SEASON_WX = {
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '申': '金', '酉': '金',
    '亥': '水', '子': '水',
    '辰': '土', '未': '土', '戌': '土', '丑': '土'
  };

  function xiuWangOf(targetWx, seasonWx) {
    // 王：当令；相：王之所生；休：生王者；囚：王之所克；死：克王者
    const SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
    const KE = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
    if (targetWx === seasonWx) return '王';
    if (SHENG[seasonWx] === targetWx) return '相';
    // 生王者 = 休：谁生 seasonWx
    const parent = Object.keys(SHENG).find(k => SHENG[k] === seasonWx);
    if (targetWx === parent) return '休';
    if (KE[seasonWx] === targetWx) return '囚';
    if (KE[targetWx] === seasonWx) return '死';
    return '休';
  }

  const SHISHEN_PLAIN = {
    '比肩': { role: '同行／搭档', plain: '同类人、竞争与合作并存——身边常有「跟你差不多的人」。' },
    '劫财': { role: '抢夺／冲劲', plain: '果决、敢争，也容易在金钱或机会上「被人分一杯」或自己冲动出手。' },
    '食神': { role: '表达／口福', plain: '才艺、表达、享受感——把内在变成作品或说出来会舒服。' },
    '伤官': { role: '才华／叛逆', plain: '聪明、爱创新，也容易顶权威；适合把锋芒用在创作或解题上。' },
    '偏财': { role: '外财／人脉', plain: '偏门机会、社交型收入、广泛人脉——钱与人常一起动。' },
    '正财': { role: '正当收入', plain: '工资、稳定进账、踏实经营——靠规则与勤奋换钱。' },
    '七杀': { role: '压力／魄力', plain: '外界压力大，也逼出决断力；管好节奏，压力可变动力。' },
    '正官': { role: '规矩／名誉', plain: '责任、职称、社会评价——按规则做事会吃香，也容易被规则绑住。' },
    '偏印': { role: '偏门学问', plain: '独特思路、技艺、非主流学习；灵感多，有时显得孤僻。' },
    '正印': { role: '贵人／学识', plain: '长辈、老师、证书、庇护——有人罩、有学问托底的感觉。' },
    '日主': { role: '你自己', plain: '命盘的中心参照——上面各关系都是相对「你」而言。' }
  };

  const GUA_PLAIN = {
    '乾': '刚健、带头、向外开拓的意象——像天一样高远。',
    '兑': '交流、喜悦、开口说话——像泽水映人。',
    '离': '光明、看见、文明与表达——像火照四方。',
    '震': '发动、警醒、一惊之后要振作——像雷。',
    '巽': '柔顺推进、风行草偃——靠渗透与重复起作用。',
    '坎': '险中求通、心要有主心骨——像水流过坎。',
    '艮': '止、守位、想清楚再动——像山。',
    '坤': '承载、厚德、把事养大——像地。'
  };

  const CATEGORY_PLAIN = {
    '乾卦系辞': '偏讲格局与志向：刚健、有为，像「要撑起一片天」。',
    '坤卦系辞': '偏讲厚德与承受：稳健、能载物，像「把底盘养厚」。',
    '坤卦': '偏讲厚积与顺从时机：少硬闯，多积德积能。',
    '先天八卦': '偏讲「数」与推演思路：顺看过去、逆推将来——方法提示多于具体人事。',
    '六亲': '偏讲家人关系：父母、兄弟等缘分深浅，要用生活经验对照，不是判决书。',
    '富贵格局': '偏讲资源与舞台是否容易聚拢——仍须现实努力，条文只给意象。',
    '离卦': '偏讲文明、学识、被人看见——适合读书、表达、传播类方向对照。',
    '震卦': '偏讲受惊后的成长：先紧张，后笑开——挫折可转化为修省。',
    '巽卦': '偏讲柔顺推行：靠沟通与反复叮嘱把事办成。',
    '坎卦': '偏讲过险：心里有信，行动才有方向。',
    '艮卦': '偏讲守位：想清楚边界，不越位也少内耗。',
    '婚姻': '偏讲伴侣与家庭气氛——作参考意象，不作婚恋承诺。',
    '子息': '偏讲子女缘与教养氛围——同样只是意象。',
    '疾厄': '偏提醒身心节奏与五行偏枯——有不适请就医，勿用条文替代医疗。',
    '迁移': '偏讲走动、换环境、出差迁徙的动静。',
    '官禄': '偏讲事业、职场规则与名声——对照现实履历即可。',
    '财帛': '偏讲进账方式与守财气力——意象，不是理财建议。',
    '格局': '偏讲盘面结构类型——帮助分类，不代替细盘。',
    '运势': '偏讲大运／流年节奏——季节感，不是日程表。',
    '总论': '偏讲总象与卦德——先立气象，再落到人事。',
    '方法': '这是本站方法笔记，不是原典某卷诗句——教你怎么读、怎么验证。',
    '验证': '强调先用已知事实校准路径，再推未知。',
    '刻分': '强调时辰内的细刻——本站算法尚未接入刻分微调。',
    '纳音': '另一套「听起来属哪一行」的标签，用于部分流派微调。',
    '待查': '本站条文库尚未收录此卷条，下面只解释推算在做什么。'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function termChip(term, role) {
    const t = esc(term);
    const r = role ? `<span class="vc-role">${esc(role)}</span>` : '';
    return `<span class="vc-term">${t}</span>${r}`;
  }

  function renderBazi(r) {
    const { pillars, daymaster, wxCount, dayuns, input } = r;
    const dm = DAYMASTER_PLAIN[daymaster.stem] || {
      vibe: `属${daymaster.wx}`,
      life: (typeof BAZI !== 'undefined' && BAZI.WX_DESC) ? (BAZI.WX_DESC[daymaster.wx] || '') : '',
      tip: '下面用生活话把盘面结构说一遍，不作吉凶定论。',
      season: ''
    };

    const entries = Object.entries(wxCount).sort((a, b) => b[1] - a[1]);
    const strong = entries[0][0], strongVal = entries[0][1];
    const weak = entries[entries.length - 1][0], weakVal = entries[entries.length - 1][1];
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const strongPct = total ? Math.round(strongVal / total * 100) : 0;
    const weakPct = total ? Math.round(weakVal / total * 100) : 0;

    const monthBranch = pillars[1].branch;
    const seasonWx = BRANCH_SEASON_WX[monthBranch] || '土';
    const dmXw = xiuWangOf(daymaster.wx, seasonWx);
    const strongXw = xiuWangOf(strong, seasonWx);

    const monthSS = pillars[1].shishenStem;
    const yearSS = pillars[0].shishenStem;
    const hourSS = pillars[3].shishenStem;
    const monthP = SHISHEN_PLAIN[monthSS] || { role: '月令关系', plain: '' };
    const yearP = SHISHEN_PLAIN[yearSS] || { role: '年柱关系', plain: '' };
    const hourP = SHISHEN_PLAIN[hourSS] || { role: '时柱关系', plain: '' };

    const ssSet = [];
    pillars.forEach((p, i) => {
      if (i === 2) return;
      [p.shishenStem, p.shishenBranch].forEach(ss => {
        if (ss && ss !== '—' && ss !== '日主' && !ssSet.includes(ss)) ssSet.push(ss);
      });
    });

    const fwd = (input.male && pillars[0].stemIdx % 2 === 0) ||
                (!input.male && pillars[0].stemIdx % 2 !== 0);
    const firstYun = dayuns && dayuns[0];
    const firstSS = firstYun ? (SHISHEN_PLAIN[firstYun.shishen] || null) : null;
    const genderTxt = input.male ? '男命' : '女命';

    const ssCards = ssSet.map(ss => {
      const p = SHISHEN_PLAIN[ss];
      if (!p) return '';
      return `<div class="vc-card">
        <div class="vc-card__head">${termChip(ss, p.role)}</div>
        <p class="vc-card__body">${esc(p.plain)}</p>
      </div>`;
    }).join('');

    const wxBodyStrong = (WX_LIFE[strong] || {}).body || '';
    const wxBodyDm = (WX_LIFE[daymaster.wx] || {}).body || '';

    return `
      <div class="vc-banner">
        <div class="vc-kicker">白话解读 · 固定模板 · 非 AI</div>
        <h3 class="vc-title">先看懂人话，再翻下面的专业盘面</h3>
        <p class="vc-lead">日主是「${esc(daymaster.stem)}」——${esc(dm.vibe)}。解读融入《五行大义》「名—性—数／当令」思路与子平十神日常说法；<strong>不是算命承诺</strong>，只是把术语翻译成人话。</p>
      </div>

      <section class="vc-section">
        <h4 class="vc-h">① 日主气质 <span class="vc-sub">术语：日主＝命盘里的「你」</span></h4>
        <p>你的日主是 ${termChip(daymaster.stem + daymaster.wx, daymaster.yy)}（体性：${esc(wxBodyDm)}）。${esc(dm.life)}</p>
        <p class="vc-soft">${esc(dm.tip)}${dm.season ? ' ' + esc(dm.season) : ''}</p>
      </section>

      <section class="vc-section">
        <h4 class="vc-h">② 当令与休王 <span class="vc-sub">《五行大义》思路：先问谁当令</span></h4>
        <p>月支「${esc(monthBranch)}」粗归<strong>${esc(seasonWx)}</strong>令（教学简化，非天文）。日主「${esc(daymaster.wx)}」在此令约处<strong>${esc(dmXw)}</strong>档：${esc(XIUWANG_PLAIN[dmXw] || '')}</p>
        <p>盘面计数偏旺的「${esc(strong)}」此处约处<strong>${esc(strongXw)}</strong>档。${esc((WX_LIFE[seasonWx] || {}).wang || '')}</p>
        <p class="vc-soft">休王只说强弱时机，不直接等于吉凶。「死」常表示不宜硬推，不是贬义判决。完整六步见「学习笔记」。</p>
      </section>

      <section class="vc-section">
        <h4 class="vc-h">③ 五行偏旺／偏弱 <span class="vc-sub">结构观察 + 体性</span></h4>
        <p>按本站简化计数，相对<strong>偏旺</strong>的是「${esc(strong)}」（${esc(wxBodyStrong)}；约 ${strongVal}，占 ${strongPct}%）：${esc((WX_LIFE[strong] || {}).strong || '')}</p>
        <p>相对<strong>偏弱</strong>的是「${esc(weak)}」（约 ${weakVal}，占 ${weakPct}%）：${esc((WX_LIFE[weak] || {}).weak || '')}</p>
        <p class="vc-soft">传统「用神」需结合月令、格局细论，本站未做裁决。归类冲突时，用途优先——这是《五行大义》框架的取舍规则。</p>
      </section>

      <section class="vc-section">
        <h4 class="vc-h">④ 十神关系 <span class="vc-sub">贵人／压力／表达／钱财……</span></h4>
        <p>月柱天干见 ${termChip(monthSS, monthP.role)}——月令常被看作「当令的气候」。${esc(monthP.plain)}</p>
        <p>年柱天干 ${termChip(yearSS, yearP.role)}：${esc(yearP.plain)}</p>
        <p>时柱天干 ${termChip(hourSS, hourP.role)}：${esc(hourP.plain)}</p>
        <div class="vc-grid">${ssCards}</div>
        <p class="vc-soft">十神全是「相对日主」的标签。下面表格仍保留原术语，方便对照《千里命稿》《渊海子平》等。</p>
      </section>

      <section class="vc-section">
        <h4 class="vc-h">⑤ 大运大意 <span class="vc-sub">十年一段的「人生季候」</span></h4>
        <p>${esc(genderTxt)} · 年干「${esc(pillars[0].stem)}」为${pillars[0].stemIdx % 2 === 0 ? '阳' : '阴'}，按简化规则大运${fwd ? '顺行' : '逆行'}。</p>
        ${firstYun ? `<p>约从 <strong>${firstYun.startAge} 岁</strong>起第一运「${esc(firstYun.stem)}${esc(firstYun.branch)}」${firstYun.shishen ? `（${termChip(firstYun.shishen, firstSS ? firstSS.role : '')}）` : ''}。${firstSS ? esc(firstSS.plain) : ''} 后续每运十年换一段——影响重心，不决定命运剧本。</p>` : ''}
        <p class="vc-soft">起运岁数此处固定约 3 岁起、每运 10 年；精确起运需节气距离与真太阳时，本站尚未实现。</p>
      </section>

      <section class="vc-section vc-disclaimer">
        <h4 class="vc-h">⑥ 读法说明</h4>
        <ul>
          <li>本解读为<strong>站点内固定句式填空</strong>，不调用外部模型，不编造具体事件。</li>
          <li>当令／休王为教学简化；真太阳时、精确起运、用神裁决未纳入。</li>
          <li>方法来源简述见 <a href="notes.html" style="color:var(--gold)">学习笔记</a>；用途：自学对照——<strong>非算命、非医疗／法律建议</strong>。</li>
        </ul>
      </section>
    `;
  }

  function renderTiepan(r, minggua) {
    const hasArticle = r.tiaowen && r.tiaowen.category !== '待查' &&
      r.tiaowen.content && !String(r.tiaowen.content).includes('需查阅原典');
    const guaPlain = GUA_PLAIN[r.guaName] || '一种八卦意象，用来对照性情与处境。';
    const bianPlain = GUA_PLAIN[r.bianGuaName] || '';
    const catPlain = CATEGORY_PLAIN[r.tiaowen.category] || CATEGORY_PLAIN['待查'];
    const notePlain = r.tiaowen.note ? `原注／整理说明：${r.tiaowen.note}` : '';
    const extraPlain = r.tiaowen.plain ? r.tiaowen.plain : '';

    let articleBlock;
    if (hasArticle) {
      articleBlock = `
        <section class="vc-section">
          <h4 class="vc-h">③ 条文在说什么 <span class="vc-sub">${esc(r.tiaowen.text || (r.tiaowen.title || ''))} · ${esc(r.tiaowen.category)}</span></h4>
          <p>${esc(catPlain)}</p>
          <blockquote class="vc-quote">${esc(r.tiaowen.content)}</blockquote>
          ${extraPlain ? `<p><strong>白话</strong>：${esc(extraPlain)}</p>` : ''}
          <p>${esc(notePlain)}</p>
          <p class="vc-soft">古文意象 ≠ 人生判决。框架强调：<strong>先验证再推未知</strong>。本站不作吉凶承诺。</p>
        </section>`;
    } else {
      articleBlock = `
        <section class="vc-section">
          <h4 class="vc-h">③ 条文库未命中</h4>
          <p>按加总法得到 <strong>第 ${r.juanNum} 卷 · 第 ${r.tiaoNum} 条</strong>，但本站精选库里还没有这一条的正文。</p>
          <p><strong>白话意思</strong>：推算已经完成——它告诉你「该去原典哪一卷哪一条」；并不是算失败了，只是网站没收录全文。我们<strong>不会编造假条文</strong>。</p>
          <p class="vc-soft">建议：打开邵雍著、陈明点校《铁板神数》查阅；或先在「条文检索」看方法笔记与相近条目。</p>
        </section>`;
    }

    const mgBlock = minggua ? `
      <section class="vc-section">
        <h4 class="vc-h">④ 命卦（另一套简化标签）</h4>
        <p>命卦「${esc(minggua.guaName)}」属${esc(minggua.wx)}，传统称「${esc(minggua.type)}」，常议方位意象偏「${esc(minggua.direction)}」。</p>
        <p>${esc(GUA_PLAIN[minggua.guaName] || '')} 与上面的本卦／变卦是<strong>不同算法</strong>，仅供对照。</p>
      </section>` : '';

    return `
      <div class="vc-banner">
        <div class="vc-kicker">白话解读 · 固定模板 · 非 AI</div>
        <h3 class="vc-title">先听人话：参数 → 数字 → 条文 → 验证</h3>
        <p class="vc-lead">据《铁板神数实操框架》：铁板不是「查到诗句就结束」，而是用已知事实校准起数路径。下面先说明<strong>这次推算在干什么</strong>，再给条文／卦象的生活意象。</p>
      </div>

      <section class="vc-section">
        <h4 class="vc-h">① 四段论（你现在走到哪）</h4>
        <ol class="vc-ol">
          <li><strong>参数</strong>：年干「${esc(r.yearStem)}」、年支「${esc(r.yearBranch)}」、农历 ${r.month} 月 ${r.day} 日、时支「${esc(r.hourBranch)}」、${r.male ? '男命' : '女命'}。——本站<strong>未采集刻分</strong>（一时辰八刻），精确流派推算还要细到刻。</li>
          <li><strong>数字</strong>：教学加总得到先天总数 <strong>${r.totalNum}</strong> → 映射为第 ${r.juanNum} 卷 · 第 ${r.tiaoNum} 条。</li>
          <li><strong>条文</strong>：${hasArticle ? '库内命中，见下方白话。' : '库内未收正文，只给出卷／条索引。'}</li>
          <li><strong>验证</strong>：请用至少两三项已知六亲／往事核对；不符则应调刻分或换公式，而不是硬解诗句。——本站无法代你完成这一步。</li>
        </ol>
      </section>

      <section class="vc-section">
        <h4 class="vc-h">② 卦象意象</h4>
        <p>本卦「${esc(r.guaName)}」：${esc(guaPlain)}${bianPlain ? ` 变卦「${esc(r.bianGuaName)}」：${esc(bianPlain)}` : ''}</p>
        <p class="vc-soft">加总法是教学简化版；太华派／邵氏等细算与真太阳时未纳入。步骤区保留每个数字的来源，方便核对。</p>
      </section>

      ${articleBlock}
      ${mgBlock}

      <section class="vc-section vc-disclaimer">
        <h4 class="vc-h">${minggua ? '⑤' : '④'} 读法说明</h4>
        <ul>
          <li>白话层为固定模板；未命中条文时只提示查阅原典，不生成假诗。</li>
          <li>库规模以 <code>data/tiepan.json</code> 实有条数为准（含方法笔记）。</li>
          <li>方法摘要见 <a href="notes.html" style="color:var(--gold)">学习笔记</a>；<strong>非算命、非医疗建议</strong>。</li>
        </ul>
      </section>
    `;
  }

  return { renderBazi, renderTiepan, SHISHEN_PLAIN, DAYMASTER_PLAIN, GUA_PLAIN, WX_LIFE, XIUWANG_PLAIN };
})();
