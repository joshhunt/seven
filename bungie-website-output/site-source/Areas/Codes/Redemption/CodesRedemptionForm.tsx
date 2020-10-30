// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import * as Globals from "@Enum";
import { DataStore, DestroyCallback } from "@Global/DataStore";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localizer";
import { Contracts, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Button, ButtonTypes } from "@UI/UIKit/Controls/Button/Button";
import ConfirmationModal from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { SubmitButton } from "@UI/UIKit/Forms/SubmitButton";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import * as React from "react";
import { CodesDataStore, ICodesState } from "../CodesDataStore";
import styles from "./CodesRedemptionForm.module.scss";

interface ICodesRedemptionFormProps
  extends GlobalStateComponentProps<
    "loggedInUser" | "responsive" | "crossSavePairingStatus"
  > {}

interface ICodesRedemptionFormState {
  inputValue: string;
  redeemedOffer: Contracts.OfferHistoryResponse;
  codesDataStorePayload: ICodesState;
  loaded: boolean;
  cursorPosition: number;
  modalShowing: boolean;
}

/**
 * CodesRedemptionForm - Form for users to validate and redeem promo codes
 *  *
 * @param {ICodesRedemptionFormProps} props
 * @returns
 */
class CodesRedemptionForm extends React.Component<
  ICodesRedemptionFormProps,
  ICodesRedemptionFormState
> {
  private readonly inputRef: React.RefObject<
    HTMLInputElement
  > = React.createRef();
  private readonly subs: DestroyCallback[] = [];
  private readonly codeValidate = /^([ACDFGHJKLMNPRTVXY34679]{3})-?([ACDFGHJKLMNPRTVXY34679]{3})-?([ACDFGHJKLMNPRTVXY34679]{3})(?:-?([ACDFGHJKLMNPRTVXY34679]{5}))?$/;

  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      redeemedOffer: null,
      codesDataStorePayload: CodesDataStore.state,
      loaded: false,
      cursorPosition: 0,
      modalShowing: false,
    };
  }

  private readonly showErrorModal = (e) => {
    this.setState({ modalShowing: true });
    const errorModal = (
      <div>
        <h3 className={styles.errorTitle}>{e.name.toUpperCase()}</h3>
        <div
          className={styles.errorContent}
          dangerouslySetInnerHTML={{ __html: e.message }}
        />
      </div>
    );

    ConfirmationModal.show({
      children: errorModal,
      type: "warning",
      cancelButtonProps: {
        disable: true,
      },
      confirmButtonProps: {
        labelOverride: Localizer.Coderedemption.ErrorAcknowledge,
        onClick: () => {
          this.setState({ modalShowing: false });

          return true;
        },
      },
    });
  };

  public componentDidMount() {
    this.subs.push(
      CodesDataStore.observe(
        (data) => {
          data &&
            this.setState({
              codesDataStorePayload: data,
              loaded: true,
            });
        },
        null,
        true
      )
    );

    // This is useful if we want to pass a code through the url as a query string. Use "?token=[code]"
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    token?.length && this.setState({ inputValue: this._addDashes(token) });
  }

  public componentDidUpdate(prevState) {
    if (
      prevState.inputValue !== this.state.inputValue &&
      this.inputRef.current
    ) {
      this.inputRef.current.selectionStart = this.state.cursorPosition;
      this.inputRef.current.selectionEnd = this.state.cursorPosition;
    }
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  private readonly reset = () => {
    this.setState({
      inputValue: "",
      redeemedOffer: null,
    });

    CodesDataStore.update({
      selectedMembership: Globals.BungieMembershipType.None,
    });
  };

  private readonly handleChange = (e) => {
    e.preventDefault();

    const cursorPosition = e.target.selectionStart;
    const stringWithoutWhitespace = e.target.value
      .toUpperCase()
      .replace(/\s/g, "");
    this.setState({ cursorPosition, inputValue: stringWithoutWhitespace });
  };

  private readonly _addDashes = (code) => {
    const codeWithoutDashes = this._removeDashes(code);

    let codeWithDashes = "";
    if (codeWithoutDashes.length <= 3) {
      codeWithDashes = codeWithoutDashes;
    } else if (codeWithoutDashes.length <= 6) {
      codeWithDashes = `${codeWithoutDashes.substring(
        0,
        3
      )}-${codeWithoutDashes.substring(3, 6)}`;
    } else if (codeWithoutDashes.length <= 9) {
      codeWithDashes = `${codeWithoutDashes.substring(
        0,
        3
      )}-${codeWithoutDashes.substring(3, 6)}-${codeWithoutDashes.substring(
        6,
        9
      )}`;
    } else if (codeWithoutDashes.length <= 14) {
      codeWithDashes = `${codeWithoutDashes.substring(
        0,
        3
      )}-${codeWithoutDashes.substring(3, 6)}-${codeWithoutDashes.substring(
        6,
        9
      )}-${codeWithoutDashes.substring(9, 14)}`;
    }

    return codeWithDashes;
  };

  private readonly _removeDashes = (code: string) => {
    return code.replace(/[^\w\s]/gi, "");
  };

  private readonly handleSubmit = (event, codeValid) => {
    event.preventDefault();

    this.state.inputValue !== "" &&
      codeValid &&
      !this.state.modalShowing &&
      Platform.TokensService.ClaimAndApplyOnToken(
        this.state.inputValue,
        this.state.codesDataStorePayload.selectedMembership
      )
        .then((data) => this.setState({ redeemedOffer: data }))
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          this.showErrorModal(e);
        });
  };

  private readonly handleApply = (event) => {
    event.preventDefault();

    Platform.TokensService.ApplyOfferToCurrentDestinyMembership(
      this.state.codesDataStorePayload.selectedMembership,
      this.state.redeemedOffer.OfferKey
    )
      .then(
        (data) =>
          data.OfferDisplayName &&
          Modal.open(
            <div className={classNames(styles.box, styles.mbottom2)}>
              <p className={styles.success}>
                {Localizer.Coderedemption.Success}
              </p>
              <p>{Localizer.Coderedemption.PlatformSelectSuccess}</p>
            </div>
          ) &&
          this.reset()
      )
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
        this.reset();
      });
  };

  private readonly selectMembership = (
    membership: Globals.BungieMembershipType
  ) => {
    CodesDataStore.updateSelectedMembership(membership);
  };

  public render() {
    const platformSelected =
      this.state.codesDataStorePayload.selectedMembership !==
      Globals.BungieMembershipType.None;
    const codeRedeemed = this.state.redeemedOffer !== null;
    const redeemedOfferIsConsumable =
      codeRedeemed &&
      this.state.redeemedOffer.RedeemType ===
        Globals.OfferRedeemMode.Consumable;
    const codeValid = this.codeValidate.test(
      this._removeDashes(this.state.inputValue)
    );
    const { userMemberships } = this.state.codesDataStorePayload;

    const hasDestinyAccount =
      userMemberships?.length > 0 &&
      userMemberships?.[0] !== Globals.BungieMembershipType.None;

    const noDestinyAccountsErrorMessage = Localizer.FormatReact(
      Localizer.Coderedemption.LinkedDestinyAccountRequired,
      {
        settings: (
          <Anchor
            url={RouteHelper.Settings({ category: "Accounts" })}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.settingsLinkLabel}
          </Anchor>
        ),
        codeHistory: (
          <Anchor
            url={RouteHelper.CodeHistoryReact()}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.RedemptionHistoryLinkLabel}
          </Anchor>
        ),
      }
    );

    const helpErrorMessage = Localizer.FormatReact(
      Localizer.Coderedemption.HelpForumsMessage,
      {
        helpLink: (
          <Anchor
            url={RouteHelper.Help()}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.helpLinkLabel}
          </Anchor>
        ),
      }
    );

    const platformPickupMessage =
      platformSelected &&
      Localizer.Format(Localizer.Coderedemption.AppliedPlatform, {
        platform: LocalizerUtils.getPlatformNameFromMembershipType(
          this.state.codesDataStorePayload.selectedMembership
        ),
      });

    const buttonColor: ButtonTypes = codeValid ? "gold" : "white";

    const lineColor = codeValid ? styles.gold_line : styles.white_line;

    const loggedInUser = this.props.globalState.loggedInUser;

    return (
      <SystemDisabledHandler systems={["BungieTokens"]}>
        <form onSubmit={(e) => this.handleSubmit(e, codeValid)}>
          <SpinnerContainer loading={!this.state.loaded}>
            {
              <div className={styles.container}>
                <>
                  <p>{Localizer.Coderedemption.SignedInAs}</p>
                  <div className={styles.box}>
                    <p className={styles.id}>
                      {loggedInUser?.user.displayName}
                    </p>
                    <p className={styles.unique_name}>
                      {loggedInUser?.user.uniqueName}
                    </p>
                  </div>

                  <AuthTrigger isSignOut={true} className={styles.signout}>
                    <p>{Localizer.Coderedemption.NotYou}</p>
                  </AuthTrigger>

                  {!codeRedeemed ? (
                    // if we are in the initial state, show code input box
                    <>
                      <p>{Localizer.Coderedemption.RedeemCode}</p>
                      <div className={classNames(styles.input_box, lineColor)}>
                        <input
                          ref={this.inputRef}
                          placeholder={Localizer.Coderedemption.Placeholder}
                          maxLength={17}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="on"
                          spellCheck={false}
                          onChange={this.handleChange}
                          value={this.state.inputValue}
                        />
                      </div>
                      <Button
                        buttonType={buttonColor}
                        className={styles.button}
                        size={BasicSize.Medium}
                        onClick={(e) => this.handleSubmit(e, codeValid)}
                        disabled={!codeValid}
                      >
                        {Localizer.Coderedemption.ClickRedeem}
                      </Button>
                    </>
                  ) : (
                    // if user has just redeemed a code, show success message
                    <>
                      <div className={classNames(styles.box, styles.mbottom2)}>
                        <p>
                          <span className={styles.success}>
                            {Localizer.Coderedemption.Success}
                          </span>{" "}
                          {this.state.redeemedOffer.OfferDisplayName}
                        </p>
                        <p>{this.state.redeemedOffer.OfferDisplayDetail}</p>
                      </div>

                      {
                        /* if it is a consumable, show the platform selector (with error message if no destiny account found)*/

                        redeemedOfferIsConsumable ? (
                          <div className={styles.platformSection}>
                            {hasDestinyAccount ? (
                              <div>
                                <h2>
                                  {" "}
                                  {Localizer.Coderedemption.WhichPlatform}{" "}
                                </h2>
                                <div className={styles.platformItems}>
                                  {userMemberships.map((membership, i) => (
                                    <UserPlatform
                                      key={membership}
                                      selectedMembershipType={
                                        this.state.codesDataStorePayload
                                          .selectedMembership
                                      }
                                      membershipType={membership}
                                      onClick={() =>
                                        this.selectMembership(membership)
                                      }
                                    />
                                  ))}
                                </div>

                                <h3 className={styles.pickUp}>
                                  {platformPickupMessage}
                                </h3>
                                <Button
                                  buttonType={buttonColor}
                                  className={styles.button}
                                  size={BasicSize.Medium}
                                  onClick={this.handleApply}
                                  disabled={!platformSelected}
                                >
                                  {Localizer.Coderedemption.ApplyOffer}
                                </Button>
                              </div>
                            ) : (
                              /* error if no Destiny Account found */
                              <div>
                                <h1 className={styles.noDestinyTitle}>
                                  {
                                    Localizer.Coderedemption
                                      .LinkedDestinyAccountRequiredHeader
                                  }
                                </h1>
                                <h3 className={styles.noDestinyText}>
                                  {noDestinyAccountsErrorMessage}
                                </h3>
                                <h3 className={styles.noDestinyText}>
                                  {helpErrorMessage}
                                </h3>
                              </div>
                            )}
                          </div>
                        ) : (
                          /*  if it's not a consumable, show "redeem another" button */
                          <Button
                            buttonType={"gold"}
                            className={styles.button}
                            size={BasicSize.Medium}
                            onClick={this.reset}
                          >
                            {Localizer.Coderedemption.RedeemAnother}
                          </Button>
                        )
                      }
                    </>
                  )}
                </>
              </div>
            }
          </SpinnerContainer>
        </form>
      </SystemDisabledHandler>
    );
  }
}

interface IUserPlatform {
  membershipType: Globals.BungieMembershipType;
  selectedMembershipType: Globals.BungieMembershipType;
  onClick: (mt: Globals.BungieMembershipType) => void;
}

const UserPlatform = (props: IUserPlatform) => {
  const { membershipType, selectedMembershipType, onClick } = props;

  const classes = classNames(styles.platformItem, {
    [styles.selected]: membershipType === selectedMembershipType,
  });

  return (
    <div onClick={() => onClick(membershipType)} className={classes}>
      {
        Localizer.Shortplatforms[
          EnumUtils.getStringValue(membershipType, Globals.BungieMembershipType)
        ]
      }
    </div>
  );
};

export default withGlobalState(CodesRedemptionForm, [
  "loggedInUser",
  "responsive",
  "crossSavePairingStatus",
]);
