import { RouteHelper } from "@Global/Routes/RouteHelper";
import { Typography } from "plxp-web-ui/components/base";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import * as React from "react";
import styles from "./Sidebar.module.scss";
import { AuthTrigger } from "./AuthTrigger";
import { Localizer } from "@bungie/localization";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Anchor } from "./Anchor";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Icon } from "@UIKit/Controls/Icon";
import { AclEnum } from "@Enum";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";

interface IAccountSidebarProps {
  /** The global state */
  globalState: GlobalState<"loggedInUser" | "loggedInUserClans">;

  /** If true, the sidebar will render as open */
  open: boolean;

  /** A callback to run if the user clicks outside the sidebar */
  onClickOutside?: () => void;
}

interface IAccountSidebarState {}

/**
 * Account sidebar, which contains information about the logged in user
 *  *
 * @param {IAccountSidebarProps} props
 * @returns
 */
export class AccountSidebar extends React.Component<
  IAccountSidebarProps,
  IAccountSidebarState
> {
  private wrapperRef: HTMLDivElement = null;

  constructor(props: IAccountSidebarProps) {
    super(props);

    this.state = {};
  }

  public componentWillUnmount(): void {
    document.removeEventListener("click", this.onBodyClick);
  }

  public shouldComponentUpdate(
    nextProps: Readonly<IAccountSidebarProps>
  ): boolean {
    const className = "account-sidebar-open";
    if (nextProps.open) {
      requestAnimationFrame(() => {
        document.addEventListener("click", this.onBodyClick);

        if (!document.documentElement.classList.contains(className)) {
          document.documentElement.classList.add(className);
        }
      });
    } else {
      requestAnimationFrame(() => {
        document.removeEventListener("click", this.onBodyClick);

        if (document.documentElement.classList.contains(className)) {
          document.documentElement.classList.remove(className);
        }
      });
    }

    return true;
  }

  public render() {
    const classes = classNames(styles.accountSidebar, {
      [styles.open]: this.props.open,
    });
    const crossSaveEnabled = ConfigUtils.SystemStatus("CrossSave");

    return (
      <div ref={(ref) => (this.wrapperRef = ref)} className={classes}>
        {this.renderUserInfo()}
        {this.renderNewUserLink()}
        {/* Bungie Section */}
        <Typography sx={{ padding: " 0.5em 1em" }} variant={"caption"}>
          Bungie
        </Typography>
        {/* View Profile */}
        <Anchor url={RouteHelper.NewProfile()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_profile.png" />
            }
            itemTitle={Localizer.Nav.userflyout_viewprofile}
          />
        </Anchor>
        {/* Account Settings */}
        <Anchor url={RouteHelper.NewSettings()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_settings.png" />
            }
            itemTitle={Localizer.Nav.userflyout_settings}
          />
        </Anchor>
        {/* Bungie Friends */}
        <Anchor url={RouteHelper.BungieFriends()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_friends.png" />
            }
            itemTitle={Localizer.Nav.BungieFriends}
          />
        </Anchor>
        {/* Rewards */}
        <Anchor url={RouteHelper.Rewards()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_rewards.png" />
            }
            itemTitle={Localizer.Nav.DigitalRewards}
          />
        </Anchor>
        {/* Redeem Codes */}
        <Anchor url={RouteHelper.CodeRedemptionReact()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/account_redeem.png" />
            }
            itemTitle={Localizer.Nav.userflyout_redeemcodes}
          />
        </Anchor>
        {/* Destiny Section */}
        <div className={styles.divider} />
        <Typography sx={{ padding: " 0.5em 1em" }} variant={"caption"}>
          Destiny
        </Typography>
        {/* Cross Save */}
        {crossSaveEnabled && (
          <Anchor url={RouteHelper.CrossSave()}>
            <OneLineItem
              size={BasicSize.Small}
              icon={
                <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_crosssave.png" />
              }
              itemTitle={Localizer.Nav.CrossSave}
            />
          </Anchor>
        )}
        {/* Rewards Pass Progress */}
        <Anchor url={RouteHelper.SeasonProgress()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin
                iconImageUrl={"/img/theme/bungienet/icons/icon_seasons.png"}
              />
            }
            itemTitle={Localizer.Nav.TopNavRewardsPassProgress}
          />
        </Anchor>
        {/* Clans */}
        <Anchor url={RouteHelper.MyClan()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_clan.png" />
            }
            itemTitle={Localizer.Nav.Clans}
          />
        </Anchor>
        {/* Fireteam Finder */}
        <Anchor url={RouteHelper.FireteamFinder()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_fireteamfinder.png" />
            }
            itemTitle={Localizer.Nav.FireteamFinder}
          />
        </Anchor>
        {/* Triumphs */}
        <Anchor url={RouteHelper.NewTriumphs()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_triumphs.png" />
            }
            itemTitle={Localizer.Nav.TopNavTriumphs}
          />
        </Anchor>
        {/* Collections */}
        <Anchor url={RouteHelper.NewCollections()}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_collections.png" />
            }
            itemTitle={Localizer.Nav.TopNavCollections}
          />
        </Anchor>
        {/* Game History */}
        <Anchor url={RouteHelper.GameHistory(null, 254)}>
          <OneLineItem
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_gamehistory.png" />
            }
            itemTitle={Localizer.Nav.TopNavGameHistory}
          />
        </Anchor>

        <div className={styles.divider} />
        {/* Sign Out */}
        <AuthTrigger isSignOut={true} onClick={this.props.onClickOutside}>
          <OneLineItem
            clickable={true}
            size={BasicSize.Small}
            icon={
              <IconCoin iconImageUrl="/img/theme/bungienet/account_sidebar/accountmenu_signout.png" />
            }
            itemTitle={Localizer.Community.signoutheader}
          />
        </AuthTrigger>
        {/* Admin Section */}
        <PermissionsGate permissions={[AclEnum.BNextForumNinja]}>
          <div className={styles.divider} />
          <Typography sx={{ padding: " 0.5em 1em" }} variant={"caption"}>
            Admin
          </Typography>
        </PermissionsGate>
        {/*New Admin Reports*/}
        <PermissionsGate permissions={[AclEnum.BNextForumNinja]}>
          <Anchor url={RouteHelper.Reports()}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.NewAdminReports}
            />
          </Anchor>
        </PermissionsGate>
        {/*Admin Reports*/}
        <PermissionsGate permissions={[AclEnum.BNextForumNinja]}>
          <Anchor url={RouteHelper.GlobalAdminPage("Reports")}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.AdminReports}
            />
          </Anchor>
        </PermissionsGate>
        {/*Review User Bans*/}
        <PermissionsGate permissions={[AclEnum.BNextForumNinja]}>
          <Anchor url={RouteHelper.GlobalAdminPage("UserReports")}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.ReviewUserBans}
            />
          </Anchor>
        </PermissionsGate>
        {/*User Editor*/}
        <PermissionsGate permissions={[AclEnum.BNextEditUsers]}>
          <Anchor url={RouteHelper.GlobalAdminPage("UserEditor")}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.UserEditor}
            />
          </Anchor>
        </PermissionsGate>
        {/*Admin History*/}
        <PermissionsGate permissions={[AclEnum.BNextAdminHistory]}>
          <Anchor url={RouteHelper.GlobalAdminPage("AdminHistory")}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.AdminHistory}
            />
          </Anchor>
        </PermissionsGate>
        {/*Creations Curator*/}
        <PermissionsGate permissions={[AclEnum.BNextCommunityContentCurator]}>
          <Anchor url={RouteHelper.CommunityCurator}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.CreationsCurator}
            />
          </Anchor>
        </PermissionsGate>
        {/*Player Support*/}
        <PermissionsGate permissions={[AclEnum.BNextPlayerSupport]}>
          <Anchor url={RouteHelper.GlobalAdminPage("Tokens")}>
            <OneLineItem
              size={BasicSize.Small}
              itemTitle={Localizer.Nav.TokenSearch}
            />
          </Anchor>
        </PermissionsGate>
      </div>
    );
  }

  private readonly onBodyClick = (e: MouseEvent) => {
    if (this.wrapperRef) {
      if (this.wrapperRef.contains(e.target as Node)) {
        return;
      }

      this.props.onClickOutside &&
        this.props.open &&
        this.props.onClickOutside();
    }
  };

  private getProfileThemePath() {
    const loggedInUser = this.props.globalState.loggedInUser;
    if (loggedInUser) {
      return `/img/UserThemes/${loggedInUser?.user.profileThemeName}/mobiletheme.jpg`;
    }

    return "rgba(0,0,0,0.25)";
  }

  private renderUserInfo() {
    const loggedInUser = this.props.globalState.loggedInUser;
    const clans = this.props.globalState.loggedInUserClans
      ? this.props.globalState.loggedInUserClans.results
      : [];
    const uniqueClans = UserUtils.getUsersUniqueClanMemberships(clans); //clans.filter((c, index, clanarray) => clanarray.findIndex(v => v.group.groupId === c.group.groupId) === index);
    const clanNames = uniqueClans.map((clan) => clan.group.name);

    if (!loggedInUser) {
      return null;
    }

    const bungieGlobalNameObject = UserUtils.getBungieNameFromBnetGeneralUser(
      loggedInUser?.user
    );

    return (
      <div className={styles.userInfoHeader}>
        <div
          className={styles.theme}
          style={{ backgroundImage: `url(${this.getProfileThemePath()})` }}
        />
        <div className={styles.userInformation}>
          <div
            className={styles.userAvatar}
            style={{
              backgroundImage: `url(${loggedInUser?.user.profilePicturePath})`,
            }}
          />
          <div className={styles.textContent}>
            <div className={styles.userDisplayName}>
              {bungieGlobalNameObject?.bungieGlobalName +
                bungieGlobalNameObject?.bungieGlobalCodeWithHashtag}
            </div>
            <div className={styles.userClans}>{clanNames.join(", ")}</div>
          </div>
        </div>
      </div>
    );
  }

  private renderNewUserLink() {
    if (
      !this.props.globalState.coreSettings.systems[
        "RegistrationBenefitsEnabled"
      ].enabled
    ) {
      return null;
    }

    if (!this.props.globalState.loggedInUser) {
      return null;
    }

    const newUserHeader = Localizer.Nav.NewUserSetup;
    const newUserDesc = Localizer.Nav.CheckoutThisPageToSetup;

    const hasFirstAccess =
      this.props.globalState.loggedInUser?.user.firstAccess?.length > 0;

    if (!hasFirstAccess) {
      return null;
    }

    const date = DateTime.fromISO(
      this.props.globalState.loggedInUser?.user.firstAccess
    );
    const accountIsNew = DateTime.now().diff(date).as("days") < 15;

    if (!accountIsNew) {
      return null;
    }

    return (
      <>
        <Anchor
          className={styles.newUserLink}
          url={RouteHelper.RegistrationBenefits()}
        >
          <div>
            <strong>{newUserHeader}</strong>
            <p>{newUserDesc}</p>
          </div>
          <Icon iconType={"material"} iconName={"keyboard_arrow_right"} />
        </Anchor>
        <div className={styles.divider} />
      </>
    );
  }
}
