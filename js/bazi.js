/**
 * 八字排盘算法
 * BaZi (Four Pillars of Destiny) Calculator
 * 命理学数字实验室 — Academic Research Tool
 */

const BAZI = (() => {

  // ── 基础数据 ───────────────────────────────────────────────

  const TIANGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const DIZHI   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // 五行属性
  const WUXING_TG = ['木','木','火','火','土','土','金','金','水','水']; // 天干五行
  const WUXING_DZ = ['水','土','木','木','土','火','火','土','金','金','土','水']; // 地支五行

  // 阴阳属性（天干：偶数阳，奇数阴）
  const YINYANG_TG = ['阳','阴','阳','阴','阳','阴','阳','阴','阳','阴'];
  const YINYANG_DZ = ['阳','阴','阳','阴','阳','阴','阳','阴','阳','阴','阳','阴'];

  // 地支藏干（主气、中气、余气）
  const CANGGAN = {
    '子': [['壬',7],['癸',3]],
    '丑': [['己',6],['癸',3],['辛',1]],
    '寅': [['甲',7],['丙',2],['戊',1]],
    '卯': [['甲',5],['乙',5]],
    '辰': [['戊',6],['乙',3],['癸',1]],
    '巳': [['丙',6],['庚',3],['戊',1]],
    '午': [['丁',6],['己',4]],
    '未': [['己',6],['丁',2],['乙',2]],
    '申': [['庚',7],['壬',2],['戊',1]],
    '酉': [['庚',5],['辛',5]],
    '戌': [['戊',6],['辛',2],['丁',2]],
    '亥': [['壬',7],['甲',3]]
  };

  // 纳音五行（六十甲子纳音）
  const NAYIN = [
    '海中金','海中金','炉中火','炉中火','大林木','大林木',
    '路旁土','路旁土','剑锋金','剑锋金','山头火','山头火',
    '涧下水','涧下水','城头土','城头土','白蜡金','白蜡金',
    '杨柳木','杨柳木','井泉水','井泉水','屋上土','屋上土',
    '霹雳火','霹雳火','松柏木','松柏木','长流水','长流水',
    '砂中金','砂中金','山下火','山下火','平地木','平地木',
    '壁上土','壁上土','金箔金','金箔金','覆灯火','覆灯火',
    '天河水','天河水','大驿土','大驿土','钗钏金','钗钏金',
    '桑柘木','桑柘木','大溪水','大溪水','沙中土','沙中土',
    '天上火','天上火','石榴木','石榴木','大海水','大海水'
  ];

  // 十二长生（十二运）
  const CHANGSHENG = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];

  // 长生起点：各天干在哪个地支起长生（阳干顺行，阴干逆行）
  const CHANGSHENG_START = {
    '甲': 11, // 亥起长生（顺行）
    '丙': 5,  // 寅起长生（顺行）
    '戊': 5,  // 寅起长生
    '庚': 3,  // 巳起长生（顺行）wait—庚长生在巳 index=5?
    '壬': 9,  // 申起长生 index=6?
    '乙': 6,  // 午起长生（逆行）
    '丁': 9,  // 酉起长生（逆行）
    '己': 9,  // 酉起长生
    '辛': 0,  // 子起长生（逆行）
    '癸': 3   // 卯起长生（逆行）
  };
  // 校正后的长生起点（地支index）
  const CS_START = {
    '甲':11,'乙':6,'丙':2,'丁':9,'戊':2,'己':9,'庚':5,'辛':0,'壬':8,'癸':3
  };

  // ── 五行生克 ───────────────────────────────────────────────

  const WX_ORDER = ['木','火','土','金','水'];
  // 生我 producer, 我生 produced, 克我 controller, 我克 controlled
  function wxRelation(a, b) {
    const ai = WX_ORDER.indexOf(a);
    const bi = WX_ORDER.indexOf(b);
    if (ai === bi) return 'same';
    if ((ai + 1) % 5 === bi) return 'produce'; // a生b
    if ((bi + 1) % 5 === ai) return 'produced'; // b生a
    if ((ai + 2) % 5 === bi) return 'control'; // a克b
    if ((bi + 2) % 5 === ai) return 'controlled'; // b克a
    return 'none';
  }

  // ── 十神 ───────────────────────────────────────────────────

  const SHISHEN_MAP = {
    'same-阳':    '比肩', 'same-阴':    '劫财',
    'produce-阳': '食神', 'produce-阴': '伤官',
    'control-阳': '偏财', 'control-阴': '正财',
    'controlled-阳': '七杀', 'controlled-阴': '正官',
    'produced-阳': '偏印', 'produced-阴': '正印'
  };

  function getShishen(rigan_idx, target_idx) {
    const ri_wx = WUXING_TG[rigan_idx];
    const ri_yy = YINYANG_TG[rigan_idx];
    const tg_wx = WUXING_TG[target_idx];
    const tg_yy = YINYANG_TG[target_idx];

    if (ri_wx === tg_wx) {
      return ri_yy === tg_yy ? '比肩' : '劫财';
    }
    const rel = wxRelation(ri_wx, tg_wx);
    const sameYY = (ri_yy === tg_yy) ? '阳' : '阴';
    const key = `${rel}-${sameYY}`;
    return SHISHEN_MAP[key] || '—';
  }

  // ── 日历算法 ───────────────────────────────────────────────

  /** 公历转儒略日 */
  function toJulianDay(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y +
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  /** 判断节气月份（命理月份，基于节气，非农历月）
   *  返回命理月份 1-12，1=寅月（立春起）
   *  使用近似节气日期 */
  function getMingli_Month(year, month, day) {
    // 节气近似日期（月份索引，节气日）—— 精确计算需天文算法
    // 此处使用平均值，误差在1-2天内
    const JIEQI = [
      [1, 6],   // 小寒  → 丑月延续
      [2, 4],   // 立春  → 寅月开始
      [3, 6],   // 惊蛰  → 卯月开始
      [4, 5],   // 清明  → 辰月开始
      [5, 6],   // 立夏  → 巳月开始
      [6, 6],   // 芒种  → 午月开始
      [7, 7],   // 小暑  → 未月开始
      [8, 7],   // 立秋  → 申月开始
      [9, 8],   // 白露  → 酉月开始
      [10, 8],  // 寒露  → 戌月开始
      [11, 7],  // 立冬  → 亥月开始
      [12, 7],  // 大雪  → 子月开始
    ];

    // 确定当前所在命理月
    let mingliMonth = 12; // 默认大雪后为子月

    // 按节气确定命理月（从小到大排查）
    const boundaries = [
      { m:  2, d: 4,  ml: 1 },  // 立春 → 寅月(1)
      { m:  3, d: 6,  ml: 2 },  // 惊蛰 → 卯月(2)
      { m:  4, d: 5,  ml: 3 },  // 清明 → 辰月(3)
      { m:  5, d: 6,  ml: 4 },  // 立夏 → 巳月(4)
      { m:  6, d: 6,  ml: 5 },  // 芒种 → 午月(5)
      { m:  7, d: 7,  ml: 6 },  // 小暑 → 未月(6)
      { m:  8, d: 7,  ml: 7 },  // 立秋 → 申月(7)
      { m:  9, d: 8,  ml: 8 },  // 白露 → 酉月(8)
      { m: 10, d: 8,  ml: 9 },  // 寒露 → 戌月(9)
      { m: 11, d: 7,  ml: 10 }, // 立冬 → 亥月(10)
      { m: 12, d: 7,  ml: 11 }, // 大雪 → 子月(11)
    ];

    const dateNum = month * 100 + day;

    if (dateNum < 107) {
      // 1月6日前：上年丑月(12)
      mingliMonth = 12;
    } else if (dateNum < 204) {
      // 小寒后立春前：丑月(12)
      mingliMonth = 12;
    } else {
      // 找到最后一个已过的节气
      mingliMonth = 12; // 默认
      for (const b of boundaries) {
        if (month > b.m || (month === b.m && day >= b.d)) {
          mingliMonth = b.ml;
        }
      }
    }

    return mingliMonth;
  }

  /** 获取月柱天干起始索引（五虎遁年起月） */
  function getMonthStemStart(yearStemIdx) {
    // 甲己→丙, 乙庚→戊, 丙辛→庚, 丁壬→壬, 戊癸→甲
    return [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearStemIdx];
  }

  /** 获取时柱天干起始索引（五鼠遁日起时） */
  function getHourStemStart(dayStemIdx) {
    // 甲己→甲, 乙庚→丙, 丙辛→戊, 丁壬→庚, 戊癸→壬
    return [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][dayStemIdx];
  }

  /** 时辰地支索引 */
  function getHourZhiIdx(hour) {
    if (hour === 23) return 0; // 子时
    return Math.floor((hour + 1) / 2) % 12;
  }

  // ── 主计算函数 ─────────────────────────────────────────────

  /**
   * 排盘主函数
   * @param {number} year   公历年
   * @param {number} month  公历月 (1-12)
   * @param {number} day    公历日
   * @param {number} hour   小时 (0-23)
   * @param {boolean} male  是否男性
   * @returns {object} 完整八字信息
   */
  function calculate(year, month, day, hour, male = true) {
    // 子时日柱进位：23时按第二天算
    let calcYear = year, calcMonth = month, calcDay = day;
    if (hour === 23) {
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() + 1);
      calcYear = d.getFullYear();
      calcMonth = d.getMonth() + 1;
      calcDay = d.getDate();
    }

    // ── 年柱 ──
    const yearStemIdx   = (calcYear - 4 + 4000) % 10;
    const yearBranchIdx = (calcYear - 4 + 4000) % 12;
    const yearStem   = TIANGAN[yearStemIdx];
    const yearBranch = DIZHI[yearBranchIdx];

    // ── 月柱 ──
    const mlMonth = getMingli_Month(calcYear, calcMonth, calcDay);
    const monthStemStart = getMonthStemStart(yearStemIdx);
    const monthStemIdx   = (monthStemStart + mlMonth - 1) % 10;
    const monthBranchIdx = (mlMonth + 1) % 12; // 寅=2 for month1
    const monthStem   = TIANGAN[monthStemIdx];
    const monthBranch = DIZHI[monthBranchIdx];

    // ── 日柱 ──
    const jd = toJulianDay(calcYear, calcMonth, calcDay);
    // Reference: JD 2451545 = 2000年1月1日 = 庚辰日 (cycle index 16)
    const dayIdx = ((jd - 2451545 + 16) % 60 + 60) % 60;
    const dayStemIdx   = dayIdx % 10;
    const dayBranchIdx = dayIdx % 12;
    const dayStem   = TIANGAN[dayStemIdx];
    const dayBranch = DIZHI[dayBranchIdx];

    // ── 时柱 ──
    const hourZhiIdx  = getHourZhiIdx(hour);
    const hourStemStart = getHourStemStart(dayStemIdx);
    const hourStemIdx   = (hourStemStart + hourZhiIdx) % 10;
    const hourStem   = TIANGAN[hourStemIdx];
    const hourBranch = DIZHI[hourZhiIdx];

    // ── 四柱汇总 ──
    const pillars = [
      { label: '年柱', stem: yearStem,  branch: yearBranch,  stemIdx: yearStemIdx,  branchIdx: yearBranchIdx  },
      { label: '月柱', stem: monthStem, branch: monthBranch, stemIdx: monthStemIdx, branchIdx: monthBranchIdx },
      { label: '日柱', stem: dayStem,   branch: dayBranch,   stemIdx: dayStemIdx,   branchIdx: dayBranchIdx   },
      { label: '时柱', stem: hourStem,  branch: hourBranch,  stemIdx: hourStemIdx,  branchIdx: hourZhiIdx     }
    ];

    // 为每柱添加五行、纳音、藏干、十神
    pillars.forEach((p, i) => {
      p.stemWX   = WUXING_TG[p.stemIdx];
      p.branchWX = WUXING_DZ[p.branchIdx];
      p.stemYY   = YINYANG_TG[p.stemIdx];
      p.canggan  = CANGGAN[p.branch] || [];
      // 纳音：每两个天干地支组合共用一个纳音
      const nayinIdx = Math.floor(dayIdx / 2) * 2; // 用日柱60甲子index
      const pillarCycleIdx = ((p.stemIdx % 10) + (p.branchIdx < 0 ? p.branchIdx + 12 : p.branchIdx));
      // 简化：按60甲子顺序取纳音
      const cycleIdx = (p.stemIdx * 6 + Math.floor(p.branchIdx / 2)) % 30 * 2;
      p.nayin = getNayin(p.stemIdx, p.branchIdx);
      // 十神（日主为参照，日柱本身不标）
      if (i !== 2) {
        p.shishenStem   = getShishen(dayStemIdx, p.stemIdx);
        p.shishenBranch = getShishenFromBranch(dayStemIdx, p.branchIdx);
      } else {
        p.shishenStem   = '日主';
        p.shishenBranch = getShishenFromBranch(dayStemIdx, p.branchIdx);
      }
    });

    // ── 五行统计 ──
    const wxCount = { 木:0, 火:0, 土:0, 金:0, 水:0 };
    pillars.forEach(p => {
      wxCount[p.stemWX]++;
      wxCount[p.branchWX]++;
      // 藏干也计入（按权重简化为各+0.5）
      (p.canggan || []).forEach(([g]) => {
        const wx = WUXING_TG[TIANGAN.indexOf(g)];
        if (wx) wxCount[wx] = (wxCount[wx] || 0) + 0.5;
      });
    });

    // ── 大运推算（简化） ──
    const dayuns = calcDayun(year, month, day, yearStemIdx, mlMonth, monthStemIdx, monthBranchIdx, male);

    return {
      input: { year, month, day, hour, male },
      pillars,
      daymaster: { stem: dayStem, stemIdx: dayStemIdx, wx: WUXING_TG[dayStemIdx], yy: YINYANG_TG[dayStemIdx] },
      wxCount,
      dayuns,
      cycleYear: (year - 4 + 4000) % 60,
      mlMonth
    };
  }

  /** 从地支获取十神（取地支主气） */
  function getShishenFromBranch(dayStemIdx, branchIdx) {
    const branch = DIZHI[branchIdx];
    const cg = CANGGAN[branch];
    if (!cg || cg.length === 0) return '—';
    const mainStem = cg[0][0];
    const mainStemIdx = TIANGAN.indexOf(mainStem);
    return getShishen(dayStemIdx, mainStemIdx);
  }

  /** 纳音计算 */
  function getNayin(stemIdx, branchIdx) {
    // 60甲子中的位置
    // 天干2个一循环，地支2个一循环（阴阳配对）
    // 纳音30组，每组对应2个干支对
    const pos = stemIdx % 2 === 0 ?
      Math.floor(stemIdx / 2) * 6 + Math.floor(branchIdx / 2) :
      Math.floor((stemIdx - 1) / 2) * 6 + Math.floor(branchIdx / 2);
    return NAYIN[Math.min(pos * 2, 58)];
  }

  /** 大运推算 */
  function calcDayun(year, month, day, yearStemIdx, mlMonth, monthStemIdx, monthBranchIdx, male) {
    const yangYear = yearStemIdx % 2 === 0; // 阳年
    const forward  = (male && yangYear) || (!male && !yangYear); // 顺逆

    const dayuns = [];
    let stemIdx   = monthStemIdx;
    let branchIdx = monthBranchIdx;

    for (let i = 0; i < 8; i++) {
      if (forward) {
        stemIdx   = (stemIdx + 1) % 10;
        branchIdx = (branchIdx + 1) % 12;
      } else {
        stemIdx   = (stemIdx + 9) % 10;
        branchIdx = (branchIdx + 11) % 12;
      }
      const startAge = 3 + i * 10; // 简化：实际需起运岁数计算
      dayuns.push({
        stem: TIANGAN[stemIdx],
        branch: DIZHI[branchIdx],
        stemWX: WUXING_TG[stemIdx],
        branchWX: WUXING_DZ[branchIdx],
        startAge,
        startYear: year + startAge,
        shishen: getShishen(monthStemIdx % 10, stemIdx)
      });
    }
    return dayuns;
  }

  // ── 辅助信息 ───────────────────────────────────────────────

  const WX_COLOR = { 木:'#4ade80', 火:'#f87171', 土:'#fbbf24', 金:'#e2e8f0', 水:'#60a5fa' };
  const WX_DESC  = {
    木: '生发、条达，主仁，方位东，季节春',
    火: '炎上、光明，主礼，方位南，季节夏',
    土: '承载、中和，主信，方位中，季节四季',
    金: '肃降、坚刚，主义，方位西，季节秋',
    水: '润下、流通，主智，方位北，季节冬'
  };

  const SHISHEN_DESC = {
    '比肩': '助身之神，主独立自强、竞争合作',
    '劫财': '夺财之神，主果决勇进、争竞耗财',
    '食神': '我生之神，主才艺口福、温和乐观',
    '伤官': '我生之神，主聪慧才气、叛逆创新',
    '偏财': '我克之神，主偏横之财、社交广泛',
    '正财': '我克之神，主正当收入、踏实稳健',
    '七杀': '克我之神，主威权压力、魄力决断',
    '正官': '克我之神，主规矩名誉、责任担当',
    '偏印': '生我之神，主智慧技艺、独特思维',
    '正印': '生我之神，主学识慈悲、贵人扶持'
  };

  // ── 公开 API ───────────────────────────────────────────────

  return {
    calculate,
    TIANGAN, DIZHI, WUXING_TG, WUXING_DZ,
    YINYANG_TG, CANGGAN, NAYIN,
    WX_COLOR, WX_DESC, SHISHEN_DESC,
    getShishen, getNayin,
    wxRelation
  };

})();
