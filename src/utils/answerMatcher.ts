import { QuizQuestion, ShuffledQuizQuestion, QuizFormatMode } from '../types/game';

/**
 * Social Studies (地理・日本史・公民) Synonym & Alias Equivalence Groups.
 * If a question's canonical answer matches ANY term in a group (after normalization),
 * ALL terms in that group (and their normalized structural variations) are accepted as correct!
 */
export const SOCIAL_STUDIES_SYNONYM_GROUPS: string[][] = [
  // --- ユーザー指定代表例 & 最重要項目 ---
  [
    "二十一か条の要求",
    "二十一ヵ条の要求",
    "二十一ヶ条の要求",
    "二十一箇条の要求",
    "対華二十一か条の要求",
    "対華二十一ヵ条の要求",
    "対華二十一ヶ条の要求",
    "対華二十一箇条の要求",
    "対華二十一箇条",
    "対華二十一か条",
    "対華二十一ヵ条",
    "対華二十一ヶ条",
    "二十一か条要求",
    "二十一箇条要求",
    "対華二十一か条要求",
    "対華二十一箇条要求",
    "21か条の要求",
    "21ヵ条の要求",
    "21ヶ条の要求",
    "21箇条の要求",
    "対華21か条の要求",
    "対華21箇条",
    "対華21ヶ条",
    "対華21か条"
  ],
  [
    "間接民主制",
    "代議制",
    "議会制民主主義",
    "間接民主主義",
    "代議制民主主義",
    "議会制民主制",
    "代表民主制"
  ],
  [
    "直接民主制",
    "直接民主主義"
  ],
  [
    "聖徳太子",
    "厩戸皇子",
    "厩戸王子",
    "厩戸王",
    "うまやどのおうじ",
    "うまやどの皇子",
    "うまやどの王子"
  ],
  [
    "関ヶ原の戦い",
    "関ケ原の戦い",
    "関が原の戦い",
    "関か原の戦い",
    "関ヶ原の合戦",
    "関ケ原の合戦",
    "関が原の合戦",
    "関ヶ原合戦",
    "関ケ原合戦",
    "関ヶ原"
  ],
  [
    "長篠の戦い",
    "長篠の合戦",
    "長篠合戦",
    "長篠・設楽原の戦い",
    "長篠設楽原の戦い",
    "長篠・設楽原の合戦",
    "長篠設楽原の合戦",
    "設楽原の戦い",
    "設楽原の合戦",
    "長篠設楽原",
    "長篠・設楽原",
    "設楽原",
    "長篠"
  ],
  [
    "桶狭間の戦い",
    "桶狭間の合戦",
    "桶狭間合戦",
    "桶狭間"
  ],
  [
    "下関条約",
    "馬関条約",
    "日清講和条約"
  ],
  [
    "全国統一",
    "天下統一"
  ],
  [
    "しまなみ海道",
    "瀬戸内しまなみ海道",
    "西瀬戸自動車道",
    "尾道・今治ルート"
  ],
  [
    "瀬戸大橋",
    "瀬戸中央自動車道",
    "児島・坂出ルート"
  ],
  [
    "明石海峡大橋",
    "神戸淡路鳴門自動車道",
    "神戸・鳴門ルート"
  ],
  [
    "リアス海岸",
    "リアス式海岸"
  ],
  // --- 人口・増減・価格変化などの動詞・状態表現 ---
  [
    "減り続けていく",
    "減り続ける",
    "減り続けている",
    "減っていく",
    "減っている",
    "減少する",
    "減少していく",
    "減少している",
    "減少し続ける",
    "減少し続けていく",
    "減る",
    "減少",
    "人口減少",
    "減少傾向",
    "少なくなる",
    "少なくなっていく",
    "低下する"
  ],
  [
    "増加している",
    "増加する",
    "増加していく",
    "増加し続ける",
    "増え続けている",
    "増え続ける",
    "増えていく",
    "増えている",
    "増える",
    "増加",
    "増加傾向",
    "多くなる",
    "多くなっている",
    "人手不足などを背景に増え続けている"
  ],
  [
    "上がる",
    "上昇する",
    "上昇",
    "価格が上がる",
    "価格が上昇する",
    "値上がりする",
    "値上がり",
    "高くなる",
    "騰貴する"
  ],
  [
    "下がる",
    "下落する",
    "下落",
    "低下する",
    "低下",
    "価格が下がる",
    "価格が下落する",
    "値下がりする",
    "値下がり",
    "安くなる"
  ],
  // --- 潮目・潮境、中東・アラビア、工業地帯・工業地域 ---
  [
    "潮目",
    "潮境",
    "しおめ",
    "しおざかい"
  ],
  [
    "中東",
    "西アジア",
    "中東地域",
    "西アジア地域",
    "中東（西アジア）地域",
    "アラビア",
    "アラビア地域",
    "アラビア半島",
    "アラブ",
    "アラブ地域",
    "アラブ諸国",
    "中近東",
    "ペルシャ湾",
    "ペルシャ湾岸",
    "ペルシャ湾岸地域",
    "サウジアラビア"
  ],
  [
    "北九州工業地帯",
    "北九州工業地域",
    "北九州"
  ],
  [
    "中京工業地帯",
    "中京工業地域",
    "中京"
  ],
  [
    "京浜工業地帯",
    "京浜工業地域",
    "京浜"
  ],
  [
    "阪神工業地帯",
    "阪神工業地域",
    "阪神"
  ],
  [
    "瀬戸内工業地域",
    "瀬戸内工業地帯",
    "瀬戸内"
  ],
  [
    "東海工業地域",
    "東海工業地帯",
    "東海"
  ],
  [
    "関東内陸工業地域",
    "関東内陸工業地帯",
    "関東内陸",
    "北関東工業地域"
  ],
  [
    "鹿島臨海工業地域",
    "鹿島臨海工業地帯",
    "鹿島臨海",
    "鹿島"
  ],
  [
    "京葉工業地域",
    "京葉工業地帯",
    "京葉"
  ],

  // --- 日本史（古代〜近世） ---
  [
    "中大兄皇子",
    "中大兄王子",
    "天智天皇",
    "なかのおおえのおうじ"
  ],
  [
    "大海人皇子",
    "大海人王子",
    "天武天皇",
    "おおあまのおうじ"
  ],
  [
    "中臣鎌足",
    "藤原鎌足"
  ],
  [
    "大仙陵古墳",
    "大仙古墳",
    "仁徳天皇陵",
    "仁徳天皇陵古墳",
    "大山古墳",
    "大仙陵古墳（仁徳天皇陵）"
  ],
  [
    "誉田御廟山古墳",
    "応神天皇陵",
    "誉田御廟山古墳（応神天皇陵）"
  ],
  [
    "好太王の碑",
    "好太王碑",
    "広開土王の碑",
    "広開土王碑",
    "好太王（広開土王）の碑"
  ],
  [
    "大和政権",
    "ヤマト政権",
    "大和王権",
    "ヤマト王権",
    "大和朝廷",
    "ヤマト朝廷"
  ],
  [
    "十七条の憲法",
    "17条の憲法",
    "十七条憲法",
    "17条憲法",
    "憲法十七条",
    "十七条の憲法の制定"
  ],
  [
    "大化の改新",
    "乙巳の変",
    "乙巳の変（蘇我氏を倒す）"
  ],
  [
    "白村江の戦い",
    "白村江の合戦",
    "白村江の戦",
    "白村江"
  ],
  [
    "壬申の乱",
    "壬申の変"
  ],
  [
    "班田収授法",
    "班田収授の法"
  ],
  [
    "墾田永年私財法",
    "墾田永年私財の法",
    "墾田永年私財法の制定"
  ],
  [
    "大宝律令",
    "大宝律令の制定"
  ],
  [
    "空海",
    "弘法大師"
  ],
  [
    "最澄",
    "伝教大師"
  ],
  [
    "薬子の変",
    "平城太上天皇の変"
  ],
  [
    "藤原道長",
    "御堂関白"
  ],
  [
    "上皇",
    "太上天皇",
    "院"
  ],
  [
    "前九年・後三年の役",
    "前九年の役・後三年の役",
    "前九年の役",
    "後三年の役",
    "前九年合戦・後三年合戦"
  ],
  [
    "源義仲",
    "木曽義仲",
    "木曾義仲",
    "源（木曽）義仲"
  ],
  [
    "大輪田泊",
    "大輪田の泊",
    "大輪田ノ泊",
    "兵庫津"
  ],
  [
    "壇ノ浦の戦い",
    "壇の浦の戦い",
    "壇ノ浦の合戦",
    "壇の浦の合戦",
    "壇ノ浦合戦",
    "壇の浦合戦",
    "壇ノ浦"
  ],
  [
    "承久の乱",
    "承久の変"
  ],
  [
    "御成敗式目",
    "貞永式目",
    "御成敗式目の制定"
  ],
  [
    "元寇",
    "蒙古襲来"
  ],
  [
    "てつはう",
    "てつほう",
    "鉄砲"
  ],
  [
    "徳政令",
    "徳政令の発表",
    "永仁の徳政令"
  ],
  [
    "建武の新政",
    "建武の中興"
  ],
  [
    "南北朝の合一",
    "南北朝合一",
    "南北朝の統一",
    "南北朝統一"
  ],
  [
    "金閣",
    "鹿苑寺",
    "鹿苑寺金閣",
    "金閣寺",
    "金閣（鹿苑寺）"
  ],
  [
    "銀閣",
    "慈照寺",
    "慈照寺銀閣",
    "銀閣寺",
    "銀閣（慈照寺）"
  ],
  [
    "勘合貿易",
    "日明貿易"
  ],
  [
    "応仁の乱",
    "応仁・文明の乱"
  ],
  [
    "山城の国一揆",
    "山城国一揆"
  ],
  [
    "加賀の一向一揆",
    "加賀一向一揆"
  ],
  [
    "正長の土一揆",
    "正長の徳政一揆"
  ],
  [
    "問（問丸）",
    "問",
    "問丸"
  ],
  [
    "寝殿造",
    "寝殿造り"
  ],
  [
    "書院造",
    "書院造り"
  ],
  [
    "校倉造",
    "校倉造り"
  ],
  [
    "合掌造",
    "合掌造り"
  ],
  [
    "本能寺の変",
    "本能寺の乱"
  ],
  [
    "山崎の戦い",
    "山崎の合戦",
    "天王山の戦い"
  ],
  [
    "バテレン追放令",
    "伴天連追放令",
    "宣教師追放令",
    "バテレン（宣教師）追放令"
  ],
  [
    "太閤検地",
    "豊臣秀吉の検地"
  ],
  [
    "朝鮮出兵",
    "文禄・慶長の役"
  ],
  [
    "姫路城",
    "白鷺城",
    "姫路城（天守）"
  ],
  [
    "島原・天草一揆",
    "島原の乱",
    "島原・天草の乱",
    "島原天草一揆"
  ],
  [
    "鎖国",
    "海禁政策"
  ],
  [
    "生類憐みの令",
    "生類憐れみの令"
  ],
  [
    "打ちこわし",
    "うちこわし",
    "打毀し"
  ],
  [
    "大塩平八郎の乱",
    "大塩の乱"
  ],
  [
    "日米和親条約",
    "神奈川条約"
  ],
  [
    "日米修好通商条約",
    "安政の五か国条約",
    "安政の五カ国条約"
  ],

  // --- 日本史（近現代） ---
  [
    "五箇条の御誓文",
    "五か条の御誓文",
    "五ヶ条の御誓文",
    "五ヵ条の御誓文",
    "5箇条の御誓文",
    "5か条の御誓文",
    "5ヶ条の御誓文",
    "5ヵ条の御誓文"
  ],
  [
    "解放令",
    "賤民廃止令"
  ],
  [
    "西南戦争",
    "西南の役"
  ],
  [
    "大日本帝国憲法",
    "明治憲法",
    "大日本帝国憲法（明治憲法・天皇主権・欽定憲法）"
  ],
  [
    "甲午農民戦争",
    "東学党の乱",
    "東学の乱",
    "甲午農民戦争（東学信徒と農民が起こした反乱で日清衝突の契機）"
  ],
  [
    "三国干渉",
    "3国干渉"
  ],
  [
    "ポーツマス条約",
    "日露講和条約"
  ],
  [
    "日比谷焼打事件",
    "日比谷焼き討ち事件",
    "日比谷焼討事件"
  ],
  [
    "ベルサイユ条約",
    "ヴェルサイユ条約"
  ],
  [
    "平塚らいてう",
    "平塚らいちょう",
    "平塚明"
  ],
  [
    "世界恐慌",
    "大恐慌"
  ],
  [
    "満州事変",
    "満洲事変"
  ],
  [
    "満州国",
    "満洲国"
  ],
  [
    "五・一五事件",
    "5・15事件",
    "5.15事件",
    "五一五事件",
    "515事件"
  ],
  [
    "二・二六事件",
    "2・26事件",
    "2.26事件",
    "二二六事件",
    "226事件"
  ],
  [
    "日中戦争",
    "日華事変",
    "支那事変"
  ],
  [
    "太平洋戦争",
    "大東亜戦争",
    "アジア・太平洋戦争"
  ],
  [
    "パールハーバー",
    "真珠湾",
    "真珠湾攻撃"
  ],
  [
    "極東国際軍事裁判",
    "東京裁判"
  ],
  [
    "ファシズム",
    "全体主義",
    "ファシズム（全体主義）"
  ],
  [
    "GHQ",
    "連合国軍最高司令官総司令部",
    "連合国軍総司令部"
  ],
  [
    "サンフランシスコ平和条約",
    "サンフランシスコ講和条約",
    "対日平和条約",
    "対日講和条約",
    "サンフランシスコ平和条約の締結"
  ],
  [
    "日米安全保障条約",
    "日米安保条約",
    "安保条約"
  ],
  [
    "国際連合",
    "国連",
    "国際連合（UN）",
    "国際連合（国連）への加盟",
    "国際連合への加盟",
    "国連への加盟",
    "国連加盟"
  ],
  [
    "オイルショック",
    "石油危機",
    "第一次石油危機",
    "第1次石油危機"
  ],
  [
    "四日市ぜんそく",
    "四日市喘息"
  ],
  [
    "金の卵",
    "集団就職"
  ],
  [
    "環境庁",
    "環境省"
  ],
  [
    "ベルリンの壁",
    "ベルリンの壁崩壊",
    "ベルリンの壁の崩壊"
  ],
  [
    "ソビエト連邦",
    "ソ連",
    "ソビエト社会主義共和国連邦",
    "USSR"
  ],
  [
    "バブル経済の崩壊",
    "バブル崩壊",
    "バブル経済崩壊"
  ],
  [
    "阪神・淡路大震災",
    "阪神淡路大震災"
  ],
  [
    "福島第一原子力発電所",
    "福島第一原発",
    "福島原発"
  ],
  [
    "新型コロナウイルス感染症",
    "新型コロナウイルス",
    "新型コロナ",
    "コロナ",
    "COVID-19"
  ],
  [
    "東京オリンピック・パラリンピック",
    "東京オリンピック",
    "東京五輪"
  ],

  // --- 公民（政治・経済・国際） ---
  [
    "基本的人権",
    "人権",
    "基本的人権の尊重"
  ],
  [
    "個人の尊重",
    "個人尊重"
  ],
  [
    "多数決の原理",
    "多数決"
  ],
  [
    "法の支配",
    "法による支配"
  ],
  [
    "マグナ・カルタ",
    "マグナカルタ",
    "大憲章"
  ],
  [
    "夜警国家",
    "小さな政府"
  ],
  [
    "福祉国家",
    "大きな政府"
  ],
  [
    "ワイマール憲法",
    "ヴァイマル憲法",
    "ワイマル憲法"
  ],
  [
    "政教分離の原則",
    "政教分離",
    "政教分離原則"
  ],
  [
    "不法逮捕の禁止",
    "令状主義"
  ],
  [
    "一事不再理",
    "二重処罰の禁止"
  ],
  [
    "アイヌ民族",
    "アイヌ"
  ],
  [
    "部落差別",
    "同和問題"
  ],
  [
    "選択的夫婦別姓制度",
    "選択的夫婦別姓",
    "夫婦別姓"
  ],
  [
    "プライバシーの権利",
    "プライバシー権",
    "プライバシー"
  ],
  [
    "幸福追求",
    "幸福追求権",
    "幸福追求の権利"
  ],
  [
    "環境アセスメント",
    "環境影響評価",
    "環境アセスメント制度"
  ],
  [
    "インフォームド・コンセント",
    "インフォームドコンセント",
    "説明と同意"
  ],
  [
    "労働三権",
    "労働3権",
    "労働基本権"
  ],
  [
    "労働三法",
    "労働3法",
    "労働基本法"
  ],
  [
    "労働基準法",
    "労基法",
    "労働基準法の制定"
  ],
  [
    "常会",
    "通常国会",
    "常会（通常国会）"
  ],
  [
    "臨時会",
    "臨時国会",
    "臨時会（臨時国会）"
  ],
  [
    "特別会",
    "特別国会",
    "特別会（特別国会）"
  ],
  [
    "二院制",
    "2院制",
    "両院制"
  ],
  [
    "議院内閣制",
    "議院内閣制度"
  ],
  [
    "違憲立法審査権",
    "違憲審査権",
    "違憲法令審査権"
  ],
  [
    "三審制",
    "3審制",
    "三審制度",
    "3審制度"
  ],
  [
    "裁判員制度",
    "裁判員制"
  ],
  [
    "三権分立",
    "3権分立",
    "権力分立"
  ],
  [
    "地方公共団体",
    "地方自治体",
    "自治体"
  ],
  [
    "首長",
    "地方自治体の長",
    "自治体の長"
  ],
  [
    "解職請求",
    "解職請求権",
    "リコール",
    "解職請求権（リコール）"
  ],
  [
    "マニフェスト",
    "政権公約",
    "公約"
  ],
  [
    "圧力団体",
    "利益団体"
  ],
  [
    "インフレーション",
    "インフレ"
  ],
  [
    "デフレーション",
    "デフレ"
  ],
  [
    "電子商取引",
    "Eコマース",
    "EC",
    "ネット通販",
    "ネットショッピング"
  ],
  [
    "POSシステム",
    "POS",
    "ポスシステム",
    "ポス"
  ],
  [
    "ベンチャー企業",
    "スタートアップ",
    "スタートアップ企業"
  ],
  [
    "利潤",
    "利益",
    "もうけ"
  ],
  [
    "イノベーション",
    "技術革新"
  ],
  [
    "アウトソーシング",
    "外部委託",
    "業務委託"
  ],
  [
    "グローバル化",
    "グローバリゼーション",
    "国際化"
  ],
  [
    "情報化社会",
    "情報社会",
    "高度情報化社会"
  ],
  [
    "リテラシー",
    "情報リテラシー",
    "メディアリテラシー"
  ],
  [
    "デジタル・ディバイド",
    "デジタルディバイド",
    "情報格差"
  ],
  [
    "持続可能な社会",
    "循環型社会",
    "サステナブルな社会"
  ],
  [
    "ダイバーシティ",
    "多様性"
  ],
  [
    "多文化共生社会",
    "多文化共生"
  ],
  [
    "3R",
    "スリーアール",
    "3アール"
  ],
  [
    "買いオペレーション",
    "買いオペ",
    "買いオペレーション（買いオペ）"
  ],
  [
    "売りオペレーション",
    "売りオペ",
    "売りオペレーション（売りオペ）"
  ],
  [
    "日本銀行",
    "日銀"
  ],
  [
    "公債金",
    "国債",
    "公債",
    "公債金（国債・借金）"
  ],
  [
    "独占禁止法",
    "独禁法"
  ],
  [
    "製造物責任法",
    "PL法",
    "製造物責任法（PL法）",
    "製造物責任法（PL法）の制定",
    "製造物責任法の制定",
    "PL法の制定"
  ],
  [
    "コンプライアンス",
    "法令遵守",
    "コンプライアンス（法令遵守）",
    "コンプライアンス（法令遵守）の徹底",
    "コンプライアンスの徹底"
  ],
  [
    "CSR",
    "企業の社会的責任",
    "CSR（企業の社会的責任）"
  ],
  [
    "少子高齢化",
    "少子高齢社会",
    "少子高齢化社会"
  ],
  [
    "超高齢社会",
    "超高齢化社会"
  ],
  [
    "単独世帯",
    "一人暮らし",
    "1人暮らし",
    "単身世帯",
    "単独世帯（一人暮らし）"
  ],
  [
    "満18歳以上",
    "18歳以上",
    "18歳"
  ],
  [
    "思いやり予算",
    "在日米軍駐留経費負担",
    "思いやり予算（在日米軍駐留経費負担）"
  ],
  [
    "非核三原則",
    "非核3原則"
  ],
  [
    "核拡散防止条約",
    "NPT"
  ],
  [
    "核兵器禁止条約",
    "TPNW"
  ],
  [
    "包括的核実験禁止条約",
    "包括的核実験禁止条約の採択",
    "CTBT"
  ],
  [
    "内政不干渉の原則",
    "内政不干渉"
  ],
  [
    "民族自決の原則",
    "民族自決"
  ],
  [
    "為替相場",
    "外国為替相場",
    "為替レート"
  ],
  [
    "円安・ドル高",
    "円安",
    "ドル高"
  ],
  [
    "円高・ドル安",
    "円高",
    "ドル安"
  ],
  [
    "自由貿易協定 / 経済連携協定",
    "FTA / EPA",
    "FTA・EPA",
    "FTA",
    "EPA",
    "自由貿易協定",
    "経済連携協定"
  ],
  [
    "アパルトヘイト",
    "人種隔離政策",
    "人種隔離"
  ],
  [
    "二酸化炭素",
    "CO2"
  ],
  [
    "HDI",
    "人間開発指数",
    "HDI（人間開発指数）"
  ],
  [
    "UNESCO",
    "ユネスコ",
    "国連教育科学文化機関",
    "UNESCO（国連教育科学文化機関：ユネスコ）"
  ],
  [
    "UNICEF",
    "ユニセフ",
    "国連児童基金"
  ],
  [
    "UNHCR",
    "国連難民高等弁務官事務所"
  ],
  [
    "WHO",
    "世界保健機関"
  ],
  [
    "ILO",
    "国際労働機関"
  ],
  [
    "IMF",
    "国際通貨基金"
  ],
  [
    "WTO",
    "世界貿易機関",
    "WTO（世界貿易機関）"
  ],
  [
    "NGO",
    "非政府組織"
  ],
  [
    "NPO",
    "非営利組織",
    "民間非営利組織"
  ],
  [
    "ODA",
    "政府開発援助",
    "ODA（政府開発援助）"
  ],
  [
    "PKO",
    "国連平和維持活動",
    "平和維持活動"
  ],
  [
    "EU",
    "ヨーロッパ連合",
    "欧州連合",
    "EU（ヨーロッパ連合）"
  ],
  [
    "ASEAN",
    "東南アジア諸国連合"
  ],
  [
    "APEC",
    "アジア太平洋経済協力",
    "アジア太平洋経済協力会議"
  ],
  [
    "SDGs",
    "持続可能な開発目標"
  ],
  [
    "リサイクル",
    "再生利用",
    "リサイクル（再生利用）"
  ],
  [
    "リユース",
    "再使用",
    "再利用",
    "リユース（再使用）"
  ],
  [
    "リデュース",
    "ゴミ削減",
    "発生抑制",
    "リデュース（ゴミを減らす）"
  ],
  [
    "第三次産業",
    "第3次産業",
    "第三次産業（商業・サービス業など）"
  ],
  [
    "第二次産業",
    "第2次産業"
  ],
  [
    "第一次産業",
    "第1次産業"
  ],

  // --- 地理（日本・世界） ---
  [
    "アメリカ合衆国",
    "アメリカ",
    "米国",
    "USA"
  ],
  [
    "三角州",
    "デルタ"
  ],
  [
    "短くて流れが急である",
    "短く流れが急",
    "短くて急",
    "流れが急",
    "急流"
  ],
  [
    "黒潮",
    "日本海流",
    "黒潮（日本海流）"
  ],
  [
    "親潮",
    "千島海流",
    "親潮（千島海流）"
  ],
  [
    "からっ風",
    "空っ風",
    "赤城おろし"
  ],
  [
    "関東ローム",
    "関東ローム層"
  ],
  [
    "シラス台地",
    "しらす台地",
    "シラス"
  ],
  [
    "冷帯",
    "亜寒帯"
  ],
  [
    "ツンドラ気候",
    "ツンドラ"
  ],
  [
    "ステップ気候",
    "ステップ"
  ],
  [
    "サバナ気候",
    "サバンナ気候",
    "サバナ",
    "サバンナ"
  ],
  [
    "北海道の気候",
    "北海道気候",
    "北海道"
  ],
  [
    "日本海側の気候",
    "日本海側気候",
    "日本海側"
  ],
  [
    "瀬戸内の気候",
    "瀬戸内気候",
    "瀬戸内式気候",
    "瀬戸内"
  ],
  [
    "中央高地の気候",
    "中央高地気候",
    "中央高地式気候",
    "中央高地",
    "内陸性の気候"
  ],
  [
    "太平洋側の気候",
    "太平洋側気候",
    "太平洋側"
  ],
  [
    "南西諸島の気候",
    "南西諸島気候",
    "南西諸島"
  ],
  [
    "促成栽培",
    "早作り"
  ],
  [
    "抑制栽培",
    "遅作り"
  ],
  [
    "近郊農業",
    "都市近郊農業"
  ],
  [
    "地中海式農業",
    "地中海型農業"
  ],
  [
    "焼畑農業",
    "焼き畑農業",
    "焼畑"
  ],
  [
    "プランテーション",
    "プランテーション農業",
    "大農園"
  ],
  [
    "モノカルチャー経済",
    "モノカルチャー"
  ],
  [
    "減反政策",
    "減反",
    "生産調整",
    "米の生産調整"
  ],
  [
    "栽培漁業",
    "つくる漁業",
    "育てる漁業"
  ],
  [
    "真珠やカキなどの養殖業",
    "養殖業",
    "養殖",
    "真珠やカキの養殖",
    "カキや真珠の養殖"
  ],
  [
    "四大工業地帯",
    "4大工業地帯"
  ],
  [
    "太平洋ベルト",
    "太平洋ベルト地帯"
  ],
  [
    "コンビナート",
    "石油化学コンビナート"
  ],
  [
    "眼鏡のフレーム",
    "眼鏡フレーム",
    "メガネフレーム",
    "めがねのフレーム",
    "めがねフレーム",
    "眼鏡",
    "メガネ",
    "めがね"
  ],
  [
    "将棋の駒",
    "将棋駒",
    "将棋"
  ],
  [
    "精密機械工業",
    "精密機械"
  ],
  [
    "機械工業",
    "機械",
    "輸送用機械",
    "自動車などの輸送用機器"
  ],
  [
    "印刷業",
    "印刷",
    "出版・印刷"
  ],
  [
    "自動車（トラック・乗用車・バス）",
    "自動車",
    "トラック",
    "車"
  ],
  [
    "船",
    "船舶",
    "貨物船",
    "海上輸送"
  ],
  [
    "航空機",
    "飛行機",
    "空輸",
    "航空輸送"
  ],
  [
    "成田国際空港",
    "成田空港",
    "新東京国際空港"
  ],
  [
    "関西国際空港",
    "関西空港",
    "関空"
  ],
  [
    "東京湾アクアライン",
    "アクアライン"
  ],
  [
    "リニア中央新幹線",
    "リニア新幹線",
    "リニアモーターカー",
    "リニア"
  ],
  [
    "ハブ空港",
    "拠点空港",
    "ハブ"
  ],
  [
    "過疎",
    "過疎化"
  ],
  [
    "過密",
    "過密化"
  ],
  [
    "ドーナツ化現象",
    "ドーナツ化"
  ],
  [
    "ベッドタウン",
    "衛星都市",
    "住宅都市"
  ],
  [
    "スプロール現象",
    "スプロール化"
  ],
  [
    "ヒートアイランド現象",
    "ヒートアイランド"
  ],
  [
    "メタンハイドレート",
    "燃える氷"
  ],
  [
    "再生可能エネルギー",
    "自然エネルギー",
    "再生可能エネルギー（水力含む）"
  ],
  [
    "GPS",
    "全地球測位システム"
  ],
  [
    "GIS",
    "地理情報システム"
  ],
  [
    "メルカトル図法",
    "正角図法"
  ],
  [
    "モルワイデ図法",
    "正積図法"
  ],
  [
    "本初子午線",
    "経度0度",
    "グリニッジ子午線"
  ],
  [
    "日付変更線",
    "国際日付変更線"
  ],
  [
    "排他的経済水域",
    "EEZ"
  ],
  [
    "1,000m",
    "1000m",
    "1km",
    "1000メートル",
    "1キロメートル",
    "1キロ"
  ],
  [
    "500m",
    "500メートル",
    "0.5km"
  ],
  [
    "2cm",
    "2センチ",
    "2センチメートル"
  ],
  [
    "約4分の3",
    "4分の3",
    "75%",
    "約75%",
    "3/4",
    "約4分の3（75%）"
  ],
  [
    "約5割強",
    "約5割",
    "5割",
    "半分以上",
    "50%以上",
    "約5割強（半分以上）"
  ]
];

export interface AlphabetChoiceInfo {
  isAlphabetQuestion: boolean;
  correctLetter: string; // 'A' | 'B' | 'C' | 'D'
  availableLetters: string[];
  choicesMap: Record<string, string>;
  correctTerm: string;
}

/**
 * Detects whether a question contains 【A: ..., B: ..., C: ...】 choices in its prompt,
 * and determines the exact alphabet letter (A / B / C / D) corresponding to the canonical answer.
 */
export function extractAlphabetChoiceInfo(
  question: Pick<QuizQuestion, 'question'> & {
    correctAnswer?: string;
    options?: string[];
    answerIndex?: number;
  }
): AlphabetChoiceInfo {
  const canonical =
    question.correctAnswer ??
    (question.options && typeof question.answerIndex === 'number'
      ? question.options[question.answerIndex]
      : '');

  const emptyResult: AlphabetChoiceInfo = {
    isAlphabetQuestion: false,
    correctLetter: '',
    availableLetters: [],
    choicesMap: {},
    correctTerm: canonical
  };

  if (!question.question || !canonical) return emptyResult;

  const bracketMatch = question.question.match(/【(\s*[A-DＡ-Ｄ][:：][^】]+)】/);
  if (!bracketMatch) return emptyResult;

  const inside = bracketMatch[1];
  const parts = inside.split(/,\s*(?=[A-DＡ-Ｄ][:：])/);
  const choicesMap: Record<string, string> = {};
  const availableLetters: string[] = [];
  let foundLetter = '';

  const cleanAns = canonical.replace(/[（(][^）)]*[）)]/g, '').trim();

  for (const p of parts) {
    const m = p.trim().match(/^([A-DＡ-Ｄ])[:：]\s*(.+)$/);
    if (m) {
      const letter = m[1].normalize('NFKC').toUpperCase();
      const label = m[2].trim();
      choicesMap[letter] = label;
      availableLetters.push(letter);

      const cleanLabel = label.replace(/[（(][^）)]*[）)]/g, '').trim();
      if (
        label === canonical ||
        cleanLabel === cleanAns ||
        (cleanAns.length >= 2 && (label.includes(cleanAns) || cleanAns.includes(cleanLabel)))
      ) {
        foundLetter = letter;
      }
    }
  }

  if (!foundLetter || availableLetters.length === 0) {
    return emptyResult;
  }

  return {
    isAlphabetQuestion: true,
    correctLetter: foundLetter,
    availableLetters,
    choicesMap,
    correctTerm: canonical
  };
}

export interface HardDescriptiveBlankInfo {
  isHardDescriptive: boolean;
  visiblePrefix: string;
  blankTarget: string;
  visibleSuffix: string;
  blankLength: number;
}

/**
 * Explicit map ONLY for genuinely difficult descriptive clause/sentence answers ("本当に難しい記述").
 * Normal terms like "合計特殊出生率", "熊野古道", "下関条約", "織田信長" are NOT in this map and stay pure short-answer!
 */
const HARD_DESCRIPTIVE_BLANK_MAP: Record<
  string,
  { visiblePrefix: string; blankTarget: string; visibleSuffix: string }
> = {
  '疑わしきは被告人の利益に': {
    visiblePrefix: '疑わしきは',
    blankTarget: '被告人',
    visibleSuffix: 'の利益に'
  },
  '地方自治は民主主義の学校である': {
    visiblePrefix: '地方自治は',
    blankTarget: '民主主義',
    visibleSuffix: 'の学校である'
  },
  '当事者同士の合意で成立する': {
    visiblePrefix: '当事者同士の',
    blankTarget: '合意',
    visibleSuffix: 'で成立する'
  },
  '証拠とすることはできない': {
    visiblePrefix: '',
    blankTarget: '証拠',
    visibleSuffix: 'とすることはできない'
  },
  '精神の自由を制限する法律': {
    visiblePrefix: '',
    blankTarget: '精神の自由',
    visibleSuffix: 'を制限する法律'
  },
  '子どもに普通教育を受けさせる義務': {
    visiblePrefix: '子どもに',
    blankTarget: '普通教育',
    visibleSuffix: 'を受けさせる義務'
  },
  '勤労の権利と義務': {
    visiblePrefix: '',
    blankTarget: '勤労',
    visibleSuffix: 'の権利と義務'
  },
  '江戸から遠く離れた場所': {
    visiblePrefix: '江戸から',
    blankTarget: '遠く',
    visibleSuffix: '離れた場所'
  },
  '沿岸での漁や水上交通': {
    visiblePrefix: '沿岸での漁や',
    blankTarget: '水上交通',
    visibleSuffix: ''
  },
  '動物の骨や角': {
    visiblePrefix: '動物の',
    blankTarget: '骨や角',
    visibleSuffix: ''
  },
  '高句麗や唐': {
    visiblePrefix: '',
    blankTarget: '高句麗',
    visibleSuffix: 'や唐'
  },
  '参勤交代の江戸滞在期間': {
    visiblePrefix: '',
    blankTarget: '参勤交代',
    visibleSuffix: 'の江戸滞在期間'
  },
  '板垣死すとも自由は死せず': {
    visiblePrefix: '板垣死すとも',
    blankTarget: '自由',
    visibleSuffix: 'は死せず'
  },
  '誰一人取り残さない': {
    visiblePrefix: '誰一人',
    blankTarget: '取り残さない',
    visibleSuffix: ''
  },
  'ぜいたくは敵だ': {
    visiblePrefix: '',
    blankTarget: 'ぜいたく',
    visibleSuffix: 'は敵だ'
  },
  '短くて流れが急である': {
    visiblePrefix: '短くて流れが',
    blankTarget: '急',
    visibleSuffix: 'である'
  },
  '果樹園や畑': {
    visiblePrefix: '',
    blankTarget: '果樹園',
    visibleSuffix: 'や畑'
  },
  '水田や市街地': {
    visiblePrefix: '',
    blankTarget: '水田',
    visibleSuffix: 'や市街地'
  },
  '真珠やカキなどの養殖業': {
    visiblePrefix: '真珠やカキなどの',
    blankTarget: '養殖業',
    visibleSuffix: ''
  },
  '金属製洋食器や作業工具': {
    visiblePrefix: '金属製',
    blankTarget: '洋食器',
    visibleSuffix: 'や作業工具'
  },
  '自動車などを外国に輸出する企業': {
    visiblePrefix: '自動車などを外国に',
    blankTarget: '輸出',
    visibleSuffix: 'する企業'
  },
  '自動車や自動車部品などの機械類': {
    visiblePrefix: '',
    blankTarget: '自動車',
    visibleSuffix: 'や自動車部品などの機械類'
  }
};

/**
 * Returns Fill-in-the-blank info ONLY if `cleanPrimary` is a genuinely difficult descriptive sentence/clause.
 * Normal single terms ("合計特殊出生率", "熊野古道", etc.) return `isHardDescriptive: false`.
 */
export function getHardDescriptiveBlankInfo(cleanPrimary: string): HardDescriptiveBlankInfo {
  const entry = HARD_DESCRIPTIVE_BLANK_MAP[cleanPrimary.trim()];
  if (entry) {
    return {
      isHardDescriptive: true,
      visiblePrefix: entry.visiblePrefix,
      blankTarget: entry.blankTarget,
      visibleSuffix: entry.visibleSuffix,
      blankLength: Array.from(entry.blankTarget).length
    };
  }
  return {
    isHardDescriptive: false,
    visiblePrefix: '',
    blankTarget: cleanPrimary,
    visibleSuffix: '',
    blankLength: Array.from(cleanPrimary).length
  };
}

/**
 * Rewrites multiple-choice phrasing ("〜はどれか。", "〜を選べ。") into natural Short-Answer phrasing ("〜は何か。", "〜はどこか。")
 * so players in Short-Answer mode never see "どれか / 選べ" when there are no choices on screen.
 */
export function formatQuestionPromptForMode(
  questionText: string,
  mode: QuizFormatMode,
  isAlphabetQuestion: boolean = false,
  availableLetters: string[] = []
): string {
  if (mode !== 'short_answer') {
    return questionText;
  }

  if (isAlphabetQuestion && availableLetters.length > 0) {
    const range = `${availableLetters[0]}〜${availableLetters[availableLetters.length - 1]}`;
    return questionText.replace(/はどれか。/, `は ${range} のどれか（記号で回答）。`);
  }

  let s = questionText;

  // Geographic / place nouns + はどれか -> はどこか
  s = s.replace(
    /(都道府県|都|道|府|県|国|都市|市|町|村|島|諸島|列島|半島|地方|地域|工業地帯|空港|港|場所|山脈|山地|高地|平野|盆地|台地|火山|山|川|湖|海|海峡|湾|遺跡|古墳)はどれか([。（]|$)/g,
    '$1はどこ（何）か$2'
  );

  // Person / clan nouns + はどれか -> は誰（何）か
  s = s.replace(
    /(人物|人|将軍|天皇|大名|武将|首相|総理大臣|開祖|作者|家柄)はどれか([。（]|$)/g,
    '$1は誰（何）か$2'
  );

  // Any remaining はどれか -> は何か
  s = s.replace(/はどれか([。（]|$)/g, 'は何か$1');
  s = s.replace(/を選びなさい/g, 'を答えなさい');
  s = s.replace(/を選べ/g, 'を答えよ');

  return s;
}

const KANJI_DIGITS: Record<string, number> = {
  '〇': 0,
  '零': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9
};

const KANJI_MULTIPLIERS: Record<string, number> = {
  '十': 10,
  '百': 100,
  '千': 1000,
  '万': 10000
};

/**
 * Converts a sequence of Japanese Kanji numerals into Arabic numerals.
 */
export function convertKanjiNumbersToArabic(input: string): string {
  return input.replace(/[〇零一二三四五六七八九十百千万]+/g, (match) => {
    const hasMultiplier = /[十百千万]/.test(match);
    if (!hasMultiplier) {
      return Array.from(match)
        .map(ch => (KANJI_DIGITS[ch] !== undefined ? String(KANJI_DIGITS[ch]) : ch))
        .join('');
    }

    let total = 0;
    let currentSection = 0;
    let currentDigit = 0;

    for (const ch of match) {
      if (KANJI_DIGITS[ch] !== undefined) {
        currentDigit = KANJI_DIGITS[ch];
      } else if (KANJI_MULTIPLIERS[ch] !== undefined) {
        const mult = KANJI_MULTIPLIERS[ch];
        if (mult === 10000) {
          currentSection += currentDigit || (currentSection === 0 ? 1 : 0);
          total += currentSection * 10000;
          currentSection = 0;
          currentDigit = 0;
        } else {
          currentSection += (currentDigit === 0 ? 1 : currentDigit) * mult;
          currentDigit = 0;
        }
      }
    }

    total += currentSection + currentDigit;
    return String(total);
  });
}

/**
 * Normalizes Japanese counter & place-name connector variations:
 * 「箇」「ヶ」「ヵ」「ケ」「が」「ガ」「カ」 -> 「か」
 */
export function normalizeCounterAndConnector(input: string): string {
  let s = input;
  s = s.replace(/[箇ヶヵ]/g, 'か');
  s = s.replace(
    /([0-9一-龥])[ケカがガ]([条月国所岳島崎浦浜谷原関川池坂峠瀬丘町寺社])/g,
    '$1か$2'
  );
  s = s.replace(/([一-龥])ケ([一-龥])/g, '$1か$2');
  return s;
}

/**
 * Base string normalization
 */
export function normalizeBase(raw: string): string {
  if (!raw) return '';

  let s = raw.normalize('NFKC').trim().toLowerCase();

  s = s
    .replace(/曾/g, '曽')
    .replace(/洲/g, '州')
    .replace(/國/g, '国')
    .replace(/條/g, '条')
    .replace(/變/g, '変')
    .replace(/亂/g, '乱')
    .replace(/禮/g, '礼');

  s = s.replace(/[\s　・、。，．,."”'’「」『』【】〔〕［］\[\]―ー\-〜~：:;；!！?？]/g, '');
  s = s.replace(/([一-龥])ノ([一-龥])/g, '$1の$2');
  s = convertKanjiNumbersToArabic(s);
  s = normalizeCounterAndConnector(s);

  return s;
}

/**
 * Generates structural equivalence keys for a single term:
 * - 全国統一 <-> 天下統一
 * - 〇〇の戦い <-> 〇〇の合戦 <-> 〇〇合戦 <-> 〇〇戦い <-> 〇〇
 * - 〇〇工業地帯 <-> 〇〇工業地域 <-> 〇〇
 * - リアス式海岸 <-> リアス海岸
 * - 対華21か条の要求 <-> 21か条の要求 <-> 対華21か条 <-> 21か条
 */
export function getEquivalenceKeys(rawTerm: string): Set<string> {
  const keys = new Set<string>();
  const base = normalizeBase(rawTerm);
  if (!base) return keys;

  const addWithParticleVariants = (str: string) => {
    if (!str) return;
    keys.add(str);
    const noNo = str.replace(/の/g, '');
    if (noNo.length >= 2) {
      keys.add(noNo);
    }
  };

  addWithParticleVariants(base);

  // 1. 全国統一 <-> 天下統一
  if (base.includes('全国統一')) {
    addWithParticleVariants(base.replace(/全国統一/g, '天下統一'));
  }
  if (base.includes('天下統一')) {
    addWithParticleVariants(base.replace(/天下統一/g, '全国統一'));
  }

  // 2. Optional "式" before geographical/cultural suffixes (e.g. リアス式海岸 <-> リアス海岸)
  const withoutShiki = base.replace(/式(海岸|庭園|建築|農業|栽培|気候|住居|土器)/g, '$1');
  addWithParticleVariants(withoutShiki);

  // 3. Industrial zones/regions: 〇〇工業地帯 <-> 〇〇工業地域 <-> 〇〇
  if (/(工業地帯|工業地域)$/.test(base)) {
    const stem = base.replace(/(工業地帯|工業地域)$/, '');
    if (stem.length >= 2) {
      addWithParticleVariants(`${stem}工業地帯`);
      addWithParticleVariants(`${stem}工業地域`);
      addWithParticleVariants(stem);
    }
  }

  // 4. Battle suffixes: の戦い / の合戦 / 合戦 / 戦い / の戦
  if (/(の戦い|の合戦|合戦|戦い|の戦)$/.test(base)) {
    const stem = base.replace(/(の戦い|の合戦|合戦|戦い|の戦)$/, '');
    if (stem.length >= 2) {
      addWithParticleVariants(`${stem}の戦い`);
      addWithParticleVariants(`${stem}の合戦`);
      addWithParticleVariants(`${stem}合戦`);
      addWithParticleVariants(`${stem}戦い`);
      addWithParticleVariants(stem);
    }
  }

  // 5. 21か条 variations
  if (base.includes('21か条')) {
    const core = '21か条';
    addWithParticleVariants(core);
    addWithParticleVariants(`${core}の要求`);
    addWithParticleVariants(`対華${core}`);
    addWithParticleVariants(`対華${core}の要求`);
  }

  // 6. 〜民主制 <-> 〜民主主義, 〜制 <-> 〜制度
  if (base.endsWith('民主制')) {
    addWithParticleVariants(base.replace(/民主制$/, '民主主義'));
  } else if (base.endsWith('民主主義')) {
    addWithParticleVariants(base.replace(/民主主義$/, '民主制'));
  }

  if (base.endsWith('制度') && base.length >= 4) {
    addWithParticleVariants(base.replace(/制度$/, '制'));
    addWithParticleVariants(base.replace(/制度$/, ''));
  } else if (base.endsWith('制') && base.length >= 3) {
    addWithParticleVariants(`${base}度`);
  }

  // 7. 〜造り <-> 〜造, 憐れみ <-> 憐み, 焼き畑 <-> 焼畑
  addWithParticleVariants(base.replace(/造り/g, '造'));
  addWithParticleVariants(base.replace(/憐れみ/g, '憐み'));
  addWithParticleVariants(base.replace(/焼き畑/g, '焼畑'));

  // 8. Optional leading "約" / "およそ" / "満" and trailing "強" / "弱" / "以上" / "程度"
  if (/^(約|およそ|満)/.test(base) || /(強|弱|以上|程度)$/.test(base)) {
    const cleanedNum = base.replace(/^(約|およそ|満)/, '').replace(/(強|弱|以上|程度)$/, '');
    if (cleanedNum.length >= 1) {
      addWithParticleVariants(cleanedNum);
    }
  }

  // 9. Optional trailing suffixes
  if (/(への加盟|の加盟|の徹底|の制定|の成立|の採択|の開始|の発表|の原則|地域|現象|気候)$/.test(base)) {
    const stripped = base.replace(
      /(への加盟|の加盟|の徹底|の制定|の成立|の採択|の開始|の発表|の原則|地域|現象|気候)$/,
      ''
    );
    if (stripped.length >= 2) {
      addWithParticleVariants(stripped);
    }
  }

  return keys;
}

/**
 * Extracts all acceptable answers for a question:
 * - Full canonical answer & parenthesized aliases
 * - Synonyms from SOCIAL_STUDIES_SYNONYM_GROUPS
 * - A/B/C/D letter if it's an 【A: ..., B: ...】 question
 * - For hard descriptive answers ONLY (`isHardDescriptive === true`), also accepts `blankTarget`!
 */
export function getAcceptedAnswersForQuestion(
  question: Pick<QuizQuestion, 'question' | 'explanation' | 'acceptedAnswers'> & {
    correctAnswer?: string;
    options?: string[];
    answerIndex?: number;
  }
): string[] {
  const canonical =
    question.correctAnswer ??
    (question.options && typeof question.answerIndex === 'number'
      ? question.options[question.answerIndex]
      : '');

  const rawCandidates = new Set<string>();

  const alphabetInfo = extractAlphabetChoiceInfo(question);
  if (alphabetInfo.isAlphabetQuestion && alphabetInfo.correctLetter) {
    rawCandidates.add(alphabetInfo.correctLetter);
    const fullLabel = alphabetInfo.choicesMap[alphabetInfo.correctLetter];
    if (fullLabel) {
      rawCandidates.add(fullLabel);
      rawCandidates.add(`${alphabetInfo.correctLetter}:${fullLabel}`);
    }
  }

  if (canonical) {
    rawCandidates.add(canonical.trim());
  }

  if (question.acceptedAnswers) {
    question.acceptedAnswers.forEach(a => {
      if (a && a.trim()) rawCandidates.add(a.trim());
    });
  }

  // Extract parenthesized patterns from canonical answer
  const parenRegex = /^([^（(]*)[（(]([^）)]+)[）)](.*)$/;
  const match = canonical.match(parenRegex);
  if (match) {
    const prefix = match[1].trim();
    const inside = match[2].trim();
    const suffix = match[3].trim();

    const outsideCombined = `${prefix}${suffix}`.trim();
    if (outsideCombined.length >= 1) {
      rawCandidates.add(outsideCombined);
    }

    const insideParts = inside.split(/[・：:、/／]/).map(p => p.trim()).filter(Boolean);

    for (const part of insideParts) {
      const isExplanatoryClause =
        /など$|ため$|こと$|から$|改選$|単位|場合|範囲|もと$/.test(part) || part.length > 14;
      if (!isExplanatoryClause) {
        if (prefix && suffix) {
          rawCandidates.add(`${prefix}${part}${suffix}`);
          rawCandidates.add(`${part}${suffix}`);
        } else if (suffix && !suffix.startsWith('と') && !suffix.startsWith('―')) {
          rawCandidates.add(`${part}${suffix}`);
          rawCandidates.add(part);
        } else {
          rawCandidates.add(part);
        }
      }
    }
  }

  // Check if explanation explicitly mentions 『「〇〇」とも呼ばれます』
  if (question.explanation) {
    const expMatches = question.explanation.matchAll(/「([^」]{2,12})」とも呼ば/g);
    for (const m of expMatches) {
      if (m[1]) rawCandidates.add(m[1].trim());
    }
    const plainAliasMatch = question.explanation.match(/^([一-龥ァ-ヶー]{2,10})とも呼ばれ/);
    if (plainAliasMatch && plainAliasMatch[1]) {
      rawCandidates.add(plainAliasMatch[1].trim());
    }
  }

  // If this is a genuinely hard descriptive answer ("本当に難しい記述"), accept its blankTarget too
  const cleanPrimary = canonical.replace(/[（(][^）)]*[）)]/g, '').trim() || canonical;
  const hardDescInfo = getHardDescriptiveBlankInfo(cleanPrimary);
  if (hardDescInfo.isHardDescriptive && hardDescInfo.blankTarget) {
    rawCandidates.add(hardDescInfo.blankTarget);
  }

  // Collect all equivalence keys of the initial candidates
  const candidateKeys = new Set<string>();
  for (const c of rawCandidates) {
    for (const k of getEquivalenceKeys(c)) {
      candidateKeys.add(k);
    }
  }

  // Expand with any matching group in SOCIAL_STUDIES_SYNONYM_GROUPS
  for (const group of SOCIAL_STUDIES_SYNONYM_GROUPS) {
    let groupMatches = false;
    for (const term of group) {
      const termKeys = getEquivalenceKeys(term);
      for (const tk of termKeys) {
        if (candidateKeys.has(tk)) {
          groupMatches = true;
          break;
        }
      }
      if (groupMatches) break;
    }

    if (groupMatches) {
      for (const term of group) {
        rawCandidates.add(term);
      }
    }
  }

  return Array.from(rawCandidates);
}

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  canonicalAnswer: string;
  matchedAlias?: string;
  acceptedAliases: string[];
}

/**
 * Evaluates a user's short-answer input against:
 * - Full canonical answer
 * - A/B/C/D letter labels (if the question has 【A: ..., B: ...】)
 * - Orthographic variations, number conversions, and social studies synonyms/aliases
 * - Blank keyword (ONLY for genuinely difficult descriptive sentences).
 */
export function evaluateShortAnswer(
  userInput: string,
  question: ShuffledQuizQuestion | QuizQuestion
): AnswerEvaluationResult {
  const canonicalAnswer =
    'correctAnswer' in question
      ? question.correctAnswer
      : question.options[question.answerIndex];

  const acceptedList = getAcceptedAnswersForQuestion(question);
  const trimmedInput = userInput.trim();

  if (!trimmedInput) {
    return {
      isCorrect: false,
      canonicalAnswer,
      acceptedAliases: acceptedList
    };
  }

  // Direct check for 【A: ..., B: ..., C: ...】 alphabet questions
  const alphabetInfo = extractAlphabetChoiceInfo(question);
  if (alphabetInfo.isAlphabetQuestion) {
    const normalizedLetterInput = trimmedInput
      .normalize('NFKC')
      .toUpperCase()
      .replace(/[^A-Dア-エ]/g, '');
    const kanaToLetter: Record<string, string> = {
      'ア': 'A',
      'イ': 'B',
      'ウ': 'C',
      'エ': 'D'
    };
    const mappedLetter = kanaToLetter[normalizedLetterInput] || normalizedLetterInput;
    if (mappedLetter && mappedLetter === alphabetInfo.correctLetter && trimmedInput.length <= 3) {
      return {
        isCorrect: true,
        canonicalAnswer: `${alphabetInfo.correctLetter}（${canonicalAnswer}）`,
        matchedAlias: alphabetInfo.correctLetter,
        acceptedAliases: acceptedList
      };
    }
  }

  const userKeys = getEquivalenceKeys(trimmedInput);
  if (userKeys.size === 0) {
    return {
      isCorrect: false,
      canonicalAnswer,
      acceptedAliases: acceptedList
    };
  }

  for (const candidate of acceptedList) {
    const candidateKeys = getEquivalenceKeys(candidate);
    for (const uk of userKeys) {
      if (candidateKeys.has(uk)) {
        return {
          isCorrect: true,
          canonicalAnswer,
          matchedAlias: candidate,
          acceptedAliases: acceptedList
        };
      }
    }
  }

  return {
    isCorrect: false,
    canonicalAnswer,
    acceptedAliases: acceptedList
  };
}

const SINGLE_PROPER_NOUN_WITH_DOT = new Set([
  'マグナ・カルタ',
  'インフォームド・コンセント',
  'シビリアン・コントロール',
  'デジタル・ディバイド',
  'リーマン・ショック',
  '五・一五事件',
  '二・二六事件',
  '阪神・淡路大震災',
  '島原・天草一揆',
  'フビライ・ハン',
  'チンギス・ハン',
  'クーリング・オフ',
  '東京オリンピック・パラリンピック',
  '前九年・後三年の役',
  '非自民・連立政権'
]);

/**
 * Determines whether a question is suitable for Short-Answer mode.
 * - Questions with 【A: ..., B: ..., C: ...】 in the prompt are suitable (user types A, B, C, or D).
 * - Excludes multi-item combinations ("新潟県・北海道・秋田県", "宮城県と岩手県", "最大：北海道 ― 最小：香川県", etc.).
 * - Excludes negative questions ("大量破壊兵器に含まれないものはどれか", "**誤っている**ものはどれか") and
 *   statement-selection questions ("正しいものはどれか", "適切なものはどれか", "組み合わせはどれか").
 */
export function isShortAnswerSuitable(question: QuizQuestion | ShuffledQuizQuestion): boolean {
  const alphabetInfo = extractAlphabetChoiceInfo(question);
  if (alphabetInfo.isAlphabetQuestion) {
    return true;
  }

  const rawAnswer =
    'correctAnswer' in question
      ? question.correctAnswer
      : question.options[question.answerIndex];

  if (!rawAnswer) return false;

  const stripped = rawAnswer.replace(/[（(][^）)]*[）)]/g, '').trim();

  // Exclude multi-item combination answers ("最大：北海道 ― 最小：香川県", "新潟県・北海道・秋田県", "宮城県と岩手県", etc.)
  if (/[―÷：:、／/]| と |([一-龥ァ-ヶー]と[一-龥ァ-ヶー])/.test(stripped)) {
    return false;
  }

  if (stripped.includes('・') && !SINGLE_PROPER_NOUN_WITH_DOT.has(stripped)) {
    return false;
  }

  // Exclude long sentence answers or clause endings
  if (stripped.length > 13) {
    return false;
  }

  if (/(ため|こと|から|ある|ない|した|れる|しい|おり|受け|行う)$/.test(stripped)) {
    return false;
  }

  // Strip markdown emphasis asterisks before checking multiple-choice-only question patterns
  const cleanQuestionText = question.question.replace(/\*/g, '');
  if (
    /当てはまらない|誤っている|間違っている|含まれない|含まれていない|でないもの|ではないもの|正しくない|異なる|違う|正しいもの|適切なもの|組み合わせ|次のうち|選びなさい|選べ|特徴として|理由として|課題として|内容として/.test(
      cleanQuestionText
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Builds hint info for Short-Answer mode.
 * - Normal terms ("合計特殊出生率", "熊野古道", etc.): `isHardDescriptive: false` -> pure short-answer (NO pre-filled blank!).
 * - Hard descriptive clauses ("真珠やカキなどの養殖業", "板垣死すとも自由は死せず", etc.): `isHardDescriptive: true` -> shows 穴埋め box!
 * - Alphabet questions (【A: ..., B: ...】): `isAlphabetQuestion: true` -> user types A / B / C / D.
 */
export function getQuestionHintInfo(question: ShuffledQuizQuestion | QuizQuestion): {
  isAlphabetQuestion: boolean;
  isHardDescriptive: boolean;
  correctLetter: string;
  availableLetters: string[];
  primaryAnswer: string;
  primaryLength: number;
  visiblePrefix: string;
  blankTarget: string;
  visibleSuffix: string;
  blankLength: number;
  displayAliases: string[];
  firstCharHint: string;
} {
  const rawCanonical =
    'correctAnswer' in question
      ? question.correctAnswer
      : question.options[question.answerIndex];

  const alphabetInfo = extractAlphabetChoiceInfo(question);
  const cleanPrimary = rawCanonical.replace(/[（(][^）)]*[）)]/g, '').trim() || rawCanonical;
  const hardDescInfo = getHardDescriptiveBlankInfo(cleanPrimary);
  const allAccepted = getAcceptedAnswersForQuestion(question);

  const primaryBase = normalizeBase(cleanPrimary);
  const displayAliases: string[] = [];
  const seenBases = new Set<string>([primaryBase]);

  if (alphabetInfo.isAlphabetQuestion && alphabetInfo.correctLetter) {
    seenBases.add(normalizeBase(alphabetInfo.correctLetter));
  }
  if (hardDescInfo.isHardDescriptive && hardDescInfo.blankTarget) {
    seenBases.add(normalizeBase(hardDescInfo.blankTarget));
  }

  for (const alias of allAccepted) {
    const cleaned = alias.replace(/[（(][^）)]*[）)]/g, '').trim();
    if (!cleaned || cleaned.length > 14 || cleaned.length <= 1) continue;
    const b = normalizeBase(cleaned);
    if (!seenBases.has(b)) {
      seenBases.add(b);
      displayAliases.push(cleaned);
    }
  }

  const firstChar = Array.from(cleanPrimary)[0] || '';
  const maskedPrimary =
    firstChar + '〇'.repeat(Math.max(1, Array.from(cleanPrimary).length - 1));

  if (alphabetInfo.isAlphabetQuestion) {
    const lettersRange = `${alphabetInfo.availableLetters[0]}〜${alphabetInfo.availableLetters[alphabetInfo.availableLetters.length - 1]}`;
    return {
      isAlphabetQuestion: true,
      isHardDescriptive: false,
      correctLetter: alphabetInfo.correctLetter,
      availableLetters: alphabetInfo.availableLetters,
      primaryAnswer: `${alphabetInfo.correctLetter}（${cleanPrimary}）`,
      primaryLength: 1,
      visiblePrefix: '',
      blankTarget: alphabetInfo.correctLetter,
      visibleSuffix: '',
      blankLength: 1,
      displayAliases: [cleanPrimary, ...displayAliases.slice(0, 2)],
      firstCharHint: `語句の頭文字: 「${maskedPrimary}」（${lettersRange} の1文字で回答可）`
    };
  }

  if (hardDescInfo.isHardDescriptive) {
    const blankChars = Array.from(hardDescInfo.blankTarget);
    const blankFirst = blankChars[0] || '';
    const maskedBlank =
      blankChars.length > 1
        ? `${blankFirst}${'〇'.repeat(blankChars.length - 1)}`
        : blankFirst;

    return {
      isAlphabetQuestion: false,
      isHardDescriptive: true,
      correctLetter: '',
      availableLetters: [],
      primaryAnswer: cleanPrimary,
      primaryLength: Array.from(cleanPrimary).length,
      visiblePrefix: hardDescInfo.visiblePrefix,
      blankTarget: hardDescInfo.blankTarget,
      visibleSuffix: hardDescInfo.visibleSuffix,
      blankLength: hardDescInfo.blankLength,
      displayAliases: [hardDescInfo.blankTarget, ...displayAliases.slice(0, 3)],
      firstCharHint: `${hardDescInfo.visiblePrefix}【 ${maskedBlank} 】${hardDescInfo.visibleSuffix}`
    };
  }

  const aliasHints = displayAliases
    .slice(0, 2)
    .map(a => {
      const ch = Array.from(a)[0] || '';
      return `「${ch}${'〇'.repeat(Math.max(1, Array.from(a).length - 1))}」`;
    })
    .join(' / ');

  const firstCharHint = aliasHints
    ? `「${maskedPrimary}」（別名: ${aliasHints}）`
    : `「${maskedPrimary}」`;

  return {
    isAlphabetQuestion: false,
    isHardDescriptive: false,
    correctLetter: '',
    availableLetters: [],
    primaryAnswer: cleanPrimary,
    primaryLength: Array.from(cleanPrimary).length,
    visiblePrefix: '',
    blankTarget: cleanPrimary,
    visibleSuffix: '',
    blankLength: Array.from(cleanPrimary).length,
    displayAliases: displayAliases.slice(0, 4),
    firstCharHint
  };
}
