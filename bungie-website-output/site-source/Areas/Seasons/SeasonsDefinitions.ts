// tslint:disable: max-classes-per-file

import { Localizer } from "@Global/Localizer";
import { RouteHelper, IMultiSiteLink } from "@Routes/RouteHelper";

abstract class SeasonDefinition {
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
  public calendarContentItem;
  public calendarBackgroundImage;
  public seasonNumber = 8;
  public actionRouteString = "SeasonOfTheUndying";
  public get toastSubtitle(): string {
    return null;
  }
  public smallIcon: string;
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
  public calendarContentItem;
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season_of_dawn/calendar_desktop_bg.png";
  public seasonNumber = 9;
  public actionRouteString = "SeasonOfDawn";
  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeasonDawn;
  }
  public smallIcon = "7/ca/destiny/icons/icon_season_dawn.jpg";
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
  public calendarContentItem;
  public calendarBackgroundImage =
    "/7/ca/destiny/bgs/season11/S11_Calendar_bg.png";
  public seasonNumber = 11;
  public actionRouteString = "SeasonOfArrivals";
  public get toastSubtitle(): string {
    return Localizer.Seasons.LearnMoreSeason11;
  }
  public smallIcon = "7/ca/destiny/bgs/season11/icon_season11_full.png";
}

export class SeasonsDefinitions {
  public static currentSeason = Season11.instance;
  public static previousSeason = SeasonOfDawn.instance;
  public static seasonOfTheWorthy = SeasonOfTheWorthy.instance;
  public static seasonOfDawn = SeasonOfDawn.instance;
  public static seasonOfTheUndying = SeasonOfTheUndying.instance;
  public static season11 = Season11.instance;
}

export const SeasonsArray = [
  Season11.instance,
  SeasonOfTheWorthy.instance,
  SeasonOfDawn.instance,
  SeasonOfTheUndying.instance,
];
