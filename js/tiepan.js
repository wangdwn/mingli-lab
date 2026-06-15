/**
 * 铁板神数算法（学术研究版）
 * TieBan ShenShu Calculator
 * 命理学数字实验室
 *
 * 说明：铁板神数由宋代邵雍所著，以先天数推演命运条文。
 * 本实现基于学术研究，呈现推算过程与条文索引逻辑。
 */

const TIEPAN = (() => {

  // ── 先天八卦数 ─────────────────────────────────────────────
  // 乾一、兑二、离三、震四、巽五、坎六、艮七、坤八
  const XIANTIAN_GUA = {
    '乾': 1, '兑': 2, '离': 3, '震': 4,
    '巽': 5, '坎': 6, '艮': 7, '坤': 8
  };

  // 天干先天数（邵氏体系）
  const TG_XIANTIAN = {
    '甲':3,'乙':8,'丙':7,'丁':2,'戊':5,
    '己':0,'庚':9,'辛':4,'壬':1,'癸':6
  };

  // 地支先天数
  const DZ_XIANTIAN = {
    '子':1,'丑':8,'寅':3,'卯':4,'辰':3,'巳':2,
    '午':9,'未':4,'申':6,'酉':7,'戌':8,'亥':7
  };

  // 天干五行生数成数
  const TG_SHENGCHENG = {
    '甲':3,'乙':8,'丙':7,'丁':2,'戊':5,
    '己':5,'庚':9,'辛':4,'壬':1,'癸':6
  };

  // ── 农历数据辅助（简化版） ──────────────────────────────────
  // 用于将公历转换为农历月日（近似算法）

  /** 农历月数字 */
  const LUNAR_MONTHS = ['正','二','三','四','五','六','七','八','九','十','十一','十二'];
  const LUNAR_DAYS   = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
                        '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                        '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

  // ── 数理计算核心 ────────────────────────────────────────────

  /**
   * 计算先天数（简化学术版）
   * 铁板神数原版需精确农历，此处展示计算框架
   */
  function calcXiantianShu(yearStem, yearBranch, monthNum, dayNum, hourBranch) {
    const a = TG_XIANTIAN[yearStem] || 0;
    const b = DZ_XIANTIAN[yearBranch] || 0;
    const c = monthNum;
    const d = dayNum;
    const e = DZ_XIANTIAN[hourBranch] || 0;
    return a + b + c + d + e;
  }

  /**
   * 铁板神数主推算
   * @param {string} yearStem   年天干
   * @param {string} yearBranch 年地支
   * @param {number} month      农历月（1-12）
   * @param {number} day        农历日（1-30）
   * @param {string} hourBranch 时辰地支
   * @param {boolean} male      性别
   * @returns {object} 推算结果
   */
  function calculate(yearStem, yearBranch, month, day, hourBranch, male) {
    // 先天数
    const xiantianShu = calcXiantianShu(yearStem, yearBranch, month, day, hourBranch);

    // 性别修正数
    const genderNum = male ? 1 : 2;

    // 总数（各家说法不一，此取学术常见版本）
    const totalNum = xiantianShu + genderNum;

    // 卷数（每卷100条）
    const juanNum  = Math.ceil(totalNum / 100);
    // 条文号
    const tiaoNum  = ((totalNum - 1) % 100) + 1;

    // 起卦（总数除以8取余，余数对应先天八卦）
    const guaRemainder = totalNum % 8 || 8;
    const guaName = Object.keys(XIANTIAN_GUA).find(k => XIANTIAN_GUA[k] === guaRemainder) || '坤';

    // 变卦（天干数+地支数求变）
    const tgShu = TG_SHENGCHENG[yearStem] || 0;
    const dzShu = DZ_XIANTIAN[yearBranch] || 0;
    const bianGua = (tgShu + dzShu) % 8 || 8;
    const bianGuaName = Object.keys(XIANTIAN_GUA).find(k => XIANTIAN_GUA[k] === bianGua) || '乾';

    // 查条文
    const tiaowenKey = `${juanNum}-${tiaoNum}`;
    const tiaowen = TIAOWEN_DB[tiaowenKey] || getTiaowenApprox(juanNum, tiaoNum, xiantianShu, male);

    return {
      xiantianShu,
      genderNum,
      totalNum,
      juanNum,
      tiaoNum,
      tiaowenKey,
      tiaowen,
      guaName,
      bianGuaName,
      yearStem, yearBranch, month, day, hourBranch, male,
      steps: [
        { label: '年干先天数', value: TG_XIANTIAN[yearStem] || 0, stem: yearStem },
        { label: '年支先天数', value: DZ_XIANTIAN[yearBranch] || 0, branch: yearBranch },
        { label: '月数', value: month },
        { label: '日数', value: day },
        { label: '时支先天数', value: DZ_XIANTIAN[hourBranch] || 0, branch: hourBranch },
        { label: '性别数', value: genderNum, note: male ? '男命+1' : '女命+2' },
        { label: '合计（先天总数）', value: totalNum, highlight: true }
      ]
    };
  }

  /** 近似条文生成（当数据库中无对应条文时） */
  function getTiaowenApprox(juan, tiao, xiantian, male) {
    return {
      id: `${juan}-${tiao}`,
      text: `第${juan}卷第${tiao}条`,
      content: '（此条文需查阅原典《铁板神数》）',
      category: '待查',
      note: `先天数 ${xiantian}，如需精确条文请参阅邵雍原著陈明点校版`
    };
  }

  // ── 条文数据库（精选代表性条文） ────────────────────────────

  const TIAOWEN_DB = {
    '1-1': {
      id: '1-1',
      text: '第一卷第一条',
      content: '乾元用九，天下治也。刚健中正，纯粹精也。六爻发挥，旁通情也。时乘六龙，以御天也。云行雨施，天下平也。',
      category: '乾卦系辞',
      note: '此条主命主天格清贵，乾健之象，主一生刚毅有为'
    },
    '1-2': {
      id: '1-2',
      text: '第一卷第二条',
      content: '天地定位，山泽通气，雷风相薄，水火不相射。八卦相错，数往者顺，知来者逆，是故易，逆数也。',
      category: '先天八卦',
      note: '此条主知数知命，逆推顺行，洞晓天机'
    },
    '1-15': {
      id: '1-15',
      text: '第一卷第十五条',
      content: '父母宫中定吉凶，先看根基后看宗。年月二柱为父母，生克制化细推穷。',
      category: '六亲',
      note: '主父母宫位，推断父母缘分深浅'
    },
    '1-28': {
      id: '1-28',
      text: '第一卷第二十八条',
      content: '命宫福德皆相辅，财官印绶自天成。若得三奇归命位，一生富贵自然荣。',
      category: '富贵格局',
      note: '三奇得位，主富贵双全'
    },
    '2-1': {
      id: '2-1',
      text: '第二卷第一条',
      content: '坤顺承天，厚德载物。含弘光大，品物咸亨。牝马地类，行地无疆。柔顺利贞，君子攸行。',
      category: '坤卦系辞',
      note: '此条主命主地格温厚，坤顺之象，主一生稳健持重'
    },
    '2-17': {
      id: '2-17',
      text: '第二卷第十七条',
      content: '兄弟宫中看得失，比肩劫财细推排。同气相求原互助，竞争亦在此中来。',
      category: '六亲',
      note: '主兄弟姐妹宫，推断手足情缘'
    },
    '3-1': {
      id: '3-1',
      text: '第三卷第一条',
      content: '离为火，明两作，大人以继明照于四方。利贞，亨，畜牝牛，吉。',
      category: '离卦',
      note: '此条主文明昌盛，学识照耀四方'
    },
    '3-33': {
      id: '3-33',
      text: '第三卷第三十三条',
      content: '妻宫正财主贤淑，日支坐财家道丰。配偶温顺持家善，琴瑟和鸣寿无穷。',
      category: '婚姻',
      note: '主婚姻美满，配偶贤德'
    },
    '4-1': {
      id: '4-1',
      text: '第四卷第一条',
      content: '震为雷，洊雷震，君子以恐惧修省。震来虩虩，笑言哑哑，吉。',
      category: '震卦',
      note: '主警醒奋发，从恐惧中获得成长'
    },
    '4-44': {
      id: '4-44',
      text: '第四卷第四十四条',
      content: '子息宫中论儿女，食神伤官细推详。若得三柱有秀气，子孙聪慧福绵长。',
      category: '子息',
      note: '主子女聪慧，后代兴旺'
    },
    '5-1': {
      id: '5-1',
      text: '第五卷第一条',
      content: '巽为风，随风，君子以申命行事。入也，柔而又柔，重巽以申命，刚巽乎中正而志行。',
      category: '巽卦',
      note: '主柔顺申明，政令得行'
    },
    '6-1': {
      id: '6-1',
      text: '第六卷第一条',
      content: '坎为水，习坎，有孚维心，亨，行有尚。天险不可升也，地险山川丘陵也，王公设险以守其国。',
      category: '坎卦',
      note: '主历险而亨，守正待时'
    },
    '6-66': {
      id: '6-66',
      text: '第六卷第六十六条',
      content: '疾厄宫中看病痛，五行偏枯细推寻。若遇克泄太过重，一生体弱多伤侵。',
      category: '疾厄',
      note: '主身体健康状况，疾病预防之道'
    },
    '7-1': {
      id: '7-1',
      text: '第七卷第一条',
      content: '艮为山，兼山，君子以思不出其位。艮其背，不获其身，行其庭，不见其人，无咎。',
      category: '艮卦',
      note: '主守位安分，静以致远'
    },
    '7-77': {
      id: '7-77',
      text: '第七卷第七十七条',
      content: '迁移宫主出行运，驿马动方细推寻。若遇冲刑多奔波，若得生合主吉临。',
      category: '迁移',
      note: '主出行迁徙，驿马动静'
    },
    '8-1': {
      id: '8-1',
      text: '第八卷第一条',
      content: '坤为地，地势坤，君子以厚德载物。履霜坚冰至，阴始凝也，驯致其道，至坚冰也。',
      category: '坤卦',
      note: '主厚积薄发，积德以载万物'
    },
    '8-88': {
      id: '8-88',
      text: '第八卷第八十八条',
      content: '官禄宫中主功名，正官七杀细推评。若得官星有印绶，仕途显达一生荣。',
      category: '官禄',
      note: '主仕途功名，事业发展'
    }
  };

  // ── 命卦计算（配合铁板使用） ──────────────────────────────

  /**
   * 计算命卦（先天八卦命卦）
   * 男命：数减至一位数，1-8对应乾兑离震巽坎艮坤
   * 女命：不同起算
   */
  function calcMingGua(year, male) {
    const lastTwo = year % 100;
    let sum = Math.floor(lastTwo / 10) + (lastTwo % 10);
    while (sum > 9) {
      sum = Math.floor(sum / 10) + (sum % 10);
    }
    let guaNum;
    if (male) {
      guaNum = 11 - sum;
      if (guaNum > 9) guaNum -= 9;
    } else {
      guaNum = 4 + sum;
      if (guaNum > 9) guaNum -= 9;
    }
    // 五入坤（坤替换5）
    if (guaNum === 5) guaNum = male ? 2 : 8;

    const GUA_NAMES = {1:'坎',2:'坤',3:'震',4:'巽',6:'乾',7:'兑',8:'艮',9:'离'};
    const GUA_WX    = {1:'水',2:'土',3:'木',4:'木',6:'金',7:'金',8:'土',9:'火'};
    const GUA_DIR   = {1:'北',2:'西南',3:'东',4:'东南',6:'西北',7:'西',8:'东北',9:'南'};
    const DONG_GUA  = [1,3,4,9]; // 东四命
    const XI_GUA    = [2,6,7,8]; // 西四命

    return {
      guaNum,
      guaName: GUA_NAMES[guaNum] || '坤',
      wx: GUA_WX[guaNum] || '土',
      direction: GUA_DIR[guaNum] || '中',
      type: DONG_GUA.includes(guaNum) ? '东四命' : '西四命'
    };
  }

  // ── 搜索条文 ──────────────────────────────────────────────

  function searchTiaowen(query) {
    const q = query.toLowerCase().trim();
    if (!q) return Object.values(TIAOWEN_DB);
    return Object.values(TIAOWEN_DB).filter(t =>
      t.content.includes(q) || t.note.includes(q) || t.category.includes(q) || t.text.includes(q)
    );
  }

  function getAllTiaowen() {
    return Object.values(TIAOWEN_DB);
  }

  // ── 公开 API ──────────────────────────────────────────────

  return {
    calculate,
    calcMingGua,
    searchTiaowen,
    getAllTiaowen,
    TIAOWEN_DB,
    TG_XIANTIAN,
    DZ_XIANTIAN,
    XIANTIAN_GUA
  };

})();
