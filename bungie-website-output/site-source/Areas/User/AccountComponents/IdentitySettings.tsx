// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import { IdentityPagination } from "@Areas/User/AccountComponents/Internal/IdentityPagination";
import { SaveButtonBar } from "@Areas/User/AccountComponents/Internal/SaveButtonBar";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Config, Contract, Platform, User } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { FormikTextArea } from "@UIKit/Forms/FormikForms/FormikTextArea";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { IBungieName, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import accountStyles from "../Account.module.scss";
import styles from "./IdentitySettings.module.scss";

type NameChangeStatus = "canEdit" | "locked" | "confirm";

interface IAvatarArrayValue {
  id: number;
  value: string;
}

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

  const [avatars, setAvatars] = useState<IAvatarArrayValue[]>([]);
  const avatarsPerPage = 48;
  const [avatarOffset, setAvatarOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [themes, setThemes] = useState<Config.UserTheme[]>([]);
  const themesPerPage = 12;
  const [themeOffset, setThemeOffset] = useState(0);

  const [nameChangeStatus, setNameChangeStatus] = useState<NameChangeStatus>(
    ConfigUtils.SystemStatus("AllowGlobalBungieDisplayNameEditing")
      ? "canEdit"
      : "locked"
  );

  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );

  const [onPageUser, setOnPageUser] = useState<User.GeneralUser>();
  const [bungieName, setBungieName] = useState<IBungieName>(null);

  const [displayNameSuggestions, setDisplayNameSuggestions] = useState<
    string[]
  >([]);

  /* Functions */
  const showSettingsChangedToast = () => {
    Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
      position: "br",
    });
  };

  const trySaveSettings = (
    userEditRequest: Contract.UserEditRequest,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    isSelf &&
      Platform.UserService.UpdateUser(userEditRequest)
        .then(() => {
          GlobalStateDataStore.actions
            .refreshCurrentUser(true)
            .async.then(showSettingsChangedToast);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e))
        .finally(() => setSubmitting(false));
  };

  const subtitleToBungieName = () => {
    return !!onPageUser?.cachedBungieGlobalDisplayName &&
      !!onPageUser.cachedBungieGlobalDisplayNameCode ? (
      Localizer.FormatReact(Localizer.Userpages.BungieNameSentence, {
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
      })
    ) : (
      <>{Localizer.UserPages.YouDoNotHaveABungieName}</>
    );
  };

  const handleAvatarPageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * avatarsPerPage);
    setAvatarOffset(newOffset);
  };

  const loadAvatars = () => {
    setLoading(true);
    Platform.UserService.GetAvailableAvatars()
      .then((data) => {
        // We want to show the newest avatars first, the data comes in with oldest first

        const avatarsNewToOld: IAvatarArrayValue[] = [];
        let avatarIndex = 0;
        // Format of data is {number: string} in order to be able to do pagination math with the indices of the avatar data,
        //I convert it to an array of ids and value pairs like so {id: number, value: string}[]
        Object.keys(data)
          .reverse()
          .forEach((key, i) => {
            const initialProfilePicture =
              onPageUser?.profilePicture === 0
                ? 70432
                : onPageUser?.profilePicture;
            if (Number(key) === initialProfilePicture) {
              avatarIndex = i;
            }
            avatarsNewToOld[i] = { id: Number(key), value: data[Number(key)] };
          });
        setAvatars(avatarsNewToOld);

        handleAvatarPageChange({
          selected: Math.floor(avatarIndex / avatarsPerPage),
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e))
      .finally(() => setLoading(false));
  };

  const handleThemePageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * themesPerPage);
    setThemeOffset(newOffset);
  };

  // profileThemeName on the user object will be the number 0 if it has not been selected, otherwise it is a string
  const _getThemePathFromThemeName = (themeName: string | number): string => {
    return `/img/UserThemes/${themeName}/mobiletheme.jpg`;
  };

  const loadThemes = () => {
    Platform.UserService.GetAvailableThemes()
      .then((data) => {
        setThemes(data);

        const themeIndex = data.findIndex(
          (theme) => onPageUser?.profileTheme === theme.userThemeId
        );
        handleThemePageChange({
          selected:
            themeIndex !== -1 ? Math.floor(themeIndex / themesPerPage) : 0,
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const getSuggestedNames = (userMembershipData: User.UserMembershipData) => {
    let suggestedNames = userMembershipData?.destinyMemberships?.map((dm) => {
      if (dm.membershipType !== BungieMembershipType.BungieNext) {
        if (dm.membershipType === BungieMembershipType.TigerStadia) {
          //stadia displayNames always have the #NNNN
          return dm.displayName?.split("#")?.[0];
        }

        return dm.displayName ?? "";
      }
    });

    //dedupe
    suggestedNames = [...new Set(suggestedNames)];

    //remove the current displayName
    suggestedNames = suggestedNames.filter((sn) => {
      return (
        sn !== globalStateData?.loggedInUser?.user?.displayName ??
        userMembershipData?.bungieNetUser?.displayName ??
        ""
      );
    });

    setDisplayNameSuggestions(suggestedNames);
  };

  /* Hooks */

  useEffect(() => {
    loadAvatars();
    loadThemes();
  }, [onPageUser]);

  useEffect(() => {
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
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
    }
  }, [globalStateData.loggedInUser, membershipIdFromQuery]);

  return (
    <div>
      <GridCol cols={12}>
        <h3>{Localizer.account.identitySettings}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      {UserUtils.isAuthenticated(globalStateData) && onPageUser ? (
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
          validationSchema={Yup.object({
            displayName: Yup.string().required("Required"),
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
                  {Localizer.Userpages.CreateViewDisplayNameLabel}
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
                      disabled={nameChangeStatus === "locked"}
                      classes={{ input: styles.textInput }}
                      placeholder={formikProps.values.displayName}
                      onChange={(e) => {
                        e.target.value !== bungieName?.bungieGlobalName
                          ? setNameChangeStatus("confirm")
                          : setNameChangeStatus("canEdit");
                      }}
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
                  {nameChangeStatus === "locked" && (
                    <div className={styles.subtitleContainer}>
                      <p>{subtitleToBungieName()}</p>
                      <Anchor
                        url={`/crossplayguide`}
                        className={styles.crossPlayGuide}
                      >
                        {Localizer.Format(
                          Localizer.Userpages.CrossPlayGuideLinkText,
                          {
                            guideLink: `${Localizer.Userpages.CrossPlayGuideLink}`,
                          }
                        )}
                      </Anchor>
                    </div>
                  )}
                  {nameChangeStatus === "canEdit" && (
                    <>
                      <p>
                        {displayNameSuggestions.length > 0 &&
                          Localizer.userpages.suggestedNames}
                      </p>
                      <div>
                        {displayNameSuggestions.map((name, i) => (
                          <a
                            className={styles.suggestedNames}
                            key={i}
                            onClick={(e) => {
                              formikProps.setFieldValue(
                                "displayName",
                                name,
                                true
                              );
                              name !== bungieName?.bungieGlobalName
                                ? setNameChangeStatus("confirm")
                                : setNameChangeStatus("canEdit");
                            }}
                          >
                            {name}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                  {nameChangeStatus === "confirm" && (
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
                  <div className={styles.iconContainer}>
                    <FormikTextInput
                      name={"statusText"}
                      type={"text"}
                      placeholder={formikProps.values?.statusText}
                      classes={{ input: styles.textArea }}
                    />
                    <Icon iconName={"pencil"} iconType={"fa"} />
                  </div>
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
                <GridCol cols={2} medium={12} className={styles.sectionTitle}>
                  {Localizer.Userpages.Avatar}
                </GridCol>
                <GridCol
                  cols={10}
                  medium={12}
                  className={styles.paginatedContent}
                >
                  <SpinnerContainer loading={loading}>
                    {avatars
                      .slice(avatarOffset, avatarOffset + avatarsPerPage)
                      .map((av, i) => {
                        return (
                          <label
                            key={i}
                            className={classNames({
                              [styles.hideWhileLoading]: loading,
                            })}
                          >
                            <Field
                              type="radio"
                              name={"profilePicture"}
                              value={av.id}
                              onChange={(e: React.ChangeEvent<any>) => {
                                // Radio type fields will, by default, convert the value to a string, this maintains the stored value as a number
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(
                                  "profilePicture",
                                  Number(e.target.value)
                                );
                              }}
                            />
                            <img
                              src={av.value}
                              className={classNames(styles.avatar, {
                                [styles.selected]:
                                  av.id === formikProps.values?.profilePicture,
                              })}
                            />
                          </label>
                        );
                      })}
                  </SpinnerContainer>
                  <IdentityPagination
                    forcePage={Math.ceil(avatarOffset / avatarsPerPage)}
                    onPageChange={(e) => handleAvatarPageChange(e)}
                    pageCount={Math.ceil(
                      Object.keys(avatars)?.length / avatarsPerPage
                    )}
                  />
                </GridCol>
                <GridDivider cols={12} />
                <GridCol cols={2} medium={12} className={styles.sectionTitle}>
                  {Localizer.Userpages.Theme}
                </GridCol>
                <GridCol cols={10} className={styles.paginatedContent}>
                  <div>
                    <label htmlFor={"profileTheme"} />
                    {themes
                      .slice(themeOffset, themeOffset + themesPerPage)
                      .map((th, i) => {
                        return (
                          <label key={i}>
                            <Field
                              type="radio"
                              name={"profileTheme"}
                              value={th.userThemeId}
                              onChange={(e: React.ChangeEvent<any>) => {
                                // Radio type fields will, by default, convert the value to a string, this maintains the stored value as a number
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(
                                  "profileTheme",
                                  Number(e.target.value)
                                );
                              }}
                            />
                            <img
                              src={_getThemePathFromThemeName(th.userThemeName)}
                              className={classNames(styles.theme, {
                                [styles.selected]:
                                  th.userThemeId ===
                                  formikProps.values?.profileTheme,
                              })}
                            />
                          </label>
                        );
                      })}
                  </div>
                  <IdentityPagination
                    forcePage={Math.floor(themeOffset / themesPerPage)}
                    onPageChange={(e) => handleThemePageChange(e)}
                    pageCount={Math.ceil(themes.length / themesPerPage)}
                  />
                </GridCol>
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
                  on={formikProps.dirty && formikProps.isValid}
                  className={styles.identityBar}
                />
              </Form>
            );
          }}
        </Formik>
      ) : null}
    </div>
  );
};
