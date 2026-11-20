import type { TrigramId } from './baguaData';

export interface HexagramInfo {
  number: number;
  name: string;
  fullName: string;
  symbol: string;
  upper: TrigramId;
  lower: TrigramId;
  trend: string;
  judgment: string;
  advice: string;
}

export const HEXAGRAMS: HexagramInfo[] = [
  { number: 1, name: '乾', fullName: '乾为天', symbol: '䷀', upper: 'qian', lower: 'qian', trend: '刚健开创', judgment: '元亨利贞，天行健，君子以自强不息。', advice: '势能充沛、方向明确，宜主动担当与稳步推进，同时留意“亢龙有悔”，居高不忘克制。' },
  { number: 2, name: '坤', fullName: '坤为地', symbol: '䷁', upper: 'kun', lower: 'kun', trend: '厚德承载', judgment: '厚德载物，柔顺利贞，先迷后得主。', advice: '此时贵在顺势协作与夯实基础，不宜孤行争先，以包容与耐心承接资源方能水到渠成。' },
  { number: 3, name: '屯', fullName: '水雷屯', symbol: '䷂', upper: 'kan', lower: 'zhen', trend: '始生蓄势', judgment: '刚柔始交而难生，动乎险中，大亨贞。', advice: '万事开头常伴阻力，如草木破土。宜梳理秩序、广结助力，先稳住根基再谋扩张。' },
  { number: 4, name: '蒙', fullName: '山水蒙', symbol: '䷃', upper: 'gen', lower: 'kan', trend: '启蒙求知', judgment: '山下出泉，蒙；君子以果行育德。', advice: '局势尚有未知与迷雾，切忌盲目拍板。虚心请教行家、补足关键信息是最优解。' },
  { number: 5, name: '需', fullName: '水天需', symbol: '䷄', upper: 'kan', lower: 'qian', trend: '待时而动', judgment: '有孚，光亨，贞吉。利涉大川。', advice: '条件尚未完全成熟，急躁反而耗损实力。保持定力、养精蓄锐，静待关键窗口开启。' },
  { number: 6, name: '讼', fullName: '天水讼', symbol: '䷅', upper: 'qian', lower: 'kan', trend: '慎争止纷', judgment: '有孚窒，惕中吉，终凶。', advice: '易出现立场分歧或沟通摩擦。遇事多谋于始，能以协商和解收场则远胜于硬碰硬。' },
  { number: 7, name: '师', fullName: '地水师', symbol: '䷆', upper: 'kun', lower: 'kan', trend: '严明统筹', judgment: '贞，丈人吉，无咎。', advice: '需要团队协作与纪律执行。明确核心目标与责任人，凝聚共识方能攻克难关。' },
  { number: 8, name: '比', fullName: '水地比', symbol: '䷇', upper: 'kan', lower: 'kun', trend: '亲比协作', judgment: '吉。原筮元永贞，无咎。', advice: '人际与资源契合度高，适合建立长期信任与合作联盟，真诚相待则互利共赢。' },
  { number: 9, name: '小畜', fullName: '风天小畜', symbol: '䷈', upper: 'xun', lower: 'qian', trend: '小积渐进', judgment: '亨。密云不雨，自我西郊。', advice: '力量仍在积攒阶段，虽见云气未成大雨。宜专注细节打磨与微调，莫求一步登天。' },
  { number: 10, name: '履', fullName: '天泽履', symbol: '䷉', upper: 'qian', lower: 'dui', trend: '谨言慎行', judgment: '履虎尾，不咥人，亨。', advice: '身处关键或敏感局面，只要守礼守规、态度谦和，便能化险为夷、稳步通关。' },
  { number: 11, name: '泰', fullName: '地天泰', symbol: '䷊', upper: 'kun', lower: 'qian', trend: '天地交泰', judgment: '小往大来，吉亨。', advice: '上下沟通顺畅、内外和谐通达，是推进重要计划的良机，亦需居安思危以保长泰。' },
  { number: 12, name: '否', fullName: '天地否', symbol: '䷋', upper: 'qian', lower: 'kun', trend: '闭塞守静', judgment: '天地不交，万物不通；君子以俭德辟难。', advice: '阶段性沟通受阻或环境偏冷，宜收敛锋芒、修练内功、降本增效，静待否极泰来。' },
  { number: 13, name: '同人', fullName: '天火同人', symbol: '䷌', upper: 'qian', lower: 'li', trend: '志同道合', judgment: '同人于野，亨。利涉大川。', advice: '打破小圈子局限，以开放公心寻找志同道合的伙伴，合力之下可成大事。' },
  { number: 14, name: '大有', fullName: '火天大有', symbol: '䷍', upper: 'li', lower: 'qian', trend: '丰盈明盛', judgment: '元亨。火在天上，君子以遏恶扬善。', advice: '资源与声望渐入丰收期，保持谦逊透明与善意分享，能让成果更加稳固长久。' },
  { number: 15, name: '谦', fullName: '地山谦', symbol: '䷎', upper: 'kun', lower: 'gen', trend: '谦逊有终', judgment: '亨，君子有终。', advice: '有实力而不张扬，是六十四卦中极佳的稳健态势。放低姿态、务实耕耘，终得回报。' },
  { number: 16, name: '豫', fullName: '雷地豫', symbol: '䷏', upper: 'zhen', lower: 'kun', trend: '顺动欣悦', judgment: '利建侯行师，顺以动。', advice: '士气高昂、顺势而发，适合启动创意或团队动员；顺境中切记莫沉溺逸乐。' },
  { number: 17, name: '随', fullName: '泽雷随', symbol: '䷐', upper: 'dui', lower: 'zhen', trend: '顺时变通', judgment: '元亨利贞，无咎。', advice: '不必固守旧执，懂得倾听反馈、顺应时势调整节奏，反而能赢得更多主动权。' },
  { number: 18, name: '蛊', fullName: '山风蛊', symbol: '䷑', upper: 'gen', lower: 'xun', trend: '整饬除弊', judgment: '元亨，利涉大川。先甲三日，后甲三日。', advice: '积弊已久正需大刀阔斧地清理与重构，做好前置规划与后续复盘，焕然一新可期。' },
  { number: 19, name: '临', fullName: '地泽临', symbol: '䷒', upper: 'kun', lower: 'dui', trend: '阳气渐长', judgment: '元亨利贞，教思无穷，容保民无疆。', advice: '积极因素正在上升，适合主动推进与亲自督导，同时提前防范后续周期波动。' },
  { number: 20, name: '观', fullName: '风地观', symbol: '䷓', upper: 'xun', lower: 'kun', trend: '静观洞察', judgment: '盥而不荐，有孚颙若。', advice: '当前更适合观察全局、复盘规律与树立标杆，看清底层趋势后再做决策。' },
  { number: 21, name: '噬嗑', fullName: '火雷噬嗑', symbol: '䷔', upper: 'li', lower: 'zhen', trend: '决断除障', judgment: '亨。利用狱。', advice: '前路卡着一个必须直面的障碍，拖延无益。以明晰的规则与果断行动咬碎阻力。' },
  { number: 22, name: '贲', fullName: '山火贲', symbol: '䷕', upper: 'gen', lower: 'li', trend: '文饰有度', judgment: '亨。小利有攸往。', advice: '注重审美包装与表达呈现能带来加分，但核心仍须回归实质，切忌华而不实。' },
  { number: 23, name: '剥', fullName: '山地剥', symbol: '䷖', upper: 'gen', lower: 'kun', trend: '顺止厚下', judgment: '不利有攸往，厚下安宅。', advice: '旧结构处于自然剥落期，不宜硬撑或贸然出击。守住核心底盘、保存实力等待转机。' },
  { number: 24, name: '复', fullName: '地雷复', symbol: '䷗', upper: 'kun', lower: 'zhen', trend: '一阳来复', judgment: '亨。出入无疾，朋来无咎。', advice: '低谷已过、新机萌动！像冬至初阳，宜呵护新苗、循序渐进，切勿过早透支。' },
  { number: 25, name: '无妄', fullName: '天雷无妄', symbol: '䷘', upper: 'qian', lower: 'zhen', trend: '诚正自然', judgment: '元亨利贞。其匪正有眚。', advice: '守住本心与常识，不存投机妄念、不走偏门，依正道而行自能减少无谓风险。' },
  { number: 26, name: '大畜', fullName: '山天大畜', symbol: '䷙', upper: 'gen', lower: 'qian', trend: '厚积薄发', judgment: '利贞，不家食吉，利涉大川。', advice: '长期积累的知识与实力已具规模，可多向前辈历史取经，待机而发必有大成。' },
  { number: 27, name: '颐', fullName: '山雷颐', symbol: '䷚', upper: 'gen', lower: 'zhen', trend: '慎言养正', judgment: '贞吉。观颐，自求口实。', advice: '关注身心滋养与信息摄入质量，言语谨慎、生活有节，靠自身本领立身。' },
  { number: 28, name: '大过', fullName: '泽风大过', symbol: '䷛', upper: 'dui', lower: 'xun', trend: '承重应变', judgment: '栋桡，利有攸往，亨。', advice: '压力或负荷偏重，常规做法难以承载。需要非常规的弹性思维与果断减负破局。' },
  { number: 29, name: '坎', fullName: '坎为水', symbol: '䷜', upper: 'kan', lower: 'kan', trend: '习坎履险', judgment: '有孚，维心亨，行有尚。', advice: '面对连环挑战，惊慌最易失足。如流水般保持内在笃定与韧性，终能穿险而出。' },
  { number: 30, name: '离', fullName: '离为火', symbol: '䷝', upper: 'li', lower: 'li', trend: '光明附丽', judgment: '利贞，亨。畜牝牛，吉。', advice: '视野清晰、才华显露，但火需薪柴所依：找准靠谱的平台或长期主线，方能持续发光。' },
  { number: 31, name: '咸', fullName: '泽山咸', symbol: '䷞', upper: 'dui', lower: 'gen', trend: '虚心感应', judgment: '亨，利贞。君子以虚受人。', advice: '重在真诚共鸣与换位感受。放下预设成见、敞开心扉倾听，关系与合作自然升温。' },
  { number: 32, name: '恒', fullName: '雷风恒', symbol: '䷟', upper: 'zhen', lower: 'xun', trend: '恒久立不易方', judgment: '亨，无咎，利贞，利有攸往。', advice: '方向既定便重在长期主义。在微调中坚持核心原则，时间会把复利交到你手上。' },
  { number: 33, name: '遁', fullName: '天山遁', symbol: '䷠', upper: 'qian', lower: 'gen', trend: '明哲退守', judgment: '亨，小利贞。', advice: '“退”不是认输，而是战略性的避开无谓消耗。及时抽身换道，更能保全主动权。' },
  { number: 34, name: '大壮', fullName: '雷天大壮', symbol: '䷡', upper: 'zhen', lower: 'qian', trend: '盛壮守礼', judgment: '利贞。非礼弗履。', advice: '气势强劲、行动力拉满，但切忌仗势硬冲（羝羊触藩）。刚劲配以理性边界方为真壮。' },
  { number: 35, name: '晋', fullName: '火地晋', symbol: '䷢', upper: 'li', lower: 'kun', trend: '日出进升', judgment: '康侯用锡马蕃庶，昼日三接。', advice: '如旭日升于大地，迎来展示成果与上升晋级的契机，宜大方呈现自身价值。' },
  { number: 36, name: '明夷', fullName: '地火明夷', symbol: '䷣', upper: 'kun', lower: 'li', trend: '韬光养晦', judgment: '利艰贞。内文明而外柔顺。', advice: '外部环境尚未完全理解你的光芒，宜内藏智慧、外显平和，保护好心力等待天明。' },
  { number: 37, name: '家人', fullName: '风火家人', symbol: '䷤', upper: 'xun', lower: 'li', trend: '齐家修内', judgment: '言有物而行有恒。', advice: '先把身边最亲近的家庭与核心团队秩序理顺，说话有分寸、做事有章法，内外自安。' },
  { number: 38, name: '睽', fullName: '火泽睽', symbol: '䷥', upper: 'li', lower: 'dui', trend: '求同存异', judgment: '小事吉。君子以同而异。', advice: '视角不同导致意见相左很正常。从小处建立共识、尊重彼此差异，反而能互补成事。' },
  { number: 39, name: '蹇', fullName: '水山蹇', symbol: '䷦', upper: 'kan', lower: 'gen', trend: '见险反身', judgment: '利西南，不利东北；反身修德。', advice: '前方路途崎岖，硬闯徒增损耗。先停下来反躬自省、补齐短板，或寻求高人指点。' },
  { number: 40, name: '解', fullName: '雷水解', symbol: '䷧', upper: 'zhen', lower: 'kan', trend: '春雷舒解', judgment: '利西南，无所往，其来复吉。', advice: '僵局开始松动、难题迎来化解之机！宜抓紧清理遗留事项，轻装回到正轨。' },
  { number: 41, name: '损', fullName: '山泽损', symbol: '䷨', upper: 'gen', lower: 'dui', trend: '损余补虚', judgment: '有孚，元吉，无咎。惩忿窒欲。', advice: '适当做减法、克制多余欲望与情绪，把有限精力聚焦在真正重要的核心目标上。' },
  { number: 42, name: '益', fullName: '风雷益', symbol: '䷩', upper: 'xun', lower: 'zhen', trend: '增益进取', judgment: '利有攸往，利涉大川。见善则迁，有过则改。', advice: '处于正向赋能与成长窗口期，宜大胆学习迭代、主动帮助他人，越利他越受益。' },
  { number: 43, name: '夬', fullName: '泽天夬', symbol: '䷪', upper: 'dui', lower: 'qian', trend: '明决果断', judgment: '扬于王庭，孚号有厉。', advice: '关键决定宜公开透明、干脆利落，同时留有余地、不逞意气之勇。' },
  { number: 44, name: '姤', fullName: '天风姤', symbol: '䷫', upper: 'qian', lower: 'xun', trend: '不期而遇', judgment: '天地相遇，品物咸章也。', advice: '可能迎来意外的相遇、灵感或新变量。保持清醒觉察，防微杜渐，择善而交。' },
  { number: 45, name: '萃', fullName: '泽地萃', symbol: '䷬', upper: 'dui', lower: 'kun', trend: '汇聚凝心', judgment: '亨。利见大人，利贞。', advice: '人气、资源与机会正在聚拢，适合组织聚会、整合项目，同时备好应急预案。' },
  { number: 46, name: '升', fullName: '地风升', symbol: '䷭', upper: 'kun', lower: 'xun', trend: '积小高大', judgment: '元亨，用见大人，勿恤，南征吉。', advice: '如地中生木，步步拔节向上。不必焦虑速度，踏实走好当下每一步自会登高。' },
  { number: 47, name: '困', fullName: '泽水困', symbol: '䷮', upper: 'dui', lower: 'kan', trend: '困而能亨', judgment: '亨，贞，大人吉，无咎。有言不信。', advice: '资源暂时吃紧或解释不被理解时，多说无益。沉住气用扎实行动证明，方能破困。' },
  { number: 48, name: '井', fullName: '水风井', symbol: '䷯', upper: 'kan', lower: 'xun', trend: '常源惠人', judgment: '改邑不改井，无丧无得。', advice: '深挖一口长期可用的专业“深井”，保持内核清澈稳定，持续为外界提供价值。' },
  { number: 49, name: '革', fullName: '泽火革', symbol: '䷰', upper: 'dui', lower: 'li', trend: '革故鼎新', judgment: '巳日乃孚，元亨利贞，悔亡。', advice: '旧模式已到升级节点，时机成熟时宜果断迭代变革，并用真实结果赢得信任。' },
  { number: 50, name: '鼎', fullName: '火风鼎', symbol: '䷱', upper: 'li', lower: 'xun', trend: '稳重立新', judgment: '元吉，亨。正位凝命。', advice: '变革之后进入定型与鼎盛期，宜确立长远制度、整合多方才智，稳健成就大业。' },
  { number: 51, name: '震', fullName: '震为雷', symbol: '䷲', upper: 'zhen', lower: 'zhen', trend: '惊而不乱', judgment: '亨。震来虩虩，笑言哑哑。', advice: '突发变动或惊雷乍响时，先稳住呼吸与反思自身，镇定应对后反而笑迎新局。' },
  { number: 52, name: '艮', fullName: '艮为山', symbol: '䷳', upper: 'gen', lower: 'gen', trend: '当止则止', judgment: '艮其背，不获其身，行其庭，不见其人，无咎。', advice: '学会适时按暂停键，守住边界与内心静定，不被外界喧嚣牵着鼻子走。' },
  { number: 53, name: '渐', fullName: '风山渐', symbol: '䷴', upper: 'xun', lower: 'gen', trend: '循序渐进', judgment: '女归吉，利贞。', advice: '如鸿雁飞翔有序、高山树木渐长，按部就班、脚踏实地是最稳妥也最快的路径。' },
  { number: 54, name: '归妹', fullName: '雷泽归妹', symbol: '䷵', upper: 'zhen', lower: 'dui', trend: '明辨本末', judgment: '永终知敝。', advice: '切忌一时冲动或只看眼前热闹，做决定前先想清长远后果与名分秩序。' },
  { number: 55, name: '丰', fullName: '雷火丰', symbol: '䷶', upper: 'zhen', lower: 'li', trend: '丰盛宜中', judgment: '亨，王假之，勿忧，宜日中。', advice: '局面盛大光彩，正是发挥才能的高光时刻；但日中则昃，越在顶峰越需保持清醒。' },
  { number: 56, name: '旅', fullName: '火山旅', symbol: '䷷', upper: 'li', lower: 'gen', trend: '行旅守谦', judgment: '小亨，旅贞吉。', advice: '身处变化或新环境之中，像旅人一样轻装简行、尊重当地规则、慎言守礼为佳。' },
  { number: 57, name: '巽', fullName: '巽为风', symbol: '䷸', upper: 'xun', lower: 'xun', trend: '柔顺渗透', judgment: '小亨，利有攸往，利见大人。', advice: '与其硬推，不如像春风般耐心沟通、反复申明要点，柔顺渗透反而事半功倍。' },
  { number: 58, name: '兑', fullName: '兑为泽', symbol: '䷹', upper: 'dui', lower: 'dui', trend: '和悦交流', judgment: '亨，利贞。丽泽兑，君子以朋友讲习。', advice: '沟通氛围愉悦，适合团队讨论、知识交流与合作签约，守住诚意原则则皆大欢喜。' },
  { number: 59, name: '涣', fullName: '风水涣', symbol: '䷺', upper: 'xun', lower: 'kan', trend: '破冰疏导', judgment: '亨。利涉大川，利贞。', advice: '如风吹水面、冰消雪融，适合化解积郁、打破僵硬壁垒，以大局观重新凝聚人心。' },
  { number: 60, name: '节', fullName: '水泽节', symbol: '䷻', upper: 'kan', lower: 'dui', trend: '节制有度', judgment: '亨。苦节不可贞。', advice: '建立清晰的时间、财务或精力边界，但自律也须张弛有度，过苦则难以持久。' },
  { number: 61, name: '中孚', fullName: '风泽中孚', symbol: '䷼', upper: 'xun', lower: 'dui', trend: '诚信感通', judgment: '豚鱼吉，利涉大川，利贞。', advice: '内心笃实诚信、言行一致，最具穿透力与说服力，以诚待人自可跨越阻碍。' },
  { number: 62, name: '小过', fullName: '雷山小过', symbol: '䷽', upper: 'zhen', lower: 'gen', trend: '谨慎小步', judgment: '亨，利贞。可小事，不可大事。', advice: '适合处理具体细务与小步试错，姿态宜低不宜高（飞鸟遗之音，不宜上宜下）。' },
  { number: 63, name: '既济', fullName: '水火既济', symbol: '䷾', upper: 'kan', lower: 'li', trend: '既成防微', judgment: '亨小，利贞。初吉终乱。', advice: '目标已基本达成、水火调和，最忌松懈大意。做好收尾维护与居安思危方能保成果。' },
  { number: 64, name: '未济', fullName: '火水未济', symbol: '䷿', upper: 'li', lower: 'kan', trend: '未竟新章', judgment: '亨。小狐汔济，濡其尾，无攸利。', advice: '事情临近完成却尚未彻底收官，恰也蕴含无限新可能。最后一里路更须沉稳细致。' },
];

export function findHexagram(
  upper: TrigramId,
  lower: TrigramId
): HexagramInfo {
  return (
    HEXAGRAMS.find((h) => h.upper === upper && h.lower === lower) ??
    HEXAGRAMS[0]
  );
}
