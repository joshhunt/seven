import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import styles from "./Shared/ClanSettings.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import { FormikTextArea } from "@UIKit/Forms/FormikForms/FormikTextArea";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import classNames from "classnames";
import { Form, Formik, FormikValues } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import * as Yup from "yup";

export const CultureFields: React.FC = () => {
  const params = useParams<IClanParams>();
  const history = useHistory();
  const [nonMemberClan, setNonMemberClan] = useState<GroupsV2.GroupResponse>();
  const clansLoc = Localizer.Clans;
  const aboutMaxLength = 1000;

  const clanId = params?.clanId ?? "0";

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const isBnetAdmin = ClanUtils.isBnetAdmin(globalState.loggedInUser);

  const clan = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === clanId
  );
  const canEditFields = ClanUtils.canEditClanCulture(
    clan,
    globalState?.loggedInUser
  );

  useEffect(() => {
    if (!isBnetAdmin) {
      return;
    }
    Platform.GroupV2Service.GetGroup(clanId).then(setNonMemberClan);
  }, [isBnetAdmin]);

  const trySaveSettings = (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const groupEditAction: GroupsV2.GroupEditAction = {
      name: values.clanName,
      motto: values.motto,
      about: values.about,
      callsign: values.callSign,
      theme: null,
      tags: null,
      locale: null,
    };

    setTimeout(() => {
      setSubmitting(false);
    }, 5000);

    Platform.GroupV2Service.EditGroup(groupEditAction, clanId)
      .then((result) => {
        Modal.open(<p>{clansLoc.ChangesHaveBeenSuccessfully}</p>);

        GlobalStateDataStore.actions.refreshLoggedInUserClans();

        setSubmitting(false);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  if (globalState.loaded && !canEditFields) {
    history.push(RouteHelper.NewClanSettings({ clanId: clanId }).url);

    return null;
  }

  const clanNameLength = 25;
  const clanCallSignLength = 4;
  const clanMottoLength = 100;

  return (
    <SettingsWrapper>
      {((isBnetAdmin && nonMemberClan) || clan) && ( //clan comes from the loggedInUser clans list, a non-member bnet admin will not have this
        <Formik
          initialValues={{
            clanName: clan?.group?.name ?? nonMemberClan?.detail?.name,
            callSign:
              clan?.group?.clanInfo?.clanCallsign ??
              nonMemberClan?.detail?.clanInfo?.clanCallsign,
            motto: clan?.group?.motto ?? nonMemberClan?.detail?.motto,
            about: clan?.group?.about ?? nonMemberClan?.detail?.about,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            clanName: Yup.string()
              .nullable()
              .required("Required")
              .min(3)
              .max(
                clanNameLength,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: clanNameLength,
                })
              ),
            callSign: Yup.string()
              .nullable()
              .required("Required")
              .max(
                clanCallSignLength,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: clanCallSignLength,
                })
              ),
            motto: Yup.string()
              .nullable()
              .required("Required")
              .max(
                clanMottoLength,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: clanMottoLength,
                })
              ),
            about: Yup.string()
              .nullable()
              .required("Required")
              .max(
                aboutMaxLength,
                Localizer.Format(clansLoc.MustBeLengthCharacters, {
                  length: aboutMaxLength,
                })
              ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            trySaveSettings(values, setSubmitting);
          }}
        >
          {(formikProps) => {
            return (
              <Form className={styles.clanSettingsForm}>
                <div className={classNames(styles.title, styles.section)}>
                  <h6 className={styles.sectionHeader}>{clansLoc.ClanName}</h6>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <FormikTextInput name={"clanName"} type={"text"} />
                    <FaTimes
                      onClick={() => formikProps.setFieldValue("clanName", "")}
                    />
                  </div>
                </div>
                <div className={classNames(styles.title, styles.section)}>
                  <h6 className={styles.sectionHeader}>{clansLoc.ClanId}</h6>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <FormikTextInput name={"callSign"} type={"text"} />
                    <FaTimes
                      onClick={() => formikProps.setFieldValue("callSign", "")}
                    />
                  </div>
                </div>
                <div className={classNames(styles.title, styles.section)}>
                  <h6 className={styles.sectionHeader}>{clansLoc.ClanMotto}</h6>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <FormikTextInput name={"motto"} type={"text"} />
                    <FaTimes
                      onClick={() => formikProps.setFieldValue("motto", "")}
                    />
                  </div>
                </div>
                <div className={classNames(styles.title, styles.section)}>
                  <h6 className={styles.sectionHeader}>{clansLoc.AboutUs}</h6>
                  <FormikTextArea
                    name={"about"}
                    placeholder={formikProps.values?.about}
                    className={styles.textArea}
                    rows={9}
                    cols={58}
                    maxLength={aboutMaxLength}
                  />
                </div>
                <Button
                  submit={true}
                  buttonType={formikProps.isSubmitting ? "disabled" : "gold"}
                >
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
