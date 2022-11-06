// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Footer } from "@Boot/Footer";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { UserUtils } from "@Utilities/UserUtils";
import styles from "./Clans.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { GroupType, PlatformErrorCodes } from "@Enum";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, IoIosArrowForward } from "react-icons/all";
import { Button } from "@UI/UIKit/Controls/Button/Button";

export type pageType = "myClans" | "create" | "suggested";

interface ClansProps {
  pageType: pageType;
}

export const Clans: React.FC<ClansProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);

  const searchDisabled = !ConfigUtils.SystemStatus("DestinyClanSearch");
  const searchExactMatchOnly =
    !searchDisabled && ConfigUtils.SystemStatus("ExactMatchClanSearchOnly");
  const scrollContainerRef = React.createRef<HTMLDivElement>();

  const [isFocused, setIsFocused] = useState(false);

  const doClanSearch = (searchTerm: string) => {
    Platform.GroupV2Service.GetGroupByNameV2({
      groupName: searchTerm,
      groupType: GroupType.Clan,
    })
      .then((result) => {
        if (result) {
          //when we move the clan pages to react this can be updated to history
          window.location.href = RouteHelper.Clan(result.detail.groupId).url;
        } else {
          Modal.open(Localizer.Messages.ClanNotFound);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (e.errorCode === PlatformErrorCodes.ClanNotFound) {
          Modal.open(Localizer.Messages.ClanNotFound);
        } else {
          Modal.error(e);
        }
      });
  };

  const showSignInModal = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();

      GlobalStateDataStore.actions.refreshCurrentUser();
    });
  };

  const [isSolidMainNav, setIsSolidMainNav] = useState(false);

  useEffect(() => {
    scrollContainerRef.current.addEventListener("scroll", (e) => {
      toggleDarkBgMainNav(e);
    });
  }, []);

  const toggleDarkBgMainNav = (e: Event) => {
    const target = e.currentTarget as HTMLDivElement;

    if (target.scrollTop > 60) {
      setIsSolidMainNav(true);
    } else {
      setIsSolidMainNav(false);
    }
  };

  return (
    <SystemDisabledHandler systems={[SystemNames.Clans]}>
      <BungieHelmet
        title={Localizer.Pagetitles.ClanSearch}
        description={Localizer.Pagetitles.ClanSearch}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.clanPageBody
          )}
        />
      </BungieHelmet>
      <Grid className={styles.clanContainer}>
        <div
          className={classNames(styles.fakeHeaderBg, {
            [styles.solid]: isSolidMainNav,
          })}
        />
        <div className={styles.clanPage}>
          <div className={styles.sidebar} />
          <div className={styles.containerBodyContent} ref={scrollContainerRef}>
            <div className={styles.header}>
              <h1 className={styles.sectionHeader}>
                {clansLoc.CreateOrJoinADestinyClan}
              </h1>
              <div>
                {!searchDisabled && searchExactMatchOnly && (
                  <>
                    <Formik
                      initialValues={{
                        searchTerm: "",
                      }}
                      enableReinitialize
                      onSubmit={(values, { setSubmitting }) => {
                        doClanSearch(values.searchTerm);
                      }}
                    >
                      {(formikProps) => {
                        return (
                          <Form className={styles.form}>
                            <div
                              className={classNames(styles.inputBoxItemSearch, {
                                [styles.focused]: isFocused,
                              })}
                            >
                              <FormikTextInput
                                name={"searchTerm"}
                                type={"text"}
                                placeholder={clansLoc.ExactClanName}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                              />
                              <AiOutlineClose
                                className={styles.closeX}
                                onClick={(e) => {
                                  //clear x button
                                  formikProps.resetForm({
                                    values: {
                                      searchTerm: "",
                                    },
                                  });
                                }}
                              />
                            </div>
                            <button
                              className={styles.submitButton}
                              type="submit"
                              disabled={!formikProps.dirty}
                            >
                              <Button buttonType={"gold"}>
                                <IoIosArrowForward />
                              </Button>
                            </button>
                          </Form>
                        );
                      }}
                    </Formik>
                  </>
                )}
              </div>
              <p className={styles.clanAbout}>
                {clansLoc.ClanBenefitDescription}
              </p>
              <ul className={styles.clanList}>
                <SafelySetInnerHTML html={clansLoc.ClanBenefits} />
              </ul>
              {!UserUtils.isAuthenticated(globalState) && (
                <div>
                  <h3 className={styles.sectionHeader}>
                    {clansLoc.SignInToCreateOrJoinA}
                  </h3>
                  <Button
                    className={styles.signInButton}
                    buttonType={"none"}
                    onClick={() => showSignInModal()}
                  >
                    {clansLoc.SignInToContinue}
                  </Button>
                </div>
              )}
              {UserUtils.isAuthenticated(globalState) && (
                <div>
                  <div className={styles.subNav}>
                    <Anchor
                      className={classNames({
                        [styles.current]: props.pageType === "suggested",
                      })}
                      url={RouteHelper.NewClansSuggested()}
                    >
                      {clansLoc.Suggested}
                    </Anchor>
                    <Anchor
                      className={classNames({
                        [styles.current]: props.pageType === "myClans",
                      })}
                      url={RouteHelper.NewMyClan()}
                    >
                      {clansLoc.Myclans}
                    </Anchor>
                    <Anchor
                      className={classNames({
                        [styles.current]: props.pageType === "create",
                      })}
                      url={RouteHelper.NewClansCreate()}
                    >
                      {clansLoc.Createclan}
                    </Anchor>
                  </div>
                  {props.children ?? null}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer
          className={styles.clansFooter}
          coreSettings={globalState.coreSettings}
          isFixed={true}
        />
      </Grid>
    </SystemDisabledHandler>
  );
};
