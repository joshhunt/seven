// tslint:disable: max-classes-per-file

import { Localizer } from "@bungie/localization";
import { RouteHelper, IMultiSiteLink } from "@Routes/RouteHelper";

export abstract class SeasonDefinition {
  public abstract get title(): string;

  public abstract get toastSubtitle(): string;

  public abstract image: string;
  public abstract productPageLink: IMultiSiteLink;
  public abstract progressPageImage: string;
  public abstract calendarContentItem: string;
  public abstract calendarBackgroundImage: string;
  public abstract seasonNumber: number;
  public abstract actionRouteString: string;
  public abstract smallIcon: string;
}

class SeasonOfTheUndying extends SeasonDefinition {
  public static instance = new SeasonOfTheUndying();

  public get title(): string {
    return Localizer.Destiny.SeasonOfTheUndying;
  }

  public image = "/7/ca/destiny/bgs/seasons/hero_desktop_bg1.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/seasons/season_undying_progressbg.jpg";
  public productPageLink = RouteHelper.SeasonOfTheUndying();
  public seasonNumber = 8;
  public actionRouteString = "SeasonOfTheUndying";

  public get toastSubtitle(): string {
    return null;
  }

  public smallIcon: string;
  public calendarBackgroundImage: string;
  public calendarContentItem: string;
}

class SeasonOfDawn extends SeasonDefinition {
  public static instance = new SeasonOfDawn();

  public get title(): string {
    return Localizer.Destiny.SeasonOfDawn;
  }

  public image = "/7/ca/destiny/bgs/season_of_dawn/hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/seasons/season_dawn_progressbg.jpg";
  public productPageLink = RouteHelper.SeasonOfDawn();
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season_of_dawn/calendar_desktop_bg.png";
  public seasonNumber = 9;
  public actionRouteString = "SeasonOfDawn";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonDawn;
  }

  public smallIcon = "7/ca/destiny/icons/icon_season_dawn.jpg";
  public calendarContentItem: string;
}

class SeasonOfTheWorthy extends SeasonDefinition {
  public static instance = new SeasonOfTheWorthy();

  public get title(): string {
    return Localizer.Seasonoftheworthy.PageTitle;
  }

  public image = "/7/ca/destiny/bgs/season10/hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season10/season_progress_bg.jpg";
  public productPageLink = RouteHelper.SeasonOfTheWorthy();
  public calendarContentItem = "48773";
  public calendarBackgroundImage = "/7/ca/destiny/bgs/season10/calendar_bg.jpg";
  public seasonNumber = 10;
  public actionRouteString = "SeasonOfTheWorthy";

  public get toastSubtitle(): string {
    return Localizer.SeasonOfTheWorthy.ToastSubtitle;
  }

  public smallIcon = "7/ca/destiny/bgs/season10/gear_rasputin_icon.png";
}

class Season11 extends SeasonDefinition {
  public static instance = new Season11();

  public get title(): string {
    return Localizer.Season11.SeasonOfArrivals;
  }

  public image = "/7/ca/destiny/bgs/season11/S11_hero_desktop_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season11/season_progress_bg.jpg";
  public productPageLink = RouteHelper.Season11();
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season11/S11_Calendar_bg.png";
  public seasonNumber = 11;
  public actionRouteString = "SeasonOfArrivals";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeason11;
  }

  public smallIcon = "7/ca/destiny/bgs/season11/icon_season11_full.png";
  public calendarContentItem: string;
}

class Season12 extends SeasonDefinition {
  public static instance = new Season12();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheHunt;
  }

  public image = "/7/ca/destiny/bgs/season12/ArticleBanner_01.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season12/season_progress_bg.jpg";
  public productPageLink = RouteHelper.Season12();
  public calendarContentItem: string;
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season12/calendar_bg_desktop.png";
  public seasonNumber = 12;
  public actionRouteString = "SeasonOfTheHunt";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeason12;
  }

  public smallIcon = "7/ca/destiny/bgs/season12/icon_season12_full.png";
}

class SeasonOfTheChosen extends SeasonDefinition {
  public static instance = new SeasonOfTheChosen();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheChosen;
  }

  public image = "/7/ca/destiny/bgs/season13/Season13_Key_Art.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season13/seasonbackground_13.jpg";
  public productPageLink = RouteHelper.SeasonOfTheChosen();
  public calendarContentItem: string;
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season13/calendar_bg_desktop.jpg";
  public seasonNumber = 13;
  public actionRouteString = "SeasonOfTheChosen";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheChosen;
  }

  public smallIcon = "7/ca/destiny/bgs/season13/s13_icon.svg";
}

class SeasonOfTheSplicer extends SeasonDefinition {
  public static instance = new SeasonOfTheSplicer();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheSplicer;
  }

  public image = "/7/ca/destiny/bgs/season14/Season14_season_hub_bg.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season14/seasonbackground_14.jpg";
  public productPageLink = RouteHelper.SeasonOfTheSplicer();
  public calendarContentItem: string;
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season14/calendar_bg_desktop.jpg";
  public seasonNumber = 14;
  public actionRouteString = "SeasonOfTheSplicer";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheSplicer;
  }

  public smallIcon = "7/ca/destiny/bgs/season14/s14_season_icon_square.png";
}

class SeasonOfTheLost extends SeasonDefinition {
  public static instance = new SeasonOfTheLost();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheLost;
  }

  public image = "/7/ca/destiny/bgs/season15/s15_key-art-final.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season15/seasonbackground_15.jpg";
  public productPageLink = RouteHelper.SeasonOfTheLost();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 15;
  public actionRouteString = "SeasonOfTheLost";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheLost;
  }

  public smallIcon = "7/ca/destiny/bgs/season15/s15_season_icon.png";
}

class SeasonOfTheRisen extends SeasonDefinition {
  public static instance = new SeasonOfTheRisen();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheRisen;
  }

  public image = "/7/ca/destiny/bgs/season16/s16_hero_bg_desktop.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season16/seasonbackground_16.jpg";
  public productPageLink = RouteHelper.SeasonOfTheRisen();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 16;
  public actionRouteString = "SeasonOfTheRisen";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheRisen;
  }

  public smallIcon = "/7/ca/destiny/bgs/season16/s16_season_icon.png";
}

class SeasonOfTheHaunted extends SeasonDefinition {
  public static instance = new SeasonOfTheHaunted();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheHaunted;
  }

  public image = "/7/ca/destiny/bgs/season17/Season_17_Key_Art_4k.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season17/seasonbackground_17.jpg";
  public productPageLink = RouteHelper.SeasonOfTheHaunted();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 17;
  public actionRouteString = "SeasonOfTheHaunted";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheHaunted;
  }

  public smallIcon = "/7/ca/destiny/bgs/season17/s17_season_icon.png";
}

class SeasonOfPlunder extends SeasonDefinition {
  public static instance = new SeasonOfPlunder();

  public get title(): string {
    return Localizer.Seasons.SeasonOfPlunder;
  }

  public image =
    "/7/ca/destiny/bgs/season18/season_of_plunder_key_art_16x9_web.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season18/seasonbackground_18.jpg";
  public productPageLink = RouteHelper.SeasonOfPlunder();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 18;
  public actionRouteString = "SeasonOfPlunder";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfPlunder;
  }

  public smallIcon = "/7/ca/destiny/bgs/season18/seasonicon_18.png";
}

class SeasonOfTheSeraph extends SeasonDefinition {
  public static instance = new SeasonOfTheSeraph();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheSeraph;
  }

  public image =
    "/7/ca/destiny/bgs/season19/season_of_the_seraph_key_art_16x9_web.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season19/seasonbackground_19.jpg";
  public productPageLink = RouteHelper.SeasonOfTheSeraph();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 19;
  public actionRouteString = "SeasonOfTheSeraph";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheSeraph;
  }

  public smallIcon = "/7/ca/destiny/bgs/season19/seasonicon_19.png";
}

class SeasonOfDefiance extends SeasonDefinition {
  public static instance = new SeasonOfDefiance();

  public get title(): string {
    return Localizer.Seasons.SeasonOfDefinance;
  }

  public image = "/7/ca/destiny/bgs/season20/S20_Key_Art_16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season20/seasonbackground_20.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season20/s20_Seasonal_Icon.png";

  public productPageLink = RouteHelper.SeasonOfDefiance();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 20;
  public actionRouteString = "SeasonOfDefiance";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonDefiance;
  }
}

class SeasonOfTheDeep extends SeasonDefinition {
  public static instance = new SeasonOfTheDeep();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheDeep;
  }

  public image = "/7/ca/destiny/bgs/season21/S21_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season21/seasonbackground_21.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season21/s21_Seasonal_Icon.png";

  public productPageLink = RouteHelper.SeasonOfTheDeep();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 21;
  public actionRouteString = "SeasonOfTheDeep";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheDeep;
  }
}

class SeasonOfTheWitch extends SeasonDefinition {
  public static instance = new SeasonOfTheWitch();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheWitch;
  }

  public image = "/7/ca/destiny/bgs/season22/S22_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season22/seasonbackground_22.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season22/seasonicon_22.png";

  public productPageLink = RouteHelper.SeasonOfTheWitch();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 22;
  public actionRouteString = "SeasonOfTheWitch";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheWitch;
  }
}

class SeasonOfTheWish extends SeasonDefinition {
  public static instance = new SeasonOfTheWish();

  public get title(): string {
    return Localizer.Seasons.SeasonOfTheWish;
  }

  public image = "/7/ca/destiny/bgs/season23/S23_Key_Art_-16-9.jpg";
  public progressPageImage =
    "/7/ca/destiny/bgs/season23/seasonbackground_23.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season23/seasonicon_23.png";

  public productPageLink = RouteHelper.SeasonOfTheWitch();
  public calendarContentItem: string;
  public calendarBackgroundImage = "";
  public seasonNumber = 23;
  public actionRouteString = "SeasonOfTheWish";

  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonOfTheWish;
  }
}

export class SeasonsDefinitions {
  public static previousSeason = SeasonOfTheWitch.instance;
  public static currentSeason = SeasonOfTheWish.instance;

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
