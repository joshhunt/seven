import React, { ReactElement } from "react";
import { RouteComponentProps } from "react-router";
import { Localizer } from "@bungie/localization";
import { Modal, ModalOverflowTypes } from "@UI/UIKit/Controls/Modal/Modal";
import {
  withGlobalState,
  GlobalStateComponentProps,
  GlobalStateDataStore,
  GlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { PCMigrationUtilities } from "./Shared/PCMigrationUtilities";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import styles from "./PCMigrationPage.module.scss";
import stylesModal from "./Shared/PCMigrationModal.module.scss";
import { ParallaxContainer } from "@UI/UIKit/Layout/ParallaxContainer";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { PCMigrationModal } from "./Shared/PCMigrationModal";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { EmailVerificationState } from "./Shared/PCMigrationModalStagePage";
import * as Globals from "@Enum";
import YouTube from "react-youtube";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { Platform, User, Contract } from "@Platform";
import { AuthTemporaryGlobalState } from "@UI/User/RequiresAuth";
import {
  AlreadyTransferredErrorType,
  PCMigrationAlreadyMigratedError,
} from "./Shared/PCMigrationAlreadyMigratedError";
import { Img } from "@Helpers";
import { UrlUtils } from "@Utilities/UrlUtils";
import { ReactUtils } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { StringUtils } from "@Utilities/StringUtils";

type PCMigrationGlobalState = GlobalStateComponentProps<
  "loggedInUser" | "credentialTypes"
>;

interface IPCMigrationPageProperties
  extends RouteComponentProps,
    PCMigrationGlobalState {}

interface IPCMigrationPageState {
  emailValidationStatus: EmailVerificationState;
  offset: number;
  justLoggedIn: boolean;
  pcMigrationModalOpen: boolean;
  isTransferring: boolean;
  transferComplete: boolean;
  alreadyUsedModalOpen: boolean;
  errorType: AlreadyTransferredErrorType;
  errorTransferIsComplete: boolean;
  transferResponse: User.BlizzardToSteamMigrationStatusResponse;
}

class PCMigrationPage extends React.Component<
  IPCMigrationPageProperties,
  IPCMigrationPageState
> {
  private signInModal: React.RefObject<Modal>;
  private readonly pcMigrationModal: React.RefObject<PCMigrationModal>;

  // We can use this temporarily before GlobalState updates to know if the user is authed.
  private temporaryAuthOverride?: boolean;

  constructor(props: IPCMigrationPageProperties) {
    super(props);

    this.state = {
      emailValidationStatus: EmailVerificationState.NotVerified,
      offset: 0,
      justLoggedIn: false,
      pcMigrationModalOpen: false,
      transferComplete: false,
      isTransferring: false,
      alreadyUsedModalOpen: false,
      errorType: "None",
      errorTransferIsComplete: false,
      transferResponse: null,
    };

    this.openModal = this.openModal.bind(this);
    this.closePCMigrationModal = this.closePCMigrationModal.bind(this);
    this.userSignedInFromModal = this.userSignedInFromModal.bind(this);

    this.pcMigrationModal = React.createRef();
  }

  public componentDidMount() {
    GlobalStateDataStore.actions.refreshCredentialTypes();

    this.getPCMigrationTransferState(this.props.globalState.credentialTypes);

    window.addEventListener("scroll", this.parallaxShift);

    const queryObj = UrlUtils.QueryToObject();
    const isCrossSavePrompt =
      queryObj.crossSavePrompt && queryObj.crossSavePrompt === "true";

    if (isCrossSavePrompt) {
      this.setState({
        pcMigrationModalOpen: true,
      });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.parallaxShift);
  }

  public shouldComponentUpdate(nextProps: IPCMigrationPageProperties) {
    // If global state updates, we know it will take over this.isAuthenticated
    if (
      !ReactUtils.haveChanged(
        nextProps.globalState.loggedInUser,
        this.props.globalState.loggedInUser
      )
    ) {
      this.temporaryAuthOverride = undefined;
    } else {
      // if the error view is showing
      if (
        this.state.errorType !== "None" &&
        this.state.transferResponse !== null
      ) {
        //just logged out
        if (typeof nextProps.globalState.loggedInUser === "undefined") {
          this.setState({ alreadyUsedModalOpen: false });
          this.resetErrorState();
        }
      } else {
        //just logged in
        if (typeof nextProps.globalState.loggedInUser !== "undefined") {
          this.getPCMigrationTransferState(
            nextProps.globalState.credentialTypes
          );
        }
      }
    }

    return true;
  }

  private readonly parallaxShift = () => {
    this.setState({
      offset: window.pageYOffset,
    });
  };

  private get isAuthenticated() {
    return (
      this.temporaryAuthOverride ||
      UserUtils.isAuthenticated(this.props.globalState)
    );
  }

  private showAuthModal() {
    this.signInModal = Modal.signIn(this.userSignedInFromModal);
  }

  private userSignedInFromModal(
    temporaryGlobalState: AuthTemporaryGlobalState
  ) {
    this.signInModal.current.close();

    GlobalStateDataStore.actions
      .refreshCredentialTypes()
      .then(() =>
        this.getPCMigrationTransferState(temporaryGlobalState.credentialTypes)
      );

    this.temporaryAuthOverride = UserUtils.isAuthenticated(
      temporaryGlobalState
    );

    setTimeout(() => {
      if (this.isAuthenticated) {
        this.getPCMigrationTransferState(temporaryGlobalState.credentialTypes);

        this.openModal(temporaryGlobalState);
      }
    }, 1000);
  }

  public render() {
    const battlenetDisabled = !ConfigUtils.SystemStatus("Blizzard");
    const pcMoveDisabled = !ConfigUtils.SystemStatus("PCMigration");
    const sunsettingPhase1Enabled = ConfigUtils.SystemStatus(
      "PCMigrationSunsetPhase1"
    );

    const isLinked =
      this.props.globalState.loggedInUser &&
      PCMigrationUtilities.IsLinked(this.props.globalState.credentialTypes);
    const isSteamLinked =
      this.props.globalState.loggedInUser &&
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.SteamId
      );

    const headerImage = Img("/destiny/logos/steam-logo-white.png");
    const headerLabel = Localizer.FormatReact(
      Localizer.Pcmigration.HeaderDescription,
      {
        time: <span>{Localizer.Pcmigration.HeaderTimeMoving}</span>,
      }
    );
    const steamLinkedButNoBlizzard =
      Localizer.Pcmigration.linkyourbattlenetdestiny;

    const subTitleLabelUnavailable =
      Localizer.Pcmigration.TransferCurrentlyNotAvailable;

    const subTitleLabel = battlenetDisabled
      ? Localizer.Pcmigration.AsOfDecember12020AtHh
      : pcMoveDisabled
      ? subTitleLabelUnavailable
      : isLinked
      ? this.state.isTransferring
        ? Localizer.Pcmigration.WeAreInTheProcessOfTransferring
        : this.state.transferComplete
        ? Localizer.Pcmigration.YourAccountHasBeenTransferred
        : Localizer.Pcmigration.LinkSteamAccountBtnDescription
      : isSteamLinked
      ? steamLinkedButNoBlizzard
      : Localizer.PCmigration.scheduleTransfer;

    const faqArticleId = ConfigUtils.GetParameter(
      "PCMigration",
      "PCMigrationFaqBlock",
      "Pc Transfer FAQ"
    );
    const metaImage = "https://www.bungie.net/img/meta/PCMove/PCMove.jpg";

    const linkSteamBtn = isLinked
      ? this.state.isTransferring
        ? Localizer.Pcmigration.CheckTransferStatus
        : this.state.transferComplete
        ? Localizer.Pcmigration.MyTransferDetails
        : Localizer.Pcmigration.BeginTransfer
      : Localizer.Pcmigration.LinkSteamAccountBtn;

    const faqDescription = Localizer.FormatReact(
      Localizer.Pcmigration.FAQdescription,
      {
        forumLink: (
          <a href={"/en/Help/Article/47922"} className={styles.forumLink}>
            {Localizer.Pcmigration.ForumLink}
          </a>
        ),
      }
    );

    const videoId = ConfigUtils.GetParameter(
      SystemNames.PCMigrationYoutubeIdFallback,
      Localizer.CurrentCultureName,
      ""
    );
    const videoEnabled =
      !StringUtils.isNullOrWhiteSpace(videoId) &&
      ConfigUtils.SystemStatus(SystemNames.PCMigrationYoutubeIdFallback);

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Pcmigration.SocialTitle}
          image={metaImage}
          description={Localizer.Pcmigration.SocialSubtitle}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <ParallaxContainer
          className={styles.header}
          parallaxSpeed={2.5}
          isFadeEnabled={true}
          fadeOutSpeed={1000}
          backgroundOffset={0}
        >
          <React.Fragment>
            {videoEnabled && !sunsettingPhase1Enabled && !battlenetDisabled && (
              <YouTube
                containerClassName={styles.videoContainer}
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <img
              className={styles.logoDetail2}
              src={Img("/destiny/bgs/pcmigration/largeRadial.png")}
            />

            <h2>{headerLabel}</h2>
            <p>{subTitleLabel}</p>

            <div className={styles.buttonContainer}>
              <Button
                buttonType={
                  pcMoveDisabled || battlenetDisabled ? "disabled" : "gold"
                }
                className={styles.section_button}
                onClick={() => this.openModal(this.props.globalState)}
              >
                {linkSteamBtn}
              </Button>
            </div>
          </React.Fragment>
        </ParallaxContainer>

        <Grid isTextContainer={true} className={styles.buyDetail}>
          <GridCol cols={12}>
            {!sunsettingPhase1Enabled && !battlenetDisabled && (
              <div className={styles.FAQHeader}>
                <h2>{Localizer.Pcmigration.FAQtitle}</h2>
                <p className={styles.FAQdescription}>{faqDescription}</p>
              </div>
            )}

            <div className={styles.questions}>
              <InfoBlock
                articleId={Number(faqArticleId)}
                ignoreStyles={true}
                preRenderOpts={{
                  propertyName: "CustomHTML",
                }}
              />
            </div>
          </GridCol>
        </Grid>

        <Modal
          open={this.state.pcMigrationModalOpen}
          onClose={this.closePCMigrationModal}
          className={stylesModal.wizardContainer}
          overflowType={ModalOverflowTypes.scrolloutsidemodal}
          contentClassName={stylesModal.wizardContent}
        >
          {this.isAuthenticated && (
            <PCMigrationModal
              transferComplete={this.state.transferComplete}
              closeModal={this.closePCMigrationModal}
              ref={this.pcMigrationModal}
            />
          )}
        </Modal>

        {this.isAuthenticated && (
          <Modal
            open={this.state.alreadyUsedModalOpen}
            onClose={() => this.setState({ alreadyUsedModalOpen: false })}
          >
            <PCMigrationAlreadyMigratedError
              errorType={this.state.errorType}
              isComplete={this.state.errorTransferIsComplete}
              statusResponse={this.state.transferResponse}
              globalState={this.props.globalState}
              fromHomePage={true}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  }

  private closePCMigrationModal() {
    this.setState({
      pcMigrationModalOpen: false,
    });

    GlobalStateDataStore.actions.refreshCredentialTypes();

    if (typeof this.props.globalState.credentialTypes !== "undefined") {
      this.getPCMigrationTransferState(this.props.globalState.credentialTypes);
    }
  }

  private async openModal(globalState: AuthTemporaryGlobalState) {
    if (!ConfigUtils.SystemStatus("PCMigration")) {
      Modal.error(new Error(Localizer.Messages.SystemIsCurrentlyDisabled));
    } else if (this.state.errorType !== "None") {
      this.setState({
        alreadyUsedModalOpen: true,
      });
    } else {
      if (!this.isAuthenticated) {
        this.showAuthModal();
      } else if (
        globalState.loggedInUser &&
        !PCMigrationUtilities.HasCredentialType(
          globalState.credentialTypes,
          Globals.BungieCredentialType.BattleNetId
        ) &&
        !PCMigrationUtilities.HasCredentialType(
          globalState.credentialTypes,
          Globals.BungieCredentialType.SteamId
        )
      ) {
        Modal.open(
          <div className={styles.noBattlenetModal}>
            <h3>{Localizer.Pcmigration.YouMustLinkABlizzardAccount}</h3>
            <Button
              buttonType={"gold"}
              url={RouteHelper.ProfileSettings(
                globalState.loggedInUser.user.membershipId,
                "Accounts"
              )}
            >
              {Localizer.Pcmigration.LinkBlizzardAccount}
            </Button>
          </div>
        );
      } else {
        await this.getPCMigrationTransferState(globalState.credentialTypes);

        this.openPCMigrationModal();
      }
    }
  }

  private openPCMigrationModal() {
    if (
      typeof this.pcMigrationModal.current !== "undefined" &&
      this.pcMigrationModal.current !== null
    ) {
      this.pcMigrationModal.current.initialize();
    }

    this.setState({
      pcMigrationModalOpen: true,
    });
  }

  public getUserEmailState() {
    const emailStatus = this.props.globalState.loggedInUser.emailStatus;

    this.setState({
      emailValidationStatus: PCMigrationUtilities.GetEmailValidationStatus(
        emailStatus
      ),
    });
  }

  private async getPCMigrationTransferState(
    credentialTypes: Contract.GetCredentialTypesForAccountResponse[]
  ) {
    if (typeof credentialTypes === "undefined") {
      return;
    }

    if (
      PCMigrationUtilities.HasCredentialType(
        credentialTypes,
        Globals.BungieCredentialType.BattleNetId
      )
    ) {
      Platform.UserService.GetBlizzardToSteamDestinyMigrationStatus(
        Globals.BungieCredentialType.BattleNetId
      ).then((response: User.BlizzardToSteamMigrationStatusResponse) => {
        if (
          response.MigrationTransferStatus ===
            Globals.PlatformErrorCodes.PCMigrationAccountsAlreadyUsed ||
          (response.MigrationStarted &&
            !response.CallerIsLinkedToSourceAndDestinationCredential)
        ) {
          this.handleError("Blizzard", response);
        } else {
          this.setState({
            transferComplete: PCMigrationUtilities.MigrationIsComplete(
              response
            ),
            isTransferring:
              response.MigrationStarted &&
              response.CallerIsLinkedToSourceAndDestinationCredential &&
              !PCMigrationUtilities.MigrationIsComplete(response),
          });
        }
      });
    }

    if (
      PCMigrationUtilities.HasCredentialType(
        credentialTypes,
        Globals.BungieCredentialType.SteamId
      )
    ) {
      Platform.UserService.GetBlizzardToSteamDestinyMigrationStatus(
        Globals.BungieCredentialType.SteamId
      ).then((response: User.BlizzardToSteamMigrationStatusResponse) => {
        if (
          response.MigrationTransferStatus ===
            Globals.PlatformErrorCodes.PCMigrationAccountsAlreadyUsed ||
          (response.MigrationStarted &&
            !response.CallerIsLinkedToSourceAndDestinationCredential)
        ) {
          this.handleError("Steam", response);
        } else {
          this.setState({
            transferComplete: PCMigrationUtilities.MigrationIsComplete(
              response
            ),
            isTransferring:
              response.MigrationStarted &&
              response.CallerIsLinkedToSourceAndDestinationCredential &&
              !PCMigrationUtilities.MigrationIsComplete(response),
          });
        }
      });
    }
  }

  private handleError(
    errorType: AlreadyTransferredErrorType,
    response: User.BlizzardToSteamMigrationStatusResponse
  ) {
    this.setState({
      pcMigrationModalOpen: false,
      errorTransferIsComplete: response.MigrationComplete,
      errorType: errorType,
      transferResponse: response,
    });
  }

  private resetErrorState() {
    this.setState({
      errorTransferIsComplete: false,
      errorType: "None",
      transferResponse: null,
    });
  }
}

export default withGlobalState(PCMigrationPage, [
  "loggedInUser",
  "credentialTypes",
]);
