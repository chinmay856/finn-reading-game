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

export function restorePlayableMissionSequence(profile, mission, { replay = false } = {}) {
  ensurePlayableProgressProfile(profile);
  const record = replay ? profile?.replays?.[mission?.id] : profile?.missions?.[mission?.id];
  return isCompatibleMissionSequence(record?.sequence, mission) ? clone(record.sequence) : null;
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
