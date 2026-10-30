import { DungeonEnemy, StageInfo, Genre } from '../types/game';

export const DUNGEON_FLOORS: DungeonEnemy[] = [
  {
    id: "enemy-f1-geo",
    floor: 1,
    name: "彷徨う断層のゴーレム",
    title: "崩落の地脈・前衛守護巨兵",
    maxHp: 520,
    affinity: "GEOGRAPHY_WEAK",
    weakGenre: "地理",
    affinityName: "大地の属性（弱点：地理）",
    avatarType: "geo_golem"
  },
  {
    id: "enemy-f2-nihon",
    floor: 2,
    name: "亡国の怨霊武者",
    title: "戦乱の亡霊・中堅猛将",
    maxHp: 780,
    affinity: "JAPAN_HISTORY_WEAK",
    weakGenre: "日本史",
    affinityName: "乱世の属性（弱点：日本史）",
    avatarType: "samurai_ghost"
  },
  {
    id: "enemy-f3-boss",
    floor: 3,
    name: "忘却の魔導卿",
    title: "知識の深淵を統べる魔王",
    maxHp: 1200,
    affinity: "CIVICS_WEAK",
    weakGenre: "公民",
    affinityName: "歪曲の法力（弱点：公民）",
    avatarType: "archmage_boss"
  }
];

function getAffinityCode(genre: Genre): DungeonEnemy["affinity"] {
  if (genre === "地理") return "GEOGRAPHY_WEAK";
  if (genre === "日本史") return "JAPAN_HISTORY_WEAK";
  return "CIVICS_WEAK";
}

export function getEnemyForFloor(floor: number, isEndless: boolean = false, stage?: StageInfo): DungeonEnemy {
  if (!isEndless) {
    const totalFloors = stage?.totalFloors || 3;
    const isFinalFloor = floor >= totalFloors;

    // Specialized Stage Boss on Final Floor
    if (stage && isFinalFloor) {
      const weakGenre: Genre = stage.genre !== "ALL" ? stage.genre : "公民";
      const avatarType =
        weakGenre === "地理" ? "geo_golem" :
        weakGenre === "日本史" ? "samurai_ghost" : "archmage_boss";

      return {
        id: `${stage.id}-boss-f${floor}`,
        floor,
        name: stage.bossName || "忘却の魔導卿",
        title: stage.bossTitle || "知識の深淵を統べる魔王",
        maxHp: stage.bossHp || 1200,
        affinity: getAffinityCode(weakGenre),
        weakGenre,
        affinityName: `深淵の覇気（弱点：${weakGenre}）`,
        avatarType
      };
    }

    // Specialized Stage Sub-floors (1F / 2F)
    if (stage && stage.genre !== "ALL") {
      const weakGenre = stage.genre;
      const baseHp = floor === 1 ? 500 : 750;
      const subNames: Record<Genre, [string, string]> = {
        "地理": ["地殻変動の岩石獣", "暴風圏のストームゴーレム"],
        "日本史": ["古墳の鎧武者", "幕末の修羅浪人"],
        "公民": ["条文改竄の審問官", "独裁の鉄仮面騎士"]
      };
      const avatarType =
        weakGenre === "地理" ? "geo_golem" :
        weakGenre === "日本史" ? "samurai_ghost" : "archmage_boss";

      return {
        id: `${stage.id}-f${floor}`,
        floor,
        name: subNames[weakGenre][(floor - 1) % 2],
        title: `${stage.title}・第${floor}階層守護者`,
        maxHp: baseHp,
        affinity: getAffinityCode(weakGenre),
        weakGenre,
        affinityName: `特訓結界（弱点：${weakGenre}）`,
        avatarType
      };
    }

    const index = Math.max(0, Math.min(DUNGEON_FLOORS.length - 1, floor - 1));
    return DUNGEON_FLOORS[index];
  }

  // Endless Tower Floor Generator (High-intensity scaling)
  const isBoss = floor % 5 === 0;
  const genres: Array<"地理" | "日本史" | "公民"> = ["地理", "日本史", "公民"];
  const weakGenre = genres[(floor - 1) % 3];
  const hpScale = Math.round(450 + floor * 95 + (isBoss ? 480 : 0));

  if (isBoss) {
    const bosses = [
      { name: "インフレ・ドラゴン", title: "貨幣価値を焼き払う魔竜", avatar: "archmage_boss" as const },
      { name: "鎖国の巨兵", title: "海を閉ざす黒曜の守護神", avatar: "geo_golem" as const },
      { name: "プレート・タイタン", title: "大陸を震わせる地殻王", avatar: "geo_golem" as const },
      { name: "忘却の魔導卿・真祖", title: "社会科の全記憶を奪う魔神", avatar: "archmage_boss" as const },
      { name: "覇道・信長亡霊王", title: "天下布武の怨炎", avatar: "samurai_ghost" as const }
    ];
    const bossInfo = bosses[Math.floor((floor / 5) - 1) % bosses.length];
    return {
      id: `endless-boss-${floor}`,
      floor,
      name: `【${floor}F門番】${bossInfo.name}`,
      title: bossInfo.title,
      maxHp: hpScale,
      affinity: getAffinityCode(weakGenre),
      weakGenre,
      affinityName: `第${floor}階層階門（弱点：${weakGenre}）`,
      avatarType: bossInfo.avatar
    };
  }

  const normalMinions = [
    { name: "彷徨う断層のゴーレム", avatar: "geo_golem" as const },
    { name: "乱世の怨霊武者", avatar: "samurai_ghost" as const },
    { name: "歪曲の法官", avatar: "archmage_boss" as const }
  ];
  const minion = normalMinions[(floor - 1) % normalMinions.length];

  return {
    id: `endless-enemy-${floor}`,
    floor,
    name: `${minion.name}・Lv.${floor}`,
    title: `無限塔 ${floor}F 守護霊`,
    maxHp: hpScale,
    affinity: getAffinityCode(weakGenre),
    weakGenre,
    affinityName: `試練の波動（弱点：${weakGenre}）`,
    avatarType: minion.avatar
  };
}
