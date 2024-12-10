// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { Clans } from "@Areas/Clans/Clans";
import { ClansDestinyMembershipDataStore } from "@Areas/Clans/DataStores/ClansDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PlatformError } from "@CustomErrors";
import {
  BungieMembershipType,
  ChatSecuritySetting,
  GroupType,
  MembershipOption,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { FormikTextArea } from "@UIKit/Forms/FormikForms/FormikTextArea";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { Form, Formik, FormikValues } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import styles from "./Create.module.scss";

interface CreateProps {}

const Create: React.FC<CreateProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyUser = useDataStore(ClansDestinyMembershipDataStore);
  const clansLoc = Localizer.Clans;

  const destinyAccounts = destinyUser?.memberships?.map(
    (m) => m.membershipType
  );
  const clanAccounts = globalState?.loggedInUserClans?.results?.map(
    (c) => c.member.destinyUserInfo.membershipType
  );

  const freePlatformAccounts = destinyAccounts
    ?.filter((da) => {
      if (!clanAccounts?.includes(da)) {
        return da;
      }
    })
    .map((da) => {
      return da;
    });

  const platformDropDownOptions: IDropdownOption[] =
    freePlatformAccounts &&
    freePlatformAccounts.length > 0 &&
    freePlatformAccounts?.map((value) => {
      return {
        label:
          Localizer.Platforms[
            EnumUtils.getStringValue(value, BungieMembershipType)
          ],
        value: EnumUtils.getNumberValue(value, BungieMembershipType).toString(),
      };
    });

  const langDropdownOptions: IDropdownOption[] = Localizer.validLocales.map(
    (locale) => ({
      label: Localizer.Languages[locale.locKey],
      value: locale.name,
    })
  );

  const membershipDropdown: IDropdownOption[] = [
    {
      label: clansLoc.AdminApproval,
      value: EnumUtils.getNumberValue(
        MembershipOption.Reviewed,
        MembershipOption
      ).toString(),
    },
    {
      label: clansLoc.OpenToNewMembers,
      value: EnumUtils.getNumberValue(
        MembershipOption.Open,
        MembershipOption
      ).toString(),
    },
    {
      label: clansLoc.InviteOnly,
      value: EnumUtils.getNumberValue(
        MembershipOption.Closed,
        MembershipOption
      ).toString(),
    },
  ];

  useEffect(() => {
    ClansDestinyMembershipDataStore.actions.loadUserData();

    GlobalStateDataStore.actions.refreshSettings();
  }, []);

  const createClan = (values: FormikValues) => {
    //create clan
    const input: GroupsV2.GroupAction = {
      groupType: GroupType.Clan,
      name: values.clanName,
      about: values.clanAbout,
      theme: globalState.coreSettings.defaultGroupTheme.displayName,
      motto: values.clanMotto,
      callsign: values.clanCallSign,
      isPublic: true,
      platformMembershipType:
        BungieMembershipType[
          values.clanPlatform as keyof typeof BungieMembershipType
        ],
      membershipOption: values.clanMembershipOption,
      allowChat: true,
      chatSecurity: ChatSecuritySetting.Group,
      locale: values.clanLanguage,
      avatarImageIndex: null,
      tags: null,
      isPublicTopicAdminOnly: null,
      isDefaultPostPublic: null,
      isDefaultPostAlliance: null,
      homepage: null,
    };

    Platform.GroupV2Service.CreateGroup(input)
      .then((result) => {
        window.location.href = RouteHelper.Clan(result.groupId).url;
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  /* User not logged in */
  if (!UserUtils.isAuthenticated(globalState)) {
    return (
      <Clans pageType={"create"}>
        <p>{clansLoc.SignInToCreateOrJoinA}</p>
      </Clans>
    );
  }

  /* User does not have a destiny character */
  if (destinyUser && Object.keys(destinyUser?.characters).length === 0) {
    return (
      <Clans pageType={"create"}>
        <p>{clansLoc.ADestiny2CharacterIsRequired}</p>
      </Clans>
    );
  }

  /* User has no platforms that are not already in a clan */
  if (!platformDropDownOptions) {
    return (
      <Clans pageType={"create"}>
        <p>{clansLoc.YouAreUnableToCreateA}</p>
      </Clans>
    );
  }

  return (
    <Clans pageType={"create"}>
      <div className={styles.clanCreation}>
        <Formik
          initialValues={{
            clanName: "",
            clanCallSign: "",
            clanMotto: "",
            clanAbout: "",
            clanLanguage: Localizer.CurrentCultureName ?? "en",
            clanMembershipOption: MembershipOption.Reviewed,
            clanPlatform:
              destinyUser.selectedMembership.membershipType ??
              platformDropDownOptions[0].value,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            clanName: Yup.string()
              .required("Required")
              .max(
                25,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: 25,
                })
              )
              .min(
                3,
                Localizer.Format(clansLoc.MustBeLengthCharactersMore, {
                  length: 3,
                })
              ),
            clanCallSign: Yup.string()
              .required("Required")
              .max(
                4,
                Localizer.Format(clansLoc.MustBeLengthCharacters, { length: 4 })
              ),
            clanMotto: Yup.string().required("Required"),
            clanAbout: Yup.string()
              .required("Required")
              .max(
                1000,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: 1000,
                })
              ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            createClan(values);
          }}
        >
          {(formikProps) => {
            return (
              <Form className={styles.form}>
                <div className={styles.inputBox}>
                  <FormikTextInput
                    name={"clanName"}
                    type={"text"}
                    placeholder={clansLoc.ClanName}
                  />
                </div>
                <label className={styles.inputLabel} htmlFor={"clanName"}>
                  {clansLoc.ClanNameDescription}
                </label>
                <div className={styles.inputBox}>
                  <FormikTextInput
                    name={"clanCallSign"}
                    type={"text"}
                    placeholder={clansLoc.ClanId}
                    maxlength={"4"}
                  />
                </div>
                <label className={styles.inputLabel} htmlFor={"clanName"}>
                  {clansLoc.ClanShorthandDescription}
                </label>
                <div className={styles.inputBox}>
                  <FormikTextInput
                    name={"clanMotto"}
                    type={"text"}
                    placeholder={clansLoc.ClanMotto}
                  />
                </div>
                <label className={styles.inputLabel} htmlFor={"clanName"}>
                  {clansLoc.ClanMottoDescription}
                </label>
                <div className={classNames(styles.inputBox, styles.inputArea)}>
                  <FormikTextArea
                    name={"clanAbout"}
                    placeholder={clansLoc.WriteSomethingAboutYour}
                  />
                </div>
                <div className={styles.dropdowns}>
                  {langDropdownOptions && (
                    <Dropdown
                      name={"clanLanguage"}
                      selectedValue={formikProps.values.clanLanguage}
                      className={styles.dropdown}
                      options={langDropdownOptions}
                      onChange={(value: string) => {
                        formikProps.setFieldValue("clanLanguage", value);
                      }}
                    />
                  )}
                  {membershipDropdown && (
                    <Dropdown
                      name={"clanMembershipOption"}
                      options={membershipDropdown}
                      selectedValue={EnumUtils.getNumberValue(
                        formikProps.values.clanMembershipOption,
                        MembershipOption
                      ).toString()}
                      onChange={(value: string) => {
                        formikProps.setFieldValue(
                          "clanMembershipOption",
                          value
                        );
                      }}
                    />
                  )}
                  {platformDropDownOptions &&
                    platformDropDownOptions.length > 1 && (
                      <Dropdown
                        name={"clanPlatform"}
                        options={platformDropDownOptions}
                        selectedValue={EnumUtils.getNumberValue(
                          formikProps.values.clanPlatform,
                          BungieMembershipType
                        ).toString()}
                        onChange={(value: string) => {
                          formikProps.setFieldValue("clanPlatform", value);
                        }}
                      />
                    )}
                  {platformDropDownOptions &&
                    platformDropDownOptions.length === 1 && (
                      <h4 className="section-header platform-account">
                        {Localizer.Format(clansLoc.UsingYourLabelAccount, {
                          label: platformDropDownOptions[0].label,
                        })}
                        <input
                          name={"clanPlatform"}
                          type={"hidden"}
                          value={platformDropDownOptions[0].value}
                        />
                      </h4>
                    )}
                </div>
                <div className={styles.submitButton}>
                  <Button
                    disabled={!formikProps.dirty}
                    submit
                    buttonType={"gold"}
                  >
                    {clansLoc.CreateClan}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Clans>
  );
};

export default Create;
