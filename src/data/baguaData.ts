export type ElementId = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type TrigramId =
  | 'qian'
  | 'dui'
  | 'li'
  | 'zhen'
  | 'xun'
  | 'kan'
  | 'gen'
  | 'kun';

export type ArrangementMode = 'xiantian' | 'houtian';
export type OrientationMode = 'south-up' | 'north-up';
export type YaoBit = 0 | 1; // 0 = 阴爻 (- -), 1 = 阳爻 (—)

export interface ElementInfo {
  id: ElementId;
  name: string;
  pinyin: string;
  english: string;
  color: string;
  softBg: string;
  traditionalColor: string;
  direction: string;
  season: string;
  nature: string;
  virtue: string;
  organ: string;
  generates: ElementId; // 我生
  generatedBy: ElementId; // 生我
  overcomes: ElementId; // 我克
  overcomeBy: ElementId; // 克我
  trigrams: TrigramId[];
  summary: string;
  mingpanMeaning: string;
}

export interface TrigramInfo {
  id: TrigramId;
  name: string;
  pinyin: string;
  englishName: string;
  symbol: string;
  yaos: [YaoBit, YaoBit, YaoBit]; // [初爻(内/下), 二爻(中), 上爻(外/上)]
  mnemonic: string;
  nature: string;
  natureEn: string;
  element: ElementId;
  familyRole: string;
  trait: string;
  xiantian: {
    number: number;
    direction: string;
    directionEn: string;
    angleSouthUp: number; // 0 = Top (South), 90 = Right (West), 180 = Bottom (North), 270 = Left (East)
  };
  houtian: {
    luoshuNumber: number;
    direction: string;
    directionEn: string;
    angleSouthUp: number;
    season: string;
    shuoGuaQuote: string;
  };
  earthlyBranches: string[];
  timeWindow: string;
  summary: string;
  xiantianVsHoutianNote: string;
  commonMisconception: string;
}

export interface EarthlyBranchInfo {
  name: string;
  pinyin: string;
  timeRange: string;
  hourLabel: string;
  element: ElementId;
  trigramId: TrigramId;
  angleSouthUp: number;
  zodiac: string;
}

export const ELEMENTS: Record<ElementId, ElementInfo> = {
  wood: {
    id: 'wood',
    name: '木',
    pinyin: 'Mù',
    english: 'Wood',
    color: '#4E9F76',
    softBg: 'rgba(78, 159, 118, 0.14)',
    traditionalColor: '青 · 苍绿',
    direction: '东方',
    season: '春季',
    nature: '生发 · 曲直 · 条达',
    virtue: '仁',
    organ: '肝 / 胆',
    generates: 'fire',
    generatedBy: 'water',
    overcomes: 'earth',
    overcomeBy: 'metal',
    trigrams: ['zhen', 'xun'],
    summary:
      '木主生发与舒展，如草木破土而出、枝叶向外条达。在命盘与节律中代表萌动、生长、规划与向上的生命张力。',
    mingpanMeaning:
      '后天八卦中东方的震（雷）与东南的巽（风）同属木，象征春雷惊蛰、长风催发，是一岁与一日阳气升腾的起点。',
  },
  fire: {
    id: 'fire',
    name: '火',
    pinyin: 'Huǒ',
    english: 'Fire',
    color: '#D4573B',
    softBg: 'rgba(212, 87, 59, 0.15)',
    traditionalColor: '赤 · 朱红',
    direction: '南方',
    season: '夏季',
    nature: '炎上 · 光明 · 显象',
    virtue: '礼',
    organ: '心 / 小肠',
    generates: 'earth',
    generatedBy: 'wood',
    overcomes: 'metal',
    overcomeBy: 'water',
    trigrams: ['li'],
    summary:
      '火性炎上而照亮万物，代表热能、文明、礼序、可见的形象与表达力。火亦需木为薪、土为归宿，过旺则燥，得水济则明。',
    mingpanMeaning:
      '后天离卦独居正南（洛书九宫），为太阳正午与盛夏极明之位，对应“相见乎离”，亦是传统命盘朝向正南的参照顶点。',
  },
  earth: {
    id: 'earth',
    name: '土',
    pinyin: 'Tǔ',
    english: 'Earth',
    color: '#C79B46',
    softBg: 'rgba(199, 155, 70, 0.16)',
    traditionalColor: '黄 · 赭石',
    direction: '中央 · 东北/西南过渡',
    season: '长夏 · 四季之交',
    nature: '稼穑 · 承载 · 转化',
    virtue: '信',
    organ: '脾 / 胃',
    generates: 'metal',
    generatedBy: 'fire',
    overcomes: 'water',
    overcomeBy: 'wood',
    trigrams: ['kun', 'gen'],
    summary:
      '土居中央而寄旺四隅，有承载、化育、蓄藏与缓冲转枢之功。万物非土不生、非土不归，是五行流转的中介枢纽。',
    mingpanMeaning:
      '洛书以五居中央为皇极土，八卦则分置西南坤土（洛书二）与东北艮土（洛书八）：坤土化育成熟，艮土止水蓄阳以待春。',
  },
  metal: {
    id: 'metal',
    name: '金',
    pinyin: 'Jīn',
    english: 'Metal',
    color: '#B8C4D4',
    softBg: 'rgba(184, 196, 212, 0.15)',
    traditionalColor: '白 · 素银',
    direction: '西方',
    season: '秋季',
    nature: '从革 · 收敛 · 肃杀',
    virtue: '义',
    organ: '肺 / 大肠',
    generates: 'water',
    generatedBy: 'earth',
    overcomes: 'wood',
    overcomeBy: 'fire',
    trigrams: ['qian', 'dui'],
    summary:
      '金象征收敛、锻造、决断与秋收成果，既有规则刚健之气，也代表矿藏历经冶炼后的精纯与秩序。',
    mingpanMeaning:
      '后天八卦中正西兑（泽，洛书七）与西北乾（天，洛书六）同属金，对应秋收悦言与秋冬交战收敛，金生水而启冬季潜藏。',
  },
  water: {
    id: 'water',
    name: '水',
    pinyin: 'Shuǐ',
    english: 'Water',
    color: '#4E86B8',
    softBg: 'rgba(78, 134, 184, 0.16)',
    traditionalColor: '玄 · 墨蓝',
    direction: '北方',
    season: '冬季',
    nature: '润下 · 潜藏 · 智变',
    virtue: '智',
    organ: '肾 / 膀胱',
    generates: 'wood',
    generatedBy: 'metal',
    overcomes: 'fire',
    overcomeBy: 'earth',
    trigrams: ['kan'],
    summary:
      '水润下而周流不滞，象征潜藏的蓄能、智慧、流动与生命本源。冬水虽寒，内里却含一阳初动之机（坎卦中满）。',
    mingpanMeaning:
      '后天坎卦独居正北（洛书一宫），对应子夜与深冬万物归藏，同时水生木，为下一轮东方震木的生发积蓄底气。',
  },
};

export const ELEMENT_ORDER: ElementId[] = [
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
];

export const TRIGRAMS: Record<TrigramId, TrigramInfo> = {
  qian: {
    id: 'qian',
    name: '乾',
    pinyin: 'Qián',
    englishName: 'Heaven / Creative',
    symbol: '☰',
    yaos: [1, 1, 1],
    mnemonic: '乾三连',
    nature: '天',
    natureEn: 'Heaven',
    element: 'metal',
    familyRole: '父（纯阳之尊）',
    trait: '刚健 · 统摄 · 自强不息',
    xiantian: {
      number: 1,
      direction: '正南',
      directionEn: 'South',
      angleSouthUp: 0,
    },
    houtian: {
      luoshuNumber: 6,
      direction: '西北',
      directionEn: 'Northwest',
      angleSouthUp: 135,
      season: '秋冬之交',
      shuoGuaQuote: '战乎乾 — 阴阳相薄、天道收敛决断之位',
    },
    earthlyBranches: ['戌', '亥'],
    timeWindow: '19:00 – 23:00',
    summary:
      '三爻皆阳，象征纯阳刚健与宇宙运行的天道法则。在基础命盘中代表统领、格局骨架与刚断行动力。',
    xiantianVsHoutianNote:
      '先天居正南（数1）与正北坤（数8）相对，建立“天地定位”的垂直轴；后天退居西北（洛书6），转为收敛统筹与秋冬交替之枢纽。',
    commonMisconception:
      '乾属金并非单纯指金属矿物，而是取“天体运转刚健肃穆、历久不渝”的“金石之健”意象。',
  },
  dui: {
    id: 'dui',
    name: '兑',
    pinyin: 'Duì',
    englishName: 'Lake / Joyous',
    symbol: '☱',
    yaos: [1, 1, 0],
    mnemonic: '兑上缺',
    nature: '泽',
    natureEn: 'Lake / Marsh',
    element: 'metal',
    familyRole: '少女（一阴在上）',
    trait: '欣悦 · 言语 · 滋润聚汇',
    xiantian: {
      number: 2,
      direction: '东南',
      directionEn: 'Southeast',
      angleSouthUp: 315,
    },
    houtian: {
      luoshuNumber: 7,
      direction: '正西',
      directionEn: 'West',
      angleSouthUp: 90,
      season: '仲秋（秋分）',
      shuoGuaQuote: '说言乎兑 — 秋收盈满、万物欣悦沟通之位',
    },
    earthlyBranches: ['酉'],
    timeWindow: '17:00 – 19:00',
    summary:
      '内二阳刚而外一阴柔，如泽水汇聚、开口微笑，故“兑为口、为悦”。象征表达交流、收获喜悦与柔和聚合。',
    xiantianVsHoutianNote:
      '先天居东南（数2）与西北艮山（数7）对望，形成“山泽通气”；后天移至正西（洛书7），对应日落酉时与金秋收获。',
    commonMisconception:
      '看到“泽”容易误以为属水，实际上兑卦五行属金（秋气肃润、金生水之源），坎才是正水。',
  },
  li: {
    id: 'li',
    name: '离',
    pinyin: 'Lí',
    englishName: 'Fire / Clinging',
    symbol: '☲',
    yaos: [1, 0, 1],
    mnemonic: '离中虚',
    nature: '火',
    natureEn: 'Fire / Sun',
    element: 'fire',
    familyRole: '中女（一阴居中）',
    trait: '光明 · 附丽 · 文明辨识',
    xiantian: {
      number: 3,
      direction: '正东',
      directionEn: 'East',
      angleSouthUp: 270,
    },
    houtian: {
      luoshuNumber: 9,
      direction: '正南',
      directionEn: 'South',
      angleSouthUp: 0,
      season: '盛夏（夏至）',
      shuoGuaQuote: '相见乎离 — 万物显明、南面而听天下的极明之位',
    },
    earthlyBranches: ['午'],
    timeWindow: '11:00 – 13:00',
    summary:
      '外阳实而内阴虚，如火焰外明而心虚，需有所附丽（薪柴）方能长燃。象征光明、视察、文化礼仪与心神意识。',
    xiantianVsHoutianNote:
      '先天居正东（数3，日出东方之位）与正西坎水对举；后天跃居正南（洛书9，日中极阳之位），替代先天乾位成为后天南极主标。',
    commonMisconception:
      '离卦两阳一阴却是“阴卦”（以少者为主），因为它的核心主爻是居中的那一阴，故外刚内柔、外明内虚。',
  },
  zhen: {
    id: 'zhen',
    name: '震',
    pinyin: 'Zhèn',
    englishName: 'Thunder / Arousing',
    symbol: '☳',
    yaos: [1, 0, 0],
    mnemonic: '震仰盂',
    nature: '雷',
    natureEn: 'Thunder',
    element: 'wood',
    familyRole: '长男（一阳居初）',
    trait: '震动 · 发动 · 破土而生',
    xiantian: {
      number: 4,
      direction: '东北',
      directionEn: 'Northeast',
      angleSouthUp: 225,
    },
    houtian: {
      luoshuNumber: 3,
      direction: '正东',
      directionEn: 'East',
      angleSouthUp: 270,
      season: '仲春（春分）',
      shuoGuaQuote: '帝出乎震 — 阳气始动、生机破发之首站',
    },
    earthlyBranches: ['卯'],
    timeWindow: '05:00 – 07:00',
    summary:
      '一阳生于二阴之下（初爻为阳），如春雷动于地下、草木萌芽初发，形似口朝上的钵盂。象征起动、行动、声威与变革开端。',
    xiantianVsHoutianNote:
      '先天居东北（数4）与西南巽风（数5）相对，谓之“雷风相薄”；后天移至正东（洛书3），正式拉开四季循环的序幕。',
    commonMisconception:
      '看符号 ☳ 时注意：最下方那条实线才是“初爻”，在圆形命盘上它最靠近圆心（内初外上）。',
  },
  xun: {
    id: 'xun',
    name: '巽',
    pinyin: 'Xùn',
    englishName: 'Wind / Gentle',
    symbol: '☴',
    yaos: [0, 1, 1],
    mnemonic: '巽下断',
    nature: '风',
    natureEn: 'Wind / Wood',
    element: 'wood',
    familyRole: '长女（一阴居初）',
    trait: '顺入 · 渗透 · 传达散播',
    xiantian: {
      number: 5,
      direction: '西南',
      directionEn: 'Southwest',
      angleSouthUp: 45,
    },
    houtian: {
      luoshuNumber: 4,
      direction: '东南',
      directionEn: 'Southeast',
      angleSouthUp: 315,
      season: '春夏之交',
      shuoGuaQuote: '齐乎巽 — 春风拂拂、万物繁茂洁齐之位',
    },
    earthlyBranches: ['辰', '巳'],
    timeWindow: '07:00 – 11:00',
    summary:
      '一阴潜入二阳之下，如风无孔不入、木根深扎于土，故“巽为风、亦为木”。象征渗透力、申命传达与柔顺渐进。',
    xiantianVsHoutianNote:
      '先天居西南（数5），位于伏羲S线跨越中宫后的第一站；后天移至东南（洛书4），接续正东震木，助火势在南方离位燃起。',
    commonMisconception:
      '常与兑混淆：巽是“初爻断（下面断）”，兑是“上爻缺（上面缺）”，记忆口诀为“兑上缺、巽下断”。',
  },
  kan: {
    id: 'kan',
    name: '坎',
    pinyin: 'Kǎn',
    englishName: 'Water / Abysmal',
    symbol: '☵',
    yaos: [0, 1, 0],
    mnemonic: '坎中满',
    nature: '水',
    natureEn: 'Water / Moon',
    element: 'water',
    familyRole: '中男（一阳居中）',
    trait: '险陷 · 润流 · 外柔内刚',
    xiantian: {
      number: 6,
      direction: '正西',
      directionEn: 'West',
      angleSouthUp: 90,
    },
    houtian: {
      luoshuNumber: 1,
      direction: '正北',
      directionEn: 'North',
      angleSouthUp: 180,
      season: '仲冬（冬至）',
      shuoGuaQuote: '劳乎坎 — 万物归藏休憩、阴中抱阳之位',
    },
    earthlyBranches: ['子'],
    timeWindow: '23:00 – 01:00',
    summary:
      '外阴虚而中阳实，如江河水流外柔而内劲、深谷幽泉暗藏生机。在命盘中代表深度思考、风险考验、流动性与蓄势。',
    xiantianVsHoutianNote:
      '先天居正西（数6，月生西方）与正东离火对峙，“水火不相射”；后天居正北（洛书1），取代先天坤位，成为冬季与子夜归藏之极。',
    commonMisconception:
      '坎虽属水代表险阻寒冬，但中间那条阳爻恰恰是“冬至一阳生”的种子，并非绝对静止或死寂。',
  },
  gen: {
    id: 'gen',
    name: '艮',
    pinyin: 'Gèn',
    englishName: 'Mountain / Keeping Still',
    symbol: '☶',
    yaos: [0, 0, 1],
    mnemonic: '艮覆碗',
    nature: '山',
    natureEn: 'Mountain',
    element: 'earth',
    familyRole: '少男（一阳居上）',
    trait: '止静 · 界限 · 终始成言',
    xiantian: {
      number: 7,
      direction: '西北',
      directionEn: 'Northwest',
      angleSouthUp: 135,
    },
    houtian: {
      luoshuNumber: 8,
      direction: '东北',
      directionEn: 'Northeast',
      angleSouthUp: 225,
      season: '冬春之交',
      shuoGuaQuote: '成言乎艮 — 万物所成终而所成始之枢纽',
    },
    earthlyBranches: ['丑', '寅'],
    timeWindow: '01:00 – 05:00',
    summary:
      '一阳高止于二阴之上，如高山隆起而下厚重，形似倒扣的碗（覆碗）。象征停止、界限、稳固守护与阶段交替。',
    xiantianVsHoutianNote:
      '先天居西北（数7）与东南兑泽相对；后天居东北（洛书8），承接坎水之终并开启震木之始，故称“成终而成始”。',
    commonMisconception:
      '艮的“止”不是消极停摆，而是“当止则止”的边界感与蓄力待发，好比黎明前寅时的沉稳转换。',
  },
  kun: {
    id: 'kun',
    name: '坤',
    pinyin: 'Kūn',
    englishName: 'Earth / Receptive',
    symbol: '☷',
    yaos: [0, 0, 0],
    mnemonic: '坤六断',
    nature: '地',
    natureEn: 'Earth',
    element: 'earth',
    familyRole: '母（纯阴之承）',
    trait: '厚德 · 包容 · 顺承化育',
    xiantian: {
      number: 8,
      direction: '正北',
      directionEn: 'North',
      angleSouthUp: 180,
    },
    houtian: {
      luoshuNumber: 2,
      direction: '西南',
      directionEn: 'Southwest',
      angleSouthUp: 45,
      season: '夏秋之交',
      shuoGuaQuote: '致役乎坤 — 大地滋养万物、使之成熟收获之位',
    },
    earthlyBranches: ['未', '申'],
    timeWindow: '13:00 – 17:00',
    summary:
      '三爻皆阴（共六段），象征大地般广阔包容、顺承天时而化生万物。在基础命盘中代表承载根基、执行配合与丰厚滋养。',
    xiantianVsHoutianNote:
      '先天居正北（数8）与正南乾天对立统一；后天移至西南（洛书2），承接正南离火之热，转为长夏土气并生养西方兑乾之金。',
    commonMisconception:
      '阴爻与坤卦并非“消极/弱小”，《易传》以“厚德载物”赞坤，与乾之“自强不息”并重，缺一则乾阳无所落脚。',
  },
};

export const TRIGRAM_LIST: TrigramInfo[] = [
  TRIGRAMS.qian,
  TRIGRAMS.dui,
  TRIGRAMS.li,
  TRIGRAMS.zhen,
  TRIGRAMS.xun,
  TRIGRAMS.kan,
  TRIGRAMS.gen,
  TRIGRAMS.kun,
];

// 十二地支与后天八卦方位严格对应（南午=0°, 顺时针递增）
export const EARTHLY_BRANCHES: EarthlyBranchInfo[] = [
  { name: '午', pinyin: 'Wǔ', timeRange: '11:00–13:00', hourLabel: '正午', element: 'fire', trigramId: 'li', angleSouthUp: 0, zodiac: '马' },
  { name: '未', pinyin: 'Wèi', timeRange: '13:00–15:00', hourLabel: '日昳', element: 'earth', trigramId: 'kun', angleSouthUp: 30, zodiac: '羊' },
  { name: '申', pinyin: 'Shēn', timeRange: '15:00–17:00', hourLabel: '晡时', element: 'metal', trigramId: 'kun', angleSouthUp: 60, zodiac: '猴' },
  { name: '酉', pinyin: 'Yǒu', timeRange: '17:00–19:00', hourLabel: '日入', element: 'metal', trigramId: 'dui', angleSouthUp: 90, zodiac: '鸡' },
  { name: '戌', pinyin: 'Xū', timeRange: '19:00–21:00', hourLabel: '黄昏', element: 'earth', trigramId: 'qian', angleSouthUp: 120, zodiac: '狗' },
  { name: '亥', pinyin: 'Hài', timeRange: '21:00–23:00', hourLabel: '人定', element: 'water', trigramId: 'qian', angleSouthUp: 150, zodiac: '猪' },
  { name: '子', pinyin: 'Zǐ', timeRange: '23:00–01:00', hourLabel: '夜半', element: 'water', trigramId: 'kan', angleSouthUp: 180, zodiac: '鼠' },
  { name: '丑', pinyin: 'Chǒu', timeRange: '01:00–03:00', hourLabel: '鸡鸣', element: 'earth', trigramId: 'gen', angleSouthUp: 210, zodiac: '牛' },
  { name: '寅', pinyin: 'Yín', timeRange: '03:00–05:00', hourLabel: '平旦', element: 'wood', trigramId: 'gen', angleSouthUp: 240, zodiac: '虎' },
  { name: '卯', pinyin: 'Mǎo', timeRange: '05:00–07:00', hourLabel: '日出', element: 'wood', trigramId: 'zhen', angleSouthUp: 270, zodiac: '兔' },
  { name: '辰', pinyin: 'Chén', timeRange: '07:00–09:00', hourLabel: '食时', element: 'earth', trigramId: 'xun', angleSouthUp: 300, zodiac: '龙' },
  { name: '巳', pinyin: 'Sì', timeRange: '09:00–11:00', hourLabel: '隅中', element: 'fire', trigramId: 'xun', angleSouthUp: 330, zodiac: '蛇' },
];

export const XIANTIAN_PAIRS: Array<{
  title: string;
  a: TrigramId;
  b: TrigramId;
  meaning: string;
}> = [
  { title: '天地定位', a: 'qian', b: 'kun', meaning: '正南纯阳乾天与正北纯阴坤地，立起宇宙纵向基准轴。' },
  { title: '山泽通气', a: 'gen', b: 'dui', meaning: '西北艮山与东南兑泽相对，高下呼应、水汽升降交通。' },
  { title: '雷风相薄', a: 'zhen', b: 'xun', meaning: '东北震雷与西南巽风相激相荡，鼓动万物生发。' },
  { title: '水火不相射', a: 'kan', b: 'li', meaning: '正西坎水与正东离火对列而互济不伤，如日月相推。' },
];

export interface RelationCategory {
  key: 'same' | 'generates' | 'generatedBy' | 'overcomes' | 'overcomeBy';
  label: string;
  shortDesc: string;
}

export const ELEMENT_RELATIONS: RelationCategory[] = [
  { key: 'same', label: '同气比和', shortDesc: '五行相同，气息共振' },
  { key: 'generatedBy', label: '生我者（滋养源）', shortDesc: '为本卦提供能量与支撑' },
  { key: 'generates', label: '我生者（输出向）', shortDesc: '由本卦孕育、向外显发' },
  { key: 'overcomeBy', label: '克我者（制约规矩）', shortDesc: '对本卦形成约束与雕琢' },
  { key: 'overcomes', label: '我克者（驾驭对象）', shortDesc: '本卦主动掌控、梳理的对象' },
];

export function findTrigramByYaos(yaos: [YaoBit, YaoBit, YaoBit]): TrigramInfo {
  const found = TRIGRAM_LIST.find(
    (t) =>
      t.yaos[0] === yaos[0] && t.yaos[1] === yaos[1] && t.yaos[2] === yaos[2]
  );
  return found ?? TRIGRAMS.qian;
}

export interface ReferenceItem {
  title: string;
  category: string;
  url: string;
  usage: string;
}

export const REFERENCE_SOURCES: ReferenceItem[] = [
  {
    title: 'Bagua — Wikipedia',
    category: '英文百科对照',
    url: 'https://en.wikipedia.org/wiki/Bagua',
    usage: '对齐八卦卦象、中英音译、自然意象、五行归属与先/后天方位对照表。',
  },
  {
    title: 'Wu Xing — New World Encyclopedia',
    category: '英文百科对照',
    url: 'https://www.newworldencyclopedia.org/entry/Wu_Xing',
    usage: '参考五行（金木水火土）核心定义、相生相克逻辑与历法文化延伸。',
  },
  {
    title: 'Baguame Knowledge Base',
    category: '英文科普索引',
    url: 'https://baguame.com/kb/',
    usage: 'Five Elements 与 Eight Trigrams 英文基础科普条目。',
  },
  {
    title: 'Ba Gua Guide（方位与五行对应）',
    category: '英文科普指南',
    url: 'https://fengsuihk.com/en/blogs/news/ba-gua-guide',
    usage: '核对八卦各自方位、核心意象及常见误区边界说明。',
  },
  {
    title: '五行八卦图解全图（百度科普）',
    category: '中文科普图文',
    url: 'https://kuku.baidu.com/landing/tscp_doc/5ea2bad043546e408ee9daeca2755c69',
    usage: '梳理中文语境下阴爻阳爻、相生相克与先后天八卦的基础科普脉络。',
  },
  {
    title: '6yao.ai 命理知识库',
    category: '术数边界参考',
    url: 'https://www.6yao.ai/blog',
    usage: '区分“通用哲学符号/基础命盘认知”与“六爻、八字、奇门、梅花等术数体系”的边界。',
  },
  {
    title: 'wuji-labs/hetu-luoshu（GitHub）',
    category: '结构化框架参考',
    url: 'https://github.com/wuji-labs/hetu-luoshu',
    usage: '借鉴将阴阳、卦象、变易框架结构化呈现与防跑偏约束的导航思路。',
  },
];

export const SCOPE_DISTINCTIONS = [
  {
    title: '本页面（基础命盘科普层）',
    badge: '当前阶段 Step 1',
    points: [
      '聚焦阴阳两仪、三爻成卦、先天八卦（伏羲）与后天八卦（文王）的空间方位差异。',
      '解释“上南下北、左东右西”的古法观象视角，以及初爻向心、上爻向外的读盘规则。',
      '展示五行相生相克与十二地支时辰如何在同一基础命盘结构上相互咬合。',
    ],
  },
  {
    title: '术数推演体系（进阶延伸层）',
    badge: '非本页直接结论',
    points: [
      '八字四柱：侧重出生年月日的干支历法与十神生克制化，而非单纯看单一卦象。',
      '六爻纳甲 / 梅花易数：重在将三画经卦重叠为六十四别卦，结合动爻、体用、世应断事。',
      '奇门遁甲 / 紫微斗数：属于多盘套叠（地盘、天盘、八门九星或星曜十二宫）的精密模型。',
    ],
  },
];
