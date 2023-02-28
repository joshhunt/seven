// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import { SaveButtonBar } from "@Areas/User/AccountComponents/Internal/SaveButtonBar";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import {
  BungieMembershipType,
  PlatformErrorCodes,
  BungieCredentialType,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform, User } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { FormikTextArea } from "@UIKit/Forms/FormikForms/FormikTextArea";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { IBungieName, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { Form, Formik } from "formik";
import React, { Suspense, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { Img } from "../../../Utilities/helpers";
import accountStyles from "../Account.module.scss";
import styles from "./IdentitySettings.module.scss";
import { Avatars } from "./Internal/Avatars";
import { Themes } from "./Internal/Themes";
import { EnumUtils } from "@Utilities/EnumUtils";

type NameChangeStatus =
  | "initial"
  | "canEdit"
  | "locked"
  | "confirm"
  | "updated";

const suggestedIconMap: Record<string, string> = {
  Psnid: Img(`bungie/icons/logos/playstation/icon.png`),
  SteamId: Img(`bungie/icons/logos/steam/icon.png`),
  StadiaId: Img(`bungie/icons/logos/stadia/icon.png`),
  Xuid: Img(`bungie/icons/logos/xbox/icon.png`),
  TwitchId: Img(`bungie/icons/logos/twitch/icon.png`),
  EgsId: Img(`bungie/icons/logos/egs/icon.png`),
};

interface IdentitySettingsProps {}

/**
 * Identity Settings - Settings page in User Account Center with displayName, avatar and theme
 *  *
 * @param {IdentitySettingsProps} props
 * @returns
 */
export const IdentitySettings: React.FC<IdentitySettingsProps> = (props) => {
  /* Constants */
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);

  const aboutMaxLength = 256;
  const [nameChangeStatus, setNameChangeStatus] = useState<NameChangeStatus>(
    "initial"
  );
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const [onPageUser, setOnPageUser] = useState<User.GeneralUser>();
  const [bungieName, setBungieName] = useState<IBungieName>(null);
  const [displayNameSuggestions, setDisplayNameSuggestions] = useState<
    Record<string, string>
  >(null);
  const [sameNameErrorState, setSameNameErrorState] = useState(false);

  /* Functions */
  const showSettingsChangedToast = () => {
    Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
      position: "br",
    });
  };

  const checkGlobalNameEditable = () => {
    Platform.UserService.NameChangesAvailable()
      .then((changesAvailable: number) => {
        setNameChangeStatus(changesAvailable > 0 ? "canEdit" : "locked");
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (e.errorCode === PlatformErrorCodes.ErrorNoAvailableNameChanges) {
          setNameChangeStatus("locked");
        }
      });
  };

  const trySaveSettings = (
    userEditRequest: Contract.UserEditRequest,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const updatingName =
      userEditRequest.displayName !== bungieName.bungieGlobalName;
    if (!updatingName) {
      // the server throws an error if we pass in a display name that matched the current one
      userEditRequest.displayName = null;
    }

    const promise =
      isAdmin && !isSelf
        ? Platform.UserService.UpdateUserAdmin(
            userEditRequest,
            onPageUser.membershipId
          )
        : Platform.UserService.UpdateUser(userEditRequest);

    promise
      .then(() => {
        if (updatingName) {
          setNameChangeStatus("updated");
        }
        GlobalStateDataStore.actions
          .refreshCurrentUser(true)
          .async.then(showSettingsChangedToast);
      })
      .catch((e) => {
        setNameChangeStatus("canEdit");

        if (e.MessageData?.ValidationFieldName === "newDisplayName") {
          Modal.open(
            Localizer.FormatReact(Localizer.Userpages.InvalidBungieName, {
              BungieNameHelpLink: (
                <Anchor url={"https://www.bungie.net/CrossPlayGuide/"}>
                  {Localizer.Userpages.CrossPlayGuideLink}
                </Anchor>
              ),
            })
          );
        } else {
          ConvertToPlatformError(e).then((err) => Modal.error(err));
        }
      })
      .finally(() => setSubmitting(false));
  };

  const showSameNameError = () => {
    setSameNameErrorState(true);
    setTimeout(() => {
      setSameNameErrorState(false);
    }, 350);
  };

  const subtitleToBungieName = () => {
    const hasChangeAvailableStatus =
      nameChangeStatus === "locked" ? (
        <div className={styles.noBungieName}>
          {Localizer.Userpages.NoNameChanges}
        </div>
      ) : null;
    const noBungieName = (
      <div className={styles.noBungieName}>
        {Localizer.UserPages.YouDoNotHaveABungieName}
      </div>
    );

    return !!onPageUser?.cachedBungieGlobalDisplayName &&
      !!onPageUser.cachedBungieGlobalDisplayNameCode ? (
      <>{hasChangeAvailableStatus}</>
    ) : (
      noBungieName
    );
  };

  const getSuggestedNames = (userMembershipData: User.UserMembershipData) => {
    Platform.UserService.GetSanitizedPlatformDisplayNames(
      userMembershipData.bungieNetUser.membershipId
    ).then((credentialNameMap) => {
      const stringMap = UserUtils.getStringKeyedMapForSanitizedCredentialNames(
        credentialNameMap
      );
      const filteredCredTypes =
        stringMap &&
        Object.keys(stringMap).filter(
          (credentialType) => !stringMap[credentialType].includes("★")
        );
      const filteredSuggestedNames: Record<string, string> = {};
      filteredCredTypes.forEach(
        (ct) => (filteredSuggestedNames[ct] = stringMap[ct])
      );
      setDisplayNameSuggestions(filteredSuggestedNames);
    });
  };

  const BungieNameAndHelpLink: React.FC = () => {
    return (
      <div className={styles.helpSentence}>
        <>
          {Localizer.FormatReact(Localizer.Userpages.BungieNameSentence, {
            bungieName: (
              <>
                <span className={styles.displayName}>
                  {bungieName?.bungieGlobalName}
                </span>
                <span className={styles.displayNameCode}>
                  {bungieName?.bungieGlobalCodeWithHashtag}
                </span>
              </>
            ),
            helpLink: (
              <Anchor url={"https://www.bungie.net/CrossPlayGuide"}>
                {Localizer.Userpages.CrossPlayGuideLink}
              </Anchor>
            ),
          })}
        </>
      </div>
    );
  };

  /* Hooks */

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalStateData)) {
      if (isSelf) {
        setOnPageUser(globalStateData.loggedInUser.user);
        setBungieName(
          UserUtils.getBungieNameFromBnetGeneralUser(
            globalStateData.loggedInUser.user
          )
        );

        Platform.UserService.GetMembershipDataById(
          globalStateData.loggedInUser.user.membershipId,
          BungieMembershipType.BungieNext
        )
          .then((data) => {
            checkGlobalNameEditable();
            getSuggestedNames(data);
          })
          .catch(ConvertToPlatformError)
          .catch((e) => Modal.error(e));
      } else if (isAdmin) {
        Platform.UserService.GetMembershipDataById(
          membershipIdFromQuery,
          BungieMembershipType.BungieNext
        )
          .then((data) => {
            setOnPageUser(data.bungieNetUser);
            setBungieName(
              UserUtils.getBungieNameFromBnetGeneralUser(data.bungieNetUser)
            );
            getSuggestedNames(data);
            checkGlobalNameEditable();
          })
          .catch(ConvertToPlatformError)
          .catch((e) => Modal.error(e));
      }
    }
  }, [globalStateData.loggedInUser, membershipIdFromQuery]);

  return (
    <div>
      <GridCol cols={12}>
        <h3>{Localizer.account.identitySettings}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      {UserUtils.isAuthenticated(globalStateData) && onPageUser && (
        <Formik
          initialValues={{
            displayName: bungieName?.bungieGlobalName,
            about: onPageUser?.about,
            profilePicture:
              onPageUser?.profilePicture === 0
                ? 70432
                : onPageUser?.profilePicture,
            profileTheme:
              onPageUser?.profileTheme === 0 ? 1000 : onPageUser?.profileTheme,
            statusText: onPageUser?.statusText,
            membershipId: onPageUser?.membershipId,
            locale: null,
            emailAddress: null,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            displayName: Yup.string().nullable().required("Required"),
            about: Yup.string().max(
              aboutMaxLength,
              `Must be ${aboutMaxLength} characters or less`
            ),
            profilePicture: Yup.number(),
            profileTheme: Yup.number(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            trySaveSettings(values, setSubmitting);
          }}
        >
          {(formikProps) => {
            return (
              <Form>
                <GridCol cols={2} medium={12} className={styles.sectionTitle}>
                  {Localizer.Userpages.BungieName}
                </GridCol>
                <GridCol
                  cols={10}
                  medium={12}
                  className={styles.inputContainer}
                >
                  <div className={styles.iconContainer}>
                    {nameChangeStatus !== "locked" && (
                      <Icon iconName={"pencil"} iconType={"fa"} />
                    )}
                    <FormikTextInput
                      name={"displayName"}
                      type={"text"}
                      maxlength={"26"}
                      disabled={nameChangeStatus === "locked"}
                      classes={{
                        input: classNames(styles.textInput, {
                          [styles.nameCollision]: sameNameErrorState,
                        }),
                      }}
                      placeholder={formikProps.values.displayName}
                    />
                    {bungieName?.bungieGlobalCodeWithHashtag && (
                      <div className={styles.code}>
                        {bungieName?.bungieGlobalCodeWithHashtag}
                      </div>
                    )}
                  </div>
                </GridCol>
                <GridCol cols={2} medium={0} />
                <GridCol cols={10} medium={12}>
                  {nameChangeStatus === "updated" && (
                    <div>
                      <p>{Localizer.Account.NameSuccessfullyChanged}</p>
                    </div>
                  )}
                  {nameChangeStatus === "locked" && (
                    <div>
                      <p>{subtitleToBungieName()}</p>
                    </div>
                  )}
                  {<BungieNameAndHelpLink />}
                  {
                    <Suspense
                      fallback={
                        <div className={styles.spacer}>
                          {Localizer.Userpages.LookingForSuggestedNames}
                        </div>
                      }
                    >
                      {nameChangeStatus === "canEdit" &&
                        displayNameSuggestions &&
                        Object.keys(displayNameSuggestions).length > 0 && (
                          <div className={styles.suggestedNamesContainer}>
                            <p>{Localizer.userpages.suggestedNames}</p>
                            <div>
                              {Object.keys(displayNameSuggestions).map(
                                (credentialType, i) => {
                                  //Remove stadia names from name suggestions
                                  if (
                                    credentialType !==
                                      EnumUtils.getStringValue(
                                        BungieCredentialType.StadiaId,
                                        BungieCredentialType
                                      ) &&
                                    !displayNameSuggestions[
                                      credentialType
                                    ].includes("★")
                                  ) {
                                    return (
                                      <a
                                        className={styles.suggestedNames}
                                        key={i}
                                        onClick={(e) => {
                                          formikProps.setFieldValue(
                                            "displayName",
                                            displayNameSuggestions[
                                              credentialType
                                            ],
                                            true
                                          );
                                          displayNameSuggestions[
                                            credentialType
                                          ] !== bungieName?.bungieGlobalName
                                            ? setNameChangeStatus("confirm")
                                            : showSameNameError();
                                        }}
                                      >
                                        <img
                                          src={suggestedIconMap[credentialType]}
                                          className={styles.platformIcon}
                                        />
                                        <p>
                                          {
                                            displayNameSuggestions[
                                              credentialType
                                            ]
                                          }
                                        </p>
                                      </a>
                                    );
                                  }
                                }
                              )}
                            </div>
                          </div>
                        )}
                    </Suspense>
                  }
                  {formikProps.values.displayName !==
                    bungieName?.bungieGlobalName && (
                    <div className={styles.confirmButtons}>
                      <button type="submit" className={styles.textOnly}>
                        <Button
                          buttonType={"gold"}
                          loading={formikProps.isSubmitting}
                        >
                          {Localizer.userPages.savesettings}
                        </Button>
                        <Button
                          buttonType={"white"}
                          onClick={() => {
                            formikProps.setFieldValue(
                              "displayName",
                              bungieName?.bungieGlobalName
                            );
                            setNameChangeStatus("canEdit");
                          }}
                        >
                          {Localizer.actions.CancelDialogButton}
                        </Button>
                      </button>
                      <p>{Localizer.userpages.namechangewarning}</p>
                    </div>
                  )}
                </GridCol>
                <GridDivider cols={12} />
                <GridCol cols={2} medium={12} className={styles.sectionTitle}>
                  {Localizer.Userpages.Status}
                </GridCol>
                <GridCol cols={10} medium={12}>
                  <div
                    className={classNames(
                      styles.iconContainer,
                      styles.inputContainer
                    )}
                  >
                    <FormikTextInput
                      name={"statusText"}
                      type={"text"}
                      placeholder={formikProps.values?.statusText}
                      classes={{ input: styles.textArea }}
                    />
                    <Icon iconName={"pencil"} iconType={"fa"} />
                  </div>
                  <p>{Localizer.Account.StatusSubtitle}</p>
                </GridCol>
                <GridDivider cols={12} />
                <GridCol cols={2} medium={12} className={styles.sectionTitle}>
                  {Localizer.Userpages.AboutMeHeader}
                </GridCol>
                <GridCol cols={10} medium={12}>
                  <div className={styles.iconContainer}>
                    <Icon iconName={"pencil"} iconType={"fa"} />
                    <FormikTextArea
                      name={"about"}
                      placeholder={formikProps.values?.about}
                      className={styles.textArea}
                      rows={9}
                      cols={58}
                      maxLength={aboutMaxLength}
                    />
                    <p className={styles.lettersRemaining}>
                      {(
                        aboutMaxLength - formikProps.values?.about?.length
                      ).toString()}
                    </p>
                  </div>
                </GridCol>
                <GridDivider cols={12} />
                <Suspense fallback={<div />}>
                  <Avatars user={onPageUser} formikProps={formikProps} />
                </Suspense>
                <GridDivider cols={12} />
                <Suspense fallback={<div />}>
                  <Themes user={onPageUser} formikProps={formikProps} />
                </Suspense>
                <SaveButtonBar
                  saveButton={
                    <button
                      type="submit"
                      className={classNames(styles.textOnly, styles.saveButton)}
                    >
                      <Button
                        buttonType={"gold"}
                        loading={formikProps.isSubmitting}
                        disabled={
                          !formikProps.dirty ||
                          !formikProps.isValid ||
                          formikProps.isSubmitting
                        }
                      >
                        {Localizer.userPages.savesettings}
                      </Button>
                    </button>
                  }
                  showing={formikProps.dirty && formikProps.isValid}
                />
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};
