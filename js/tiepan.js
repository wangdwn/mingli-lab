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
    },
    '1-8': {
      id: '1-8',
      text: '第1卷第8条',
      content: "命中若遇三奇贵，一生清贵自然成。印绶官星皆聚会，文章事业显峥嵘。",
      category: "总论",
      note: "三奇格局，主文贵两全，事业有成",
      plain: ""
    },
    '1-22': {
      id: '1-22',
      text: '第1卷第22条',
      content: "偏财坐禄居旺地，父亲事业顺风行。若遇印星来护卫，父寿悠长福禄盈。",
      category: "六亲",
      note: "偏财为父，旺相得禄，主父亲事业顺遂，长寿多福",
      plain: ""
    },
    '1-35': {
      id: '1-35',
      text: '第1卷第35条',
      content: "椿萱并茂岁月长，父母宫中气未伤。年月得生无大克，双亲康泰守家乡。",
      category: "六亲",
      note: "教学整理条 · 六亲验证常用对照意象；请与原典卷条互参",
      plain: "常见用来对照「父母都还健在、家庭根基尚稳」的意象。仍须用事实校准，不是保证书。"
    },
    '1-42': {
      id: '1-42',
      text: '第1卷第42条',
      content: "年干受克父星伤，少失严亲泪两行。若得印星来救护，晚景犹可近高堂。",
      category: "六亲",
      note: "教学整理条 · 用于路径校验时的父母象",
      plain: "提示「与父亲缘分波折或早别」一类对照，不是判决。有救护星则另说。"
    },
    '2-25': {
      id: '2-25',
      text: '第2卷第25条',
      content: "月柱比劫气独清，排行居长事可凭。手足缘深还是竞，须看生克两相成。",
      category: "六亲",
      note: "教学整理条 · 兄弟／排行验证",
      plain: "常用来对照「家中排行居长」。手足是互助还是较劲，还要看生克。"
    },
    '2-33': {
      id: '2-33',
      text: '第2卷第33条',
      content: "日支坐财妻贤淑，配偶温顺家道丰。正财有印双星护，琴瑟和鸣寿无穷。夫妻宫中无克刑，恩爱和谐到白头。",
      category: "婚姻",
      note: "日支坐财，正财有印护，主婚姻美满，夫妻恩爱长久",
      plain: ""
    },
    '2-38': {
      id: '2-38',
      text: '第2卷第38条',
      content: "月令克泄比劫稀，手足缘薄各自飞。纵有同堂难同路，各自成家各一扉。",
      category: "六亲",
      note: "教学整理条",
      plain: "对照「兄弟姐妹缘分淡、各过各的」一类生活象。"
    },
    '2-45': {
      id: '2-45',
      text: '第2卷第45条',
      content: "日柱冲刑伤官重，婚姻多波难白头。若无贵人来化解，孤独寂寞伴一生。伤官见官不为贵，婚路崎岖苦中求。",
      category: "婚姻",
      note: "日支受冲、伤官重叠，主婚姻不顺，感情多磨难",
      plain: ""
    },
    '3-18': {
      id: '3-18',
      text: '第3卷第18条',
      content: "财星旺相居月令，一生财源广进来。若得比劫不太重，积财聚富自能开。偏财主横财机遇，正财主勤劳积累。",
      category: "财帛",
      note: "财星当令旺相，比劫适度，主财运亨通，积累有道",
      plain: ""
    },
    '3-40': {
      id: '3-40',
      text: '第3卷第40条',
      content: "夫妻宫中迟见财，晚成眷属亦和谐。若逢大运开情窍，花开不在少年阶。",
      category: "婚姻",
      note: "教学整理条",
      plain: "意象偏「感情成熟得晚一些，晚成亦可」。不作婚恋承诺。"
    },
    '3-48': {
      id: '3-48',
      text: '第3卷第48条',
      content: "偏财透出人缘广，外财机遇不寻常。若无比劫来分夺，合作项目亦可商。",
      category: "财帛",
      note: "教学整理条",
      plain: "偏向外快、人脉型机会；比劫多则易被分利。仍是意象。"
    },
    '4-55': {
      id: '4-55',
      text: '第4卷第55条',
      content: "时柱受克子息难，官杀混杂子缘薄。若无食伤来泄秀，膝下萧条晚景寒。然若大运逢吉化，子孙仍可得安康。",
      category: "子息",
      note: "时柱受克或官杀重，主子女缘薄，晚年宜注意",
      plain: ""
    },
    '4-60': {
      id: '4-60',
      text: '第4卷第60条',
      content: "时柱气弱子缘迟，食伤不透莫强期。运岁相生开秀气，兰桂仍可晚成枝。",
      category: "子息",
      note: "教学整理条",
      plain: "对照「子女来得晚或缘分晚显」；大运流年有转机则另论。"
    },
    '5-22': {
      id: '5-22',
      text: '第5卷第22条',
      content: "财多身弱反为贫，守财无力任人侵。若无比劫来帮身，逢财反致百事难。身弱财旺宜从财，反以顺势获吉临。",
      category: "财帛",
      note: "财多身弱，无比劫帮扶，主虽有财缘却难以守住，反生困厄",
      plain: ""
    },
    '5-30': {
      id: '5-30',
      text: '第5卷第30条',
      content: "官杀重重身不支，职务压力自相随。若得印比来扶身，责任可化作成就碑。",
      category: "官禄",
      note: "教学整理条",
      plain: "责任／规矩太重而自身气力不够时，压力大；有贵人学业或同辈帮衬会好过些。"
    },
    '5-40': {
      id: '5-40',
      text: '第5卷第40条',
      content: "流年交变看岁君，本命合参定明文。先把已知年事对，再推未知莫轻云。",
      category: "运势",
      note: "教学整理 · 呼应框架「流年交变数」与验证优先",
      plain: "推某年运势前，先拿已经发生过的年份对一对路径——对上了再往前看。"
    },
    '6-77': {
      id: '6-77',
      text: '第6卷第77条',
      content: "木主肝胆筋与目，火主心脏小肠推。土主脾胃与肌肉，金主肺肠皮毛随。水主肾膀骨与耳，五行对应脏腑知。",
      category: "疾厄",
      note: "五行与脏腑对应，木-肝、火-心、土-脾、金-肺、水-肾",
      plain: ""
    },
    '6-80': {
      id: '6-80',
      text: '第6卷第80条',
      content: "偏枯二字看劳逸，水亏宜早眠，火燥宜缓激。条文提醒节奏，医疗仍须寻医。",
      category: "疾厄",
      note: "教学整理条 · 非医疗建议",
      plain: "把「偏枯」读成作息提醒：某类消耗过大时先调节奏。身体不适请就医。"
    },
    '7-80': {
      id: '7-80',
      text: '第7卷第80条',
      content: "驿马逢生出乡吉，迁移有助展才力。冲刑多则路途劳，择地择时细思量。",
      category: "迁移",
      note: "教学整理条",
      plain: "走动／换城市有时是加分，有时是奔波——看生合还是冲刑的意象。"
    },
    '8-55': {
      id: '8-55',
      text: '第8卷第55条',
      content: "大运一运管十年，流年岁运细推研。大运喜神来当令，十年顺遂百事安。大运逢凶神当道，十年蹭蹬百事艰。",
      category: "运势",
      note: "大运十年为一期，喜神得令则吉，凶神当道则艰，流年为辅",
      plain: ""
    },
    '8-66': {
      id: '8-66',
      text: '第8卷第66条',
      content: "大运喜神来当令，十年诸事少纷争。忌神叠至宜守成，开源节流待时更。",
      category: "运势",
      note: "教学整理条",
      plain: "十年大运像季节：顺风时可进取，逆风时宜守成。本站未自动裁定喜忌。"
    },
    '9-9': {
      id: '9-9',
      text: '第9卷第9条',
      content: "八字若成从格局，顺势而为反吉昌。从财从杀从儿女，顺其势者方无殃。逆从者损，顺从者益，从格之妙在顺势。",
      category: "格局",
      note: "从格需纯粹，日主无根可依时顺势从强，反得吉祥",
      plain: ""
    },
    '9-19': {
      id: '9-19',
      text: '第9卷第19条',
      content: "一行得气成专旺，顺其本气自然昌。木火土金水各旺，曲直炎上稼穑彰。从革润下皆贵格，五行专旺不寻常。",
      category: "格局",
      note: "五行专旺五格：曲直（木）、炎上（火）、稼穑（土）、从革（金）、润下（水）",
      plain: ""
    },
    '9-25': {
      id: '9-25',
      text: '第9卷第25条',
      content: "月令建禄日主强，自立谋生路自宽。忌财党杀来攻身，用伤食泄秀为良。",
      category: "格局",
      note: "教学整理 · 子平建禄思路提要，非铁板原卷全文",
      plain: "月令帮身有力时，多靠自己本事吃饭；财官过重反而吃力，适合把才华泄出来做事。"
    },
    '9-30': {
      id: '9-30',
      text: '第9卷第30条',
      content: "干合化气月令成，化神得令格局清。化成宜行化神运，破格冲克要留神。",
      category: "格局",
      note: "教学整理 · 子平化气思路提要",
      plain: "合化成功且月令支持时，人生叙事常围着「化神」那一行转；运势也宜顺着它。"
    },
    '10-10': {
      id: '10-10',
      text: '第10卷第10条',
      content: "流年如客来拜访，岁运相逢细推详。太岁五行喜与忌，一年顺逆此中藏。岁运并临喜神位，一年诸事皆安康。",
      category: "运势",
      note: "流年为太岁，与大运相配合推断，喜神并临则吉，凶神叠至则损",
      plain: ""
    },
    '10-20': {
      id: '10-20',
      text: '第10卷第20条',
      content: "岁运并临力量增，喜则锦上花更明。忌则一事激两浪，谨慎决策过此程。",
      category: "运势",
      note: "教学整理条",
      plain: "大运与流年同气时，好事坏事都可能被放大——顺则更顺，逆则更要稳住。"
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
