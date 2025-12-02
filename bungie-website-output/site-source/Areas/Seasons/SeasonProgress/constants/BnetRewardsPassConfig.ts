// tslint:disable: max-classes-per-file

import { Localizer } from "@bungie/localization";

export abstract class RewardsPassDefinition {
  public abstract get title(): string;
  public abstract image: string;
  public abstract progressPageImage: string;
  public abstract seasonNumber: number;
  public abstract passIndex: number;
  public abstract smallIcon: string;
  /*	public get label(): string | null {
            return null;
        }*/
}

class RewardsPassReclamation extends RewardsPassDefinition {
  public static instance = new RewardsPassReclamation();
  public get title(): string {
    return Localizer.Seasons.seasonReclamation;
  }

  /*	public get label(): string {
            return Localizer.Format(Localizer.Seasons.SeasonNumberSeasonName, {seasonNumber: this.seasonNumber, seasonName: Localizer.Seasons.seasonReclamation} );
        }*/
  public image = "";
  public progressPageImage =
    "/7/ca/destiny/bgs/season27/seasonbackground_27_0.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season27/seasonicon_27_0.svg";
  public seasonNumber = 27;
  public passIndex = 0;
}

class RewardsPassAshIron extends RewardsPassDefinition {
  public static instance = new RewardsPassAshIron();
  public get title(): string {
    return Localizer.Seasons.AshIron;
  }

  /*	public get label(): string {
            return Localizer.Format(Localizer.Seasons.SeasonNumberSeasonName, {seasonNumber: this.seasonNumber, seasonName: Localizer.Seasons.seasonReclamation} );
        }*/
  public image = "";
  public progressPageImage =
    "/7/ca/destiny/bgs/season27/seasonbackground_27_1.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season27/seasonicon_27_1.svg";
  public seasonNumber = 27;
  public passIndex = 0;
}

class RewardsPassLawless extends RewardsPassDefinition {
  public static instance = new RewardsPassLawless();
  public get title(): string {
    return Localizer.Seasons.SeasonLawless;
  }

  public image = "";
  public progressPageImage =
    "/7/ca/destiny/bgs/season28/seasonbackground_28.jpg";
  public smallIcon = "/7/ca/destiny/bgs/season28/seasonicon_28.svg";
  public seasonNumber = 28;
  public passIndex = 0;
}

export class BnetRewardsPassConfig {
  public static previousPass = RewardsPassAshIron.instance;
  public static currentPass = RewardsPassLawless.instance;
}
