function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function ensurePlayableProgressProfile(profile) {
  if (!profile || typeof profile !== "object") return profile;
  profile.completedSiteIds ??= [];
  profile.missions ??= {};
  profile.reflections ??= {};
  profile.replays ??= {};
  profile.replayCounts ??= {};
  return profile;
}

export function isCompatibleMissionSequence(sequence, mission) {
  return Boolean(
    sequence
    && sequence.version === 2
    && sequence.totalPassages === mission?.passages?.length
    && sequence.phaseOneCount === mission?.phaseOneCount
    && Number.isInteger(sequence.index)
    && sequence.index >= 0
    && sequence.index <= mission.passages.length,
  );
}

function migrateSequenceAfterPassageDemotion(sequence, mission) {
  if (!sequence || sequence.version !== 2) return null;
  if (!mission?.legacyPassageCounts?.includes(sequence.totalPassages)) return null;
  if (!Array.isArray(mission.demotedPassageIds) || mission.demotedPassageIds.length === 0) return null;

  const activeIds = new Set(mission.passages.map(({ id }) => id));
  const completedPassageIds = (sequence.completedPassageIds ?? []).filter((id) => activeIds.has(id));
  const skippedPassageIds = (sequence.skippedPassageIds ?? []).filter((id) => activeIds.has(id));
  const resolvedIds = new Set([...completedPassageIds, ...skippedPassageIds]);
  const index = mission.passages.reduce((count, { id }) => count + Number(resolvedIds.has(id)), 0);
  const totalPassages = mission.passages.length;
  const pendingPassageId = activeIds.has(sequence.pendingPassageId)
    && !resolvedIds.has(sequence.pendingPassageId)
    ? sequence.pendingPassageId
    : null;
  const phase = sequence.phase === "completed" && index === totalPassages
    ? "completed"
    : index >= totalPassages
      ? "reflection-required"
      : index === mission.phaseOneCount
        ? "midpoint-required"
        : index < mission.phaseOneCount
          ? "phase-one"
          : "lock-sequence";
  const receipt = sequence.receipt
    ? {
        ...sequence.receipt,
        completedPassageCount: completedPassageIds.length,
        skippedPassageCount: skippedPassageIds.length,
      }
    : null;

  return {
    ...clone(sequence),
    completedPassageIds,
    frame: index,
    index,
    pendingPassageId,
    phase,
    phaseOneCount: mission.phaseOneCount,
    receipt,
    skippedPassageIds,
    totalPassages,
  };
}

export function restorePlayableMissionSequence(profile, mission, { replay = false } = {}) {
  ensurePlayableProgressProfile(profile);
  const record = replay ? profile?.replays?.[mission?.id] : profile?.missions?.[mission?.id];
  if (isCompatibleMissionSequence(record?.sequence, mission)) return clone(record.sequence);
  return migrateSequenceAfterPassageDemotion(record?.sequence, mission);
}

export function persistPlayableMissionSequence(
  profile,
  mission,
  sequence,
  { completed = false, replay = false, updatedAt = new Date().toISOString() } = {},
) {
  ensurePlayableProgressProfile(profile);
  if (!profile || !mission || !sequence) return profile;

  if (replay) {
    if (completed) {
      delete profile.replays[mission.id];
      profile.replayCounts[mission.id] = (profile.replayCounts[mission.id] ?? 0) + 1;
    } else if (sequence.phase === "completed" || sequence.index === 0) {
      delete profile.replays[mission.id];
    } else {
      profile.replays[mission.id] = { sequence: clone(sequence), updatedAt };
    }
    return profile;
  }

  profile.missions[mission.id] = { sequence: clone(sequence), updatedAt };
  if (completed && !profile.completedSiteIds.includes(mission.id)) profile.completedSiteIds.push(mission.id);
  return profile;
}

function approximateProgressPercent(index, total, completed) {
  if (completed) return 100;
  if (!Number.isFinite(index) || !Number.isFinite(total) || total <= 0 || index <= 0) return 0;
  return Math.max(5, Math.min(95, Math.round(((index / total) * 100) / 5) * 5));
}

export function launcherMissionProgress(profile, mission) {
  ensurePlayableProgressProfile(profile);
  const completed = Boolean(
    profile?.completedSiteIds?.includes(mission.id)
    || profile?.reflections?.[mission.id],
  );
  const replay = restorePlayableMissionSequence(profile, mission, { replay: true });
  const canonical = restorePlayableMissionSequence(profile, mission);
  const active = completed ? replay : canonical;
  const index = active?.index ?? (completed ? mission.passages.length : 0);
  const total = mission.passages.length;
  const percent = approximateProgressPercent(index, total, completed && !replay);
  const replayInProgress = completed && Boolean(replay && replay.index > 0 && replay.phase !== "completed");
  const recoveryInProgress = !completed && index > 0;

  return Object.freeze({
    completed,
    index,
    percent,
    replayInProgress,
    recoveryInProgress,
    status: replayInProgress
      ? "RECOVERED · CONTINUE REPLAY"
      : completed
        ? "RECOVERY COMPLETE · PLAY AGAIN"
        : recoveryInProgress
          ? "CONTINUE RECOVERY"
          : "OPEN CORRUPTED WEBSITE",
    total,
  });
}
