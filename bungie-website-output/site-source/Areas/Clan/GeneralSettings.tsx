// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import {
  HostGuidedGamesPermissionLevel,
  MembershipOption,
  RuntimeGroupMemberType,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { FaRegCheckSquare } from "@react-icons/all-files/fa/FaRegCheckSquare";
import { FaRegSquare } from "@react-icons/all-files/fa/FaRegSquare";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/RouteParams";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { FormikSelect } from "@UIKit/Forms/FormikForms/FormikSelect";
import { EnumUtils } from "@Utilities/EnumUtils";
import { Field, Form, Formik, FormikValues } from "formik";
import React from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Shared/ClanSettings.module.scss";

interface GeneralSettingsProps {}

export const GeneralSettings: React.FC<GeneralSettingsProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const params = useParams<IClanParams>();
  const history = useHistory();
  const clanId = params?.clanId ?? "0";

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const clan = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === clanId
  );

  //only founders can edit the founder settings, not even Mods with AclEnum.BNextFounderInAllGroups
  const isFounder = clan?.member?.memberType > RuntimeGroupMemberType.Admin;

  const editGeneralSettings = (values: FormikValues) => {
    const founderOptionsInput: GroupsV2.GroupOptionsEditAction = {
      HostGuidedGamePermissionOverride: values.guideLevel,
      InvitePermissionOverride: values.allowAdminsInvite,
      JoinLevel: values.memberLevel,
      UpdateBannerPermissionOverride: values.allowAdminsBanner,
      UpdateCulturePermissionOverride: values.allowAdminsCulture,
    };

    const editGroupInput: GroupsV2.GroupEditAction = {
      about: null,
      callsign: null,
      motto: null,
      name: null,
      theme: null,
      tags: null,
      locale: values.languageOptions,
      membershipOption: values.membershipOption,
    };

    Promise.all([
      Platform.GroupV2Service.EditFounderOptions(founderOptionsInput, clanId),
      Platform.GroupV2Service.EditGroup(editGroupInput, clanId),
    ])
      .then((result) => {
        Modal.open(<p>{clansLoc.ChangesHaveBeenSuccessfully}</p>);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const membershipOptions: IDropdownOption[] = [
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

  const guideLevelOptions: IDropdownOption[] = [
    {
      label: clansLoc.Beginner,
      value: EnumUtils.getNumberValue(
        HostGuidedGamesPermissionLevel.Beginner,
        HostGuidedGamesPermissionLevel
      ).toString(),
    },
    {
      label: clansLoc.Member,
      value: EnumUtils.getNumberValue(
        HostGuidedGamesPermissionLevel.Member,
        HostGuidedGamesPermissionLevel
      ).toString(),
    },
  ];

  const memberLevelOptions: IDropdownOption[] = [
    {
      label: clansLoc.Beginner,
      value: EnumUtils.getNumberValue(
        RuntimeGroupMemberType.Beginner,
        RuntimeGroupMemberType
      ).toString(),
    },
    {
      label: clansLoc.Member,
      value: EnumUtils.getNumberValue(
        RuntimeGroupMemberType.Member,
        RuntimeGroupMemberType
      ).toString(),
    },
  ];

  const languageOptions: IDropdownOption[] = Localizer.validLocales.map(
    (vl) => {
      const option: IDropdownOption = {
        value: vl.name,
        label: Localizer.Languages[vl.locKey],
      };

      return option;
    }
  );

  if (globalState.loaded && clan?.group && !isFounder) {
    history.push(RouteHelper.NewClanSettings({ clanId: clanId }).url);

    return null;
  }

  return (
    <SettingsWrapper>
      {clan && (
        <Formik
          initialValues={{
            allowAdminsInvite: clan.group?.features?.invitePermissionOverride,
            allowAdminsCulture:
              clan.group?.features?.updateCulturePermissionOverride,
            allowAdminsBanner:
              clan.group?.features?.updateBannerPermissionOverride,
            guideLevel: EnumUtils.getNumberValue(
              clan.group.features.hostGuidedGamePermissionOverride,
              HostGuidedGamesPermissionLevel
            ).toString(),
            membershipOption: EnumUtils.getNumberValue(
              clan.group.membershipOption,
              MembershipOption
            ).toString(),
            memberLevel: EnumUtils.getNumberValue(
              clan.group.features.joinLevel,
              RuntimeGroupMemberType
            ).toString(),
            languageOptions: clan.group.locale,
          }}
          onSubmit={(values, { setSubmitting }) => {
            editGeneralSettings(values);
          }}
        >
          {(formikProps) => {
            return (
              <Form>
                <h3>{clansLoc.GeneralSettings}</h3>
                <div className={styles.checkboxesContainer}>
                  <div className={styles.containerCheckbox}>
                    <Field
                      type={"checkbox"}
                      name={"allowAdminsInvite"}
                      id={"checkAllowAdminsInvite"}
                    />
                    <label htmlFor={"checkAllowAdminsInvite"}>
                      <FaRegCheckSquare className={styles.checked} />
                      <FaRegSquare />
                      {clansLoc.AllowAdminsToInvitePeople}
                    </label>
                  </div>
                  <div className={styles.containerCheckbox}>
                    <Field
                      type={"checkbox"}
                      name={"allowAdminsCulture"}
                      id={"checkboxAllowAdminsCulture"}
                    />
                    <label htmlFor={"checkboxAllowAdminsCulture"}>
                      <FaRegCheckSquare className={styles.checked} />
                      <FaRegSquare />
                      {clansLoc.AllowAdminsToEditCulture}
                    </label>
                  </div>
                  <div className={styles.containerCheckbox}>
                    <Field
                      type={"checkbox"}
                      name={"allowAdminsBanner"}
                      id={"checkboxAllowAdminsBanner"}
                    />
                    <label htmlFor="checkboxAllowAdminsBanner">
                      <FaRegCheckSquare className={styles.checked} />
                      <FaRegSquare />
                      {clansLoc.AllowAdminsToEditBanner}
                    </label>
                  </div>
                </div>

                <div className={styles.memberOptions}>
                  <h4>{clansLoc.ClanJoinOptions}</h4>
                  <FormikSelect
                    name={"membershipOption"}
                    options={membershipOptions}
                    selectedValue={formikProps.values.membershipOption}
                    onChange={(value) => {
                      formikProps.setFieldValue("membershipOption", value);
                    }}
                  />
                  <h4>{clansLoc.LevelToAllowGuidedGames}</h4>
                  <FormikSelect
                    name={"guideLevel"}
                    options={guideLevelOptions}
                    selectedValue={formikProps.values.guideLevel}
                    onChange={(value) => {
                      formikProps.setFieldValue("guideLevel", value);
                    }}
                  />
                  <h4>{clansLoc.NewMemberLevel}</h4>
                  <FormikSelect
                    name={"memberLevel"}
                    options={memberLevelOptions}
                    selectedValue={formikProps.values.memberLevel}
                    onChange={(value) => {
                      formikProps.setFieldValue("memberLevel", value);
                    }}
                  />
                  <h4>{clansLoc.ClanLanguage}</h4>
                  <FormikSelect
                    name={"languageOptions"}
                    options={languageOptions}
                    selectedValue={formikProps.values.languageOptions}
                    onChange={(value) => {
                      formikProps.setFieldValue("languageOptions", value);
                    }}
                  />
                </div>
                <Button buttonType={"gold"} submit={true}>
                  {Localizer.Actions.Save}
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </SettingsWrapper>
  );
};
