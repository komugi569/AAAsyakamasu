import { StageInfo } from '../types/game';

export const STAGES: StageInfo[] = [
  {
    id: "stage-all",
    title: "全分野制覇・魔導卿決戦",
    subtitle: "地理・日本史・公民の総合知識バトル",
    genre: "ALL",
    badgeColor: "bg-purple-900/80 text-purple-300 border-purple-500/50",
    bossName: "忘却の魔導卿",
    bossTitle: "知識の深淵を統べる魔王",
    bossHp: 1200,
    totalFloors: 3,
    description: "地理・日本史・公民の3分野を駆使して挑む全3階層の本番実戦ダンジョン！敵の結界と猛攻を突破せよ！"
  },
  {
    id: "stage-endless",
    title: "無限の知識塔（エンドレス）",
    subtitle: "力尽きるまで登り続ける限界突破サバイバル！",
    genre: "ALL",
    badgeColor: "bg-gradient-to-r from-red-600 to-amber-600 text-amber-100 border-amber-400/80 font-black",
    bossName: "階門の守護神たち",
    bossTitle: "5階ごとに超強力な門番ボスが立ちはだかる！",
    bossHp: 1000,
    totalFloors: 999,
    isEndless: true,
    description: "階層が上がるごとに敵HPと攻撃力が激増する無限サバイバル！5Fごとに『インフレ・ドラゴン』『鎖国の巨兵』などの強敵が出現！"
  },
  {
    id: "stage-geo",
    title: "地理特訓：大地の息吹と気候",
    subtitle: "フォッサマグナ・気候区分・排他的経済水域",
    genre: "地理",
    badgeColor: "bg-emerald-900/80 text-emerald-300 border-emerald-500/50",
    bossName: "荒天の地霊将",
    bossTitle: "大地と風の支配者",
    bossHp: 960,
    totalFloors: 3,
    description: "地理分野のみが集中的に出題！地形・気候・環境・産業の頻出要点を連続正答で攻略せよ。"
  },
  {
    id: "stage-japan-all",
    title: "地理特化：日本列島縦断回廊",
    subtitle: "47都道府県・地方別特色・農水産業・工業地帯",
    genre: "地理",
    badgeColor: "bg-teal-900/80 text-teal-300 border-teal-500/50",
    bossName: "八州の統攬王",
    bossTitle: "列島の地形と産業を束ねる巨神",
    bossHp: 1080,
    totalFloors: 3,
    description: "北海道から九州・沖縄まで、地方別の特産品・統計データ・県庁所在地・工業地帯の難問に挑む！"
  },
  {
    id: "stage-nihon",
    title: "日本史特訓：群雄割拠と維新",
    subtitle: "古代律令・本能寺の変・明治維新",
    genre: "日本史",
    badgeColor: "bg-rose-900/80 text-rose-300 border-rose-500/50",
    bossName: "戦乱の覇王影",
    bossTitle: "歴史の狭間を彷徨う武将",
    bossHp: 960,
    totalFloors: 3,
    description: "旧石器から戦国・幕末・現代まで。日本の歴史の転換点を網羅した高難度実戦特訓！"
  },
  {
    id: "stage-modern",
    title: "日本史特化：激動の近現代",
    subtitle: "明治の開国・大正デモクラシー・昭和戦後・平成令和",
    genre: "日本史",
    badgeColor: "bg-pink-900/80 text-pink-300 border-pink-500/50",
    bossName: "百年の時輪神",
    bossTitle: "近現代の激動を刻むクロノス",
    bossHp: 1080,
    totalFloors: 3,
    description: "幕末の開国から不平等条約改正、大戦、高度経済成長、そして令和の最新時事問題まで集中的に突破！"
  },
  {
    id: "stage-koumin",
    title: "公民特訓：法の理と現代社会",
    subtitle: "憲法・三権分立・市場経済・国際社会",
    genre: "公民",
    badgeColor: "bg-amber-900/80 text-amber-300 border-amber-500/50",
    bossName: "歪曲の法皇",
    bossTitle: "悪法を司る審判者",
    bossHp: 960,
    totalFloors: 3,
    description: "憲法・政治機構・経済・国際課題の頻出重要テーマを徹底攻略！"
  },
  {
    id: "stage-economy",
    title: "公民特化：市場経済と国際連帯",
    subtitle: "日本銀行・財政と税・為替相場・国際連合・SDGs",
    genre: "公民",
    badgeColor: "bg-yellow-900/80 text-yellow-300 border-yellow-500/50",
    bossName: "財貨の金牛神",
    bossTitle: "世界市場と国際法を牛耳る魔神",
    bossHp: 1080,
    totalFloors: 3,
    description: "金融政策、累進課税、GDP、円高円安、国連安保理、地球温暖化対策など差がつく経済・国際分野の集中試練！"
  }
];
