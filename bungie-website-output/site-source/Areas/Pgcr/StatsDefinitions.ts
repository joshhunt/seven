// Created by larobinson, 2021
// Copyright Bungie, Inc.

class _StatsDefinitions {
  public static Instance = new _StatsDefinitions();

  public readonly teamStatBarStats = [
    "score",
    "teamScore",
    "opponentsDefeated",
    "controlZonesCaptured",
    //"controlZonesNeutralized",
    //"supremacyCrestsSecured",
    "supremacyCrestsRecovered",
    "weaponKillsSuper",
    "weaponKillsMelee",
    "weaponKillsGrenade",
  ];

  public readonly compPveTeamStatBarStats = [
    "teamScore",
    "motesDeposited",
    "mobKills",
    "invasionKills",
    "motesLost",
    "primevalHealing",
  ];

  public readonly pveStatIds = ["opponentsDefeated", "deaths", "assists"];

  public readonly pvpStatIds = ["opponentsDefeated", "efficiency"];

  public readonly pvpExtendedStatIds = [
    "player_score",
    "controlZonesCaptured",
    //"controlZonesNeutralized",
    //"supremacyCrestsSecured",
    "supremacyCrestsRecovered",
    "weaponKillsMelee",
    "weaponKillsSuper",
    "weaponKillsGrenade",
  ];

  public readonly pveExtendedStatIds = [
    "precisionKills",
    "weaponKillsMelee",
    "weaponKillsSuper",
    "weaponKillsGrenade",
    "objectivesCompleted",
    "adventuresCompleted",
    "heroicPublicEventsCompleted",
    "publicEventsCompleted",
  ];

  public readonly compPveExtendedStatIds = [
    "motesDeposited",
    "mobKills",
    "invasionKills",
    "motesLost",
    "primevalHealing",
  ];
}

export const StatsDefinitions = _StatsDefinitions.Instance;
