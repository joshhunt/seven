// tslint:disable: max-classes-per-file

import { Localizer } from "@bungie/localization";
import { RouteHelper, IMultiSiteLink } from "@Routes/RouteHelper";

export abstract class SeasonDefinition {
  public abstract get title(): string;
  public abstract image: string;
  public abstract progressPageImage: string;
  public abstract seasonNumber: number;
  public abstract smallIcon: string;
}

class SeasonOfTheUndying extends SeasonDefinition {
  public static instance = new SeasonOfTheUndying();

  public get title(): string {
    return Localizer.Destiny.SeasonOfTheUndying;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/seasons/hero_desktop_bg1.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/seasons/season_undying_progressbg.jpg";
  public seasonNumber = 8;
  public smallIcon: string;
}

class SeasonOfDawn extends SeasonDefinition {
  public static instance = new SeasonOfDawn();

  public get title(): string {
    return Localizer.Destiny.SeasonOfDawn;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season_of_dawn/hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/seasons/season_dawn_progressbg.jpg";
  public seasonNumber = 9;
  public smallIcon = "7/ca/destiny/icons/icon_season_dawn.jpg";
}

class SeasonOfTheWorthy extends SeasonDefinition {
  public static instance = new SeasonOfTheWorthy();

  public get title(): string {
    return Localizer.Seasonoftheworthy.PageTitle;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season10/hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season10/season_progress_bg.jpg";
  public seasonNumber = 10;
  public smallIcon = "7/ca/destiny/bgs/season10/gear_rasputin_icon.png";
}

class Season11 extends SeasonDefinition {
  public static instance = new Season11();

  public get title(): string {
    return Localizer.Season11.SeasonOfArrivals;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season11/S11_hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season11/season_progress_bg.jpg";
  public seasonNumber = 11;
  public smallIcon = "7/ca/destiny/bgs/season11/icon_season11_full.png";
}

class Season12 extends SeasonDefinition {
  public static instance = new Season12();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheHunt;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season12/ArticleBanner_01.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season12/season_progress_bg.jpg";
  public seasonNumber = 12;
  public smallIcon = "7/ca/destiny/bgs/season12/icon_season12_full.png";
}

class SeasonOfTheChosen extends SeasonDefinition {
  public static instance = new SeasonOfTheChosen();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheChosen;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season13/Season13_Key_Art.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season13/seasonbackground_13.jpg";
  public seasonNumber = 13;
  public smallIcon = "7/ca/destiny/bgs/season13/s13_icon.svg";
}

class SeasonOfTheSplicer extends SeasonDefinition {
  public static instance = new SeasonOfTheSplicer();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheSplicer;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season14/Season14_season_hub_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season14/seasonbackground_14.jpg";
  public seasonNumber = 14;
  public smallIcon = "7/ca/destiny/bgs/season14/s14_season_icon_square.png";
}

class SeasonOfTheLost extends SeasonDefinition {
  public static instance = new SeasonOfTheLost();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheLost;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season15/s15_key-art-final.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season15/seasonbackground_15.jpg";
  public seasonNumber = 15;
  public smallIcon = "7/ca/destiny/bgs/season15/s15_season_icon.png";
}

class SeasonOfTheRisen extends SeasonDefinition {
  public static instance = new SeasonOfTheRisen();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheRisen;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season16/s16_hero_bg_desktop.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season16/seasonbackground_16.jpg";
  public seasonNumber = 16;
  public smallIcon = "/7/ca/destiny/bgs/season16/s16_season_icon.png";
}

class SeasonOfTheHaunted extends SeasonDefinition {
  public static instance = new SeasonOfTheHaunted();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheHaunted;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season17/Season_17_Key_Art_4k.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season17/seasonbackground_17.jpg";
  public seasonNumber = 17;
  public smallIcon = "/7/ca/destiny/bgs/season17/s17_season_icon.png";
}

class SeasonOfPlunder extends SeasonDefinition {
  public static instance = new SeasonOfPlunder();

  public get title(): string {
    return Localizer.Seasons.SeasonOfPlunder;
  }

  // Used for metadata on seasons progress page
  public image =
    "/7/ca/destiny/bgs/season18/season_of_plunder_key_art_16x9_web.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season18/seasonbackground_18.jpg";
  public seasonNumber = 18;
  public smallIcon = "/7/ca/destiny/bgs/season18/seasonicon_18.png";
}

class SeasonOfTheSeraph extends SeasonDefinition {
  public static instance = new SeasonOfTheSeraph();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheSeraph;
  }

  // Used for metadata on seasons progress page
  public image =
    "/7/ca/destiny/bgs/season19/season_of_the_seraph_key_art_16x9_web.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season19/seasonbackground_19.jpg";
  public seasonNumber = 19;
  public smallIcon = "/7/ca/destiny/bgs/season19/seasonicon_19.png";
}

class SeasonOfDefiance extends SeasonDefinition {
  public static instance = new SeasonOfDefiance();

  public get title(): string {
    return Localizer.Seasons.SeasonOfDefinance;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season20/S20_Key_Art_16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season20/seasonbackground_20.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season20/s20_Seasonal_Icon.png";
  public seasonNumber = 20;
}

class SeasonOfTheDeep extends SeasonDefinition {
  public static instance = new SeasonOfTheDeep();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheDeep;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season21/S21_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season21/seasonbackground_21.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season21/s21_Seasonal_Icon.png";
  public seasonNumber = 21;
}

class SeasonOfTheWitch extends SeasonDefinition {
  public static instance = new SeasonOfTheWitch();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheWitch;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season22/S22_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season22/seasonbackground_22.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season22/seasonicon_22.png";
  public seasonNumber = 22;
}

class SeasonOfTheWish extends SeasonDefinition {
  public static instance = new SeasonOfTheWish();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheWish;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season23/S23_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season23/seasonbackground_23.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season23/seasonicon_23.png";
  public seasonNumber = 23;
}

class EpisodeEchoes extends SeasonDefinition {
  public static instance = new EpisodeEchoes();

  public get title(): string {
    return Localizer.Seasons.EpisodeEchoes;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season24/S24_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season24/seasonbackground_24.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season24/seasonicon_24.png";
  public seasonNumber = 24;
}

class EpisodeRevenant extends SeasonDefinition {
  public static instance = new EpisodeRevenant();

  public get title(): string {
    return Localizer.Seasons.EpisodeRevenant;
  }

  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season25/S25_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season25/seasonbackground_25.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season25/seasonicon_25.png";
  public seasonNumber = 25;
}

class EpisodeHeresy extends SeasonDefinition {
  public static instance = new EpisodeHeresy();
  public get title(): string {
    return Localizer.Seasons.EpisodeHeresy;
  }
  // Used for metadata on seasons progress page
  public image = "/7/ca/destiny/bgs/season25/S25_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season26/seasonbackground_26.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season26/seasonicon_26.png";
  public seasonNumber = 26;
}

export class SeasonsDefinitions {
  public static previousSeason = EpisodeRevenant.instance;
  public static currentSeason = EpisodeHeresy.instance;

  public static seasonOfTheUndying = SeasonOfTheUndying.instance;
  public static seasonOfDawn = SeasonOfDawn.instance;
  public static seasonOfTheWorthy = SeasonOfTheWorthy.instance;
  public static season11 = Season11.instance;
  public static season12 = Season12.instance;
  public static seasonOfTheChosen = SeasonOfTheChosen.instance;
  public static seasonOfTheSplicer = SeasonOfTheSplicer.instance;
  public static seasonOfTheLost = SeasonOfTheLost.instance;
  public static seasonOfTheRisen = SeasonOfTheRisen.instance;
  public static seasonOfTheHaunted = SeasonOfTheHaunted.instance;
  public static seasonOfPlunder = SeasonOfPlunder.instance;
  public static seasonOfTheSeraph = SeasonOfTheSeraph.instance;
  public static seasonOfTheDeep = SeasonOfTheDeep.instance;
  public static seasonOfTheWitch = SeasonOfTheWitch.instance;
  public static seasonOfTheWish = SeasonOfTheWish.instance;
}

export const SeasonsArray = [
  EpisodeHeresy.instance,
  EpisodeRevenant.instance,
  EpisodeEchoes.instance,
  SeasonOfTheWish.instance,
  SeasonOfTheWitch.instance,
  SeasonOfTheDeep.instance,
  SeasonOfDefiance.instance,
  SeasonOfTheSeraph.instance,
  SeasonOfPlunder.instance,
  SeasonOfTheHaunted.instance,
  SeasonOfTheRisen.instance,
  SeasonOfTheLost.instance,
  SeasonOfTheSplicer.instance,
  SeasonOfTheChosen.instance,
  Season12.instance,
  Season11.instance,
  SeasonOfTheWorthy.instance,
  SeasonOfDawn.instance,
  SeasonOfTheUndying.instance,
];
