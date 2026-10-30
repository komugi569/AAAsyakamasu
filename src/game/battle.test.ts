import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePlayerDamage,
  calculateEnemyDamage,
  determineNextGimmick,
  getGimmickForGenre,
  calculateExpGain,
  applyExpGain,
  shuffleQuestion
} from './battle.ts';
import { QuizQuestion, PlayerProfile } from '../types/game.ts';

test('calculatePlayerDamage applies affinity weakness bonus (1.35x) when attacking with enemy weakGenre', () => {
  const normalHit = calculatePlayerDamage({
    answerTimeSeconds: 6.0,
    genre: '地理',
    weakGenre: '日本史', // not matching
    isGimmickWeakness: false,
    baseDamage: 40
  });

  const affinityHit = calculatePlayerDamage({
    answerTimeSeconds: 6.0,
    genre: '地理',
    weakGenre: '地理', // matching weakness!
    isGimmickWeakness: false,
    baseDamage: 40
  });

  assert.equal(affinityHit.isAffinityWeakness, true);
  assert.ok(affinityHit.damage > normalHit.damage);
  assert.equal(affinityHit.damage, Math.round(40 * 1.35)); // 54
});

test('calculatePlayerDamage deals offensive damage on 公民 without healing', () => {
  const civicsHit = calculatePlayerDamage({
    answerTimeSeconds: 6.0,
    genre: '公民',
    isGimmickWeakness: false,
    baseDamage: 40
  });

  assert.equal(civicsHit.damage, 40);
  assert.equal('healAmount' in civicsHit, false);
});

test('calculateEnemyDamage scales with dungeon floor', () => {
  const floor1 = calculateEnemyDamage({ turn: 1, floor: 1, hasGimmickActive: false, baseDamage: 16 });
  const floor3 = calculateEnemyDamage({ turn: 1, floor: 3, hasGimmickActive: false, baseDamage: 16 });
  assert.ok(floor3 > floor1);
});

test('determineNextGimmick supports the 3 core genres (公民, 地理, 日本史)', () => {
  assert.equal(determineNextGimmick(2, 280, 300, null)?.counterGenre, '公民');
  assert.equal(determineNextGimmick(4, 280, 300, null)?.counterGenre, '地理');
  assert.equal(determineNextGimmick(6, 280, 300, null)?.counterGenre, '日本史');
});

test('applyExpGain handles leveling and profile stats without equipment inventory', () => {
  const profile: PlayerProfile = {
    level: 1,
    exp: 0,
    nextExp: 100,
    maxHp: 100,
    bonusAtkPercent: 0,
    totalBattlesWon: 0,
    title: '見習いの探究者'
  };

  const { profile: nextProfile, leveledUp } = applyExpGain(profile, 150);
  assert.equal(leveledUp, true);
  assert.equal(nextProfile.level, 2);
  assert.equal(nextProfile.maxHp, 110);
});

test('quizDatabase contains over 1,440 questions across 地理, 日本史, 公民 with zero errors', async () => {
  const { INITIAL_QUIZ_DATA } = await import('../data/quizData.ts');
  assert.ok(INITIAL_QUIZ_DATA.length >= 1440, `Expected >= 1440 questions, got ${INITIAL_QUIZ_DATA.length}`);

  const genres: Record<string, number> = {};
  for (const q of INITIAL_QUIZ_DATA) {
    genres[q.genre] = (genres[q.genre] || 0) + 1;
    assert.ok(q.question.length > 0, `Question ${q.id} has empty question text`);
    assert.ok(q.options.length >= 2, `Question ${q.id} has less than 2 options`);
    assert.ok(q.answerIndex >= 0 && q.answerIndex < q.options.length, `Question ${q.id} has invalid answerIndex`);
    assert.ok(q.explanation.length > 0, `Question ${q.id} has empty explanation`);
  }

  assert.ok(genres['日本史'] > 500, 'Expected >500 日本史 questions');
  assert.ok(genres['公民'] > 500, 'Expected >500 公民 questions');
  assert.ok(genres['地理'] > 300, 'Expected >300 地理 questions');
  assert.equal(genres['世界史'] || 0, 0, 'Expected 0 世界史 questions');
});
