import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useEffect } from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Button, ButtonTypes } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@bungie/localization";
import { RouteDefs } from "@Routes/RouteDefs";
import styles from "./CrossSaveIndex.module.scss";
import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
} from "./Shared/CrossSaveFlowStateDataStore";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { ParallaxContainer } from "@UI/UIKit/Layout/ParallaxContainer";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { CrossSaveIndexDefinitions } from "./CrossSaveIndexDefinitions";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Spinner } from "@UI/UIKit/Controls/Spinner";
import classNames from "classnames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";

/**
 * CrossSave's index page
 *  *
 * @returns
 */
export const CrossSaveIndex = () => {
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    const queryObj = UrlUtils.QueryToObject();
    if (queryObj.FAQ && queryObj.FAQ === "true") {
      scrollToId("cross-save-FAQ");
    }
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    const top = el.getBoundingClientRect().top + window.scrollY;

    BrowserUtils.animatedScrollTo(top, 1000);
  };

  const crossSaveEnabled = ConfigUtils.SystemStatus("CrossSave");
  const faqArticleId = ConfigUtils.GetParameter(
    "CrossSave",
    "CrossSaveFaqBlock",
    0
  );

  return (
    <>
      <BungieHelmet
        title={CrossSaveIndexDefinitions.PageTitle}
        image={CrossSaveIndexDefinitions.MetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <ParallaxContainer
        className={styles.header}
        parallaxSpeed={2}
        isFadeEnabled={false}
        fadeOutSpeed={700}
        backgroundOffset={0}
      >
        <div className={styles.logoContainer}>
          <img
            className={styles.logo}
            src={Img("/destiny/logos/crossSave.png")}
          />
          <img
            className={styles.logoDetail}
            src={Img("/destiny/logos/crossSaveDetail.png")}
          />
        </div>
        <h2>{Localizer.Crosssave.CrossSaveAreaHeader}</h2>

        {crossSaveEnabled && (
          <Grid>
            <GridCol cols={12}>
              <ActivationButton
                flowState={flowState}
                globalState={globalState}
              />
            </GridCol>
          </Grid>
        )}

        {!crossSaveEnabled && (
          <Button buttonType={"disabled"}>
            {Localizer.Nav.SystemDisabledShort}
          </Button>
        )}
      </ParallaxContainer>

      <div className={styles.darkBackground}>
        <div className={styles.setupTopText}>
          <h3 className={styles.title}>{Localizer.Crosssave.SetupTitle}</h3>
          <p className={styles.subtitle}>
            {Localizer.Crosssave.SetupDescription}
          </p>
          <h3 className={styles.setupSubtitle}>
            {Localizer.Crosssave.SetupIsEasy}
          </h3>
        </div>

        <Grid isTextContainer={true}>
          <GridCol cols={4} pico={12} tiny={12} mobile={12}>
            <div className={styles.stepText}>
              <span>{Localizer.Crosssave.one}</span>
              {Localizer.Crosssave.LinkStep}
            </div>
            <div className={classNames(styles.stepImage, styles.link)} />
          </GridCol>
          <GridCol cols={4} pico={12} tiny={12} mobile={12}>
            <div className={styles.stepText}>
              <span>{Localizer.Crosssave.two}</span>
              {Localizer.Crosssave.ChooseStep}
            </div>
            <div className={classNames(styles.stepImage, styles.choose)} />
          </GridCol>
          <GridCol cols={4} pico={12} tiny={12} mobile={12}>
            <div className={styles.stepText}>
              <span>{Localizer.Crosssave.three}</span>
              {Localizer.Crosssave.Profit}
            </div>
            <div className={classNames(styles.stepImage, styles.profit)} />
          </GridCol>
        </Grid>

        <Grid className={styles.textAndImage} isTextContainer={true}>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={classNames(styles.textByImage, styles.textOne)}
          >
            <h3 className={styles.title}>{Localizer.Crosssave.StepOneTitle}</h3>
            <p className={styles.subtitle}>
              {Localizer.Crosssave.StepOneSubtitle}
            </p>
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={styles.imageOne}
          >
            <img src="/7/ca/destiny/images/cross_save/CS_Gear_01.jpg" />
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={styles.imageTwo}
          >
            <img src="/7/ca/destiny/images/cross_save/Engram.jpg" />
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={classNames(styles.textByImage, styles.textTwo)}
          >
            <h3 className={styles.title}>{Localizer.Crosssave.StepTwoTitle}</h3>
            <p className={styles.subtitle}>
              {Localizer.Crosssave.StepTwoSubtitle}
            </p>
          </GridCol>
        </Grid>

        {crossSaveEnabled && (
          <div>
            {flowState.loaded || !UserUtils.isAuthenticated(globalState) ? (
              <Grid>
                <GridCol cols={12}>
                  <div className={styles.buttons}>
                    <ActivationButton
                      flowState={flowState}
                      globalState={globalState}
                    />
                  </div>
                </GridCol>
              </Grid>
            ) : (
              <Spinner />
            )}
          </div>
        )}
      </div>

      <Grid id={"cross-save-FAQ"} isTextContainer={true}>
        <GridCol cols={12}>
          <div className={styles.FAQHeader}>
            <h2>{Localizer.Crosssave.FAQtitle}</h2>
            <p className={styles.FAQdescription}>
              {Localizer.Crosssave.FAQdescription}
              <a
                href={"/en/Forums/Topics/?tg=Help "}
                className={styles.forumLink}
              >
                {Localizer.Crosssave.ForumLink}
              </a>
            </p>
          </div>
          <div className={styles.questions}>
            <InfoBlock articleId={Number(faqArticleId)} ignoreStyles={true} />
          </div>
        </GridCol>
      </Grid>
    </>
  );
};

const ActivationButton: React.FC<any> = ({ flowState, globalState }) => {
  const loading = !flowState.loaded && UserUtils.isAuthenticated(globalState);

  const alreadyActive = flowState.isActive;
  const activateLink = RouteDefs.Areas.CrossSave.getAction(
    "Activate"
  ).resolve();
  const recapLink = RouteDefs.Areas.CrossSave.getAction("Recap").resolve();

  const buttonType: ButtonTypes = alreadyActive ? "white" : "gold";

  const link = alreadyActive ? recapLink : activateLink;

  let label = alreadyActive
    ? Localizer.Crosssave.ReviewSteupButtonLabel
    : Localizer.Crosssave.GetStartedButtonLabel;

  if (loading) {
    label = Localizer.Crosssave.LoadingCrossSaveData;
  }

  return (
    <div className={styles.buttonContainer}>
      {alreadyActive && <p>{Localizer.Crosssave.CrossSaveActiveMessage}</p>}
      <Button
        buttonType={buttonType}
        url={link}
        caps={true}
        loading={loading}
        disabled={loading}
        className={styles.activationButton}
      >
        {label}
      </Button>
    </div>
  );
};
