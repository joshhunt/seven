// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ApplicationApiKeys } from "@Areas/Application/Shared/ApplicationApiKeys";
import styles from "@Areas/Application/Shared/ApplicationCreate.module.scss";
import { ApplicationScopesHelper } from "@Areas/Application/Shared/ApplicationScopes";
import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  AclEnum,
  ApplicationStatus,
  DeveloperRole,
  OAuthApplicationType,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { yupResolver } from "@hookform/resolvers/yup";
import { Applications, Platform } from "@Platform";
import { HiExternalLink } from "@react-icons/all-files/hi/HiExternalLink";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { ReactHookFormCheckbox } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormCheckbox";
import { ReactHookFormSelect } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormSelect";
import { ReactHookFormTextInput } from "@UIKit/Forms/ReactHookFormForms/ReactHookFormTextInput";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useMemo, useRef, useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useHistory } from "react-router";
import * as Yup from "yup";

interface ApplicationReactHookFormFormProps {
  app?: Applications.Application;
}

export const ApplicationReactHookFormForm: React.FC<ApplicationReactHookFormFormProps> = (
  props
) => {
  const applicationLoc = Localizer.Application;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn = UserUtils.isAuthenticated(globalState);
  const userAppRole = props.app?.team?.find(
    (m) => m.user?.membershipId === globalState.loggedInUser?.user?.membershipId
  );
  const isAppTeamMember =
    userAppRole && userAppRole.role === DeveloperRole.TeamMember;
  const isAppOwner = userAppRole && userAppRole.role === DeveloperRole.Owner;

  const hasPermissionToChange =
    !props.app ||
    (props.app &&
      !!(
        (isLoggedIn && isAppOwner) ||
        globalState?.loggedInUser?.userAcls?.find(
          (ac) => ac === AclEnum.BNextApplicationSupervision
        )
      ));
  const hasElevatedReadPermission = isAppTeamMember || hasPermissionToChange;

  const openAuthEnabled = ConfigUtils.SystemStatus(
    SystemNames.OpenAuthentication
  );
  const oAuthTypeEnabled = ConfigUtils.SystemStatus(SystemNames.OAuthType);
  const corsSupportEnabled = ConfigUtils.SystemStatus(
    SystemNames.ApplicationCorsSupport
  );
  const { current: allowedOAuthApplicationTypes } = useRef(
    EnumUtils.getStringKeys(OAuthApplicationType).filter((t) => {
      return !oAuthTypeEnabled
        ? t ===
            EnumUtils.getStringValue(
              OAuthApplicationType.None,
              OAuthApplicationType
            )
        : t;
    })
  );

  const initialAppScopesValues = useMemo(
    () => ApplicationScopesHelper.getInitialAppScopeValues(props.app),
    [props.app]
  );
  const applicationScopeStringValues = useMemo(
    () => ApplicationScopesHelper.applicationScopesStringValues,
    []
  );

  const initialValues = {
    name: props.app?.name ?? "",
    redirectUrl: props.app?.redirectUrl ?? "",
    agreedToCurrentEula: !!props.app,
    link: props.app?.link ?? "",
    origin: props.app?.origin ?? "",
    applicationType: EnumUtils.getNumberValue(
      props.app?.applicationType ?? OAuthApplicationType.None,
      OAuthApplicationType
    ).toString(),
    ...initialAppScopesValues,
    status: EnumUtils.getNumberValue(
      props.app?.status ?? ApplicationStatus.None,
      ApplicationStatus
    ).toString(),
  };

  const nameMaxLength = 50;
  const maxLength200 = 200;

  // Allow specific characters. Omits Japanese and other interesting characters
  const nameValidationRegex = /^[A-Za-z0-9\u0020\u00C0-\u017E!@#$%^*\(\)\-_+=';:,\.]*$/;
  // Disallows specific troublesome characters, allows most everything else
  const originValidationRegex = /^[A-Za-z+.\-*_~:\d/,%]*$/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .nullable()
      .required(applicationLoc.CannotBeBlank)
      .matches(nameValidationRegex, applicationLoc.InvalidNameMessage)
      .min(1)
      .max(
        nameMaxLength,
        Localizer.Format(applicationLoc.MustBeLengthCharacters, {
          length: nameMaxLength,
        })
      ),
    link: Yup.string()
      .nullable()
      .url(applicationLoc.WebsiteUrlNotValid)
      .max(
        maxLength200,
        Localizer.Format(applicationLoc.MustBeLengthCharacters, {
          length: maxLength200,
        })
      ),
    redirectUrl: Yup.string()
      .nullable()
      .url(applicationLoc.RedirectUrlNotValid)
      .max(
        maxLength200,
        Localizer.Format(applicationLoc.MustBeLengthCharacters, {
          length: maxLength200,
        })
      ),
    origin: Yup.string()
      .nullable()
      .matches(originValidationRegex, applicationLoc.InvalidOriginMessage)
      .max(
        maxLength200,
        Localizer.Format(applicationLoc.MustBeLengthCharacters, {
          length: maxLength200,
        })
      ),
  });

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { ...(initialValues as any) },
  });

  //these values do not map to ApplicationStatus enum because there are unused values
  const statusOptions: IDropdownOption[] = [
    {
      label: applicationLoc.ApplicationStatusPrivate,
      value: EnumUtils.getNumberValue(
        ApplicationStatus.Private,
        ApplicationStatus
      ).toString(),
    },
    {
      label: applicationLoc.ApplicationStatusPublic,
      value: EnumUtils.getNumberValue(
        ApplicationStatus.Public,
        ApplicationStatus
      ).toString(),
    },
    {
      label: applicationLoc.ApplicationStatusDisabled,
      value: EnumUtils.getNumberValue(
        ApplicationStatus.Disabled,
        ApplicationStatus
      ).toString(),
    },
  ];

  const createApplication = (values: FieldValues) => {
    const input: Applications.CreateApplicationAction = {
      name: values.name,
      redirectUrl: values.redirectUrl,
      link: values.link,
      scope: ApplicationUtils.getScope(values).toString(),
      origin: values.origin,
      agreedToCurrentEula: true,
      applicationType:
        OAuthApplicationType[
          values.applicationType as keyof typeof OAuthApplicationType
        ],
    };

    Platform.ApplicationService.CreateApplication(input)
      .then((result) => {
        //redirect to new app details
        history.push(
          RouteHelper.ApplicationDetail({ appId: result.toString() }).url
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      })
      .finally(() => setIsSubmitting(false));
  };

  const editApplication = (values: FieldValues) => {
    const input: Applications.EditApplicationAction = {
      name: values.name,
      redirectUrl: values.redirectUrl,
      link: values.link,
      scope: ApplicationUtils.getScope(values).toString(),
      origin: values.origin,
      applicationType:
        OAuthApplicationType[
          values.applicationType as keyof typeof OAuthApplicationType
        ],
      status:
        ApplicationStatus[values.status as keyof typeof ApplicationStatus],
    };

    Platform.ApplicationService.EditApplication(input, props.app?.applicationId)
      .then((result) => {
        //show a success modal
        Modal.open(<p>{applicationLoc.ChangesSaved}</p>);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      })
      .finally(() => setIsSubmitting(false));
  };

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setIsSubmitting(true);
    props.app ? editApplication(data) : createApplication(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className={styles.form}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <div className={styles.formGroup}>
          <ReactHookFormTextInput
            control={formMethods.control}
            name={"name"}
            placeholder={applicationLoc.NamePlaceholder}
            label={applicationLoc.NamePrompt}
            disabled={!hasPermissionToChange}
            classes={{
              container: styles.formInput,
              inputWrapper: styles.formInputWrapper,
              error: styles.errorInput,
            }}
          />
          {props.app && (
            <div className={styles.formInput}>
              {hasPermissionToChange ? (
                <ReactHookFormSelect
                  className={styles.selectWrapper}
                  label={applicationLoc.ApplicationStatus}
                  name={"status"}
                  control={formMethods.control}
                  options={statusOptions}
                  onChange={(value) => {
                    formMethods.setValue("status", value, {
                      shouldValidate: true,
                    });
                  }}
                />
              ) : (
                <>
                  {props.app?.status && (
                    <div className={styles.noInputText}>
                      <div className={styles.noInputTextLabel}>
                        {applicationLoc.ApplicationStatus}
                      </div>
                      {ApplicationUtils.statusFormat(props.app)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {hasPermissionToChange ? (
            <ReactHookFormTextInput
              control={formMethods.control}
              classes={{
                container: styles.formInput,
                inputWrapper: styles.formInputWrapper,
                error: styles.errorInput,
              }}
              name={"link"}
              placeholder={applicationLoc.LinkPlaceholder}
              label={applicationLoc.LinkPrompt}
            />
          ) : (
            <>
              {props.app?.link && (
                <div className={styles.formInput}>
                  {props.app?.link && (
                    <div className={styles.noInputText}>
                      <div className={styles.noInputTextLabel}>
                        {applicationLoc.LinkPrompt}
                      </div>
                      {props.app?.link}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {props.app && hasElevatedReadPermission && (
          <div className={styles.formGroup}>
            <ApplicationApiKeys
              app={props.app}
              hasWritePermission={hasPermissionToChange}
            />
          </div>
        )}
        {hasPermissionToChange && (
          <>
            {openAuthEnabled && (
              <div className={styles.formGroup}>
                <h3>{applicationLoc.AppAuthentication}</h3>
                <div className={styles.formInput}>
                  <ReactHookFormSelect
                    className={styles.selectWrapper}
                    label={applicationLoc.ApplicationTypeLabel}
                    name={"applicationType"}
                    control={formMethods.control}
                    options={allowedOAuthApplicationTypes.map((k, index) => {
                      return {
                        label: applicationLoc[`ApplicationType${k.toString()}`],
                        value: EnumUtils.getNumberValue(
                          OAuthApplicationType[
                            k as keyof typeof OAuthApplicationType
                          ],
                          OAuthApplicationType
                        ).toString(),
                      };
                    })}
                    onChange={(value) => {
                      formMethods.setValue("applicationType", value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
                <ReactHookFormTextInput
                  control={formMethods.control}
                  classes={{
                    container: styles.formInput,
                    inputWrapper: styles.formInputWrapper,
                    error: styles.errorInput,
                  }}
                  name={"redirectUrl"}
                  textInputTypeAttribute={"url"}
                  placeholder={applicationLoc.RedirectPlaceholder}
                  label={applicationLoc.RediretUrlPrompt}
                />
                <h4>{applicationLoc.ScopePrompt}</h4>
                <p>{applicationLoc.ScopeSummary}</p>
                <div className={styles.formInput}>
                  {applicationScopeStringValues?.map((s) => {
                    return (
                      <ReactHookFormCheckbox
                        key={s.name.toString()}
                        control={formMethods.control}
                        classes={{ labelAndCheckbox: styles.checkboxLabel }}
                        label={applicationLoc[s.name]}
                        name={s.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {corsSupportEnabled && (
              <div className={styles.formGroup}>
                <h3>{applicationLoc.BrowserBasedApps}</h3>
                <ReactHookFormTextInput
                  classes={{
                    container: styles.formInput,
                    inputWrapper: styles.formInputWrapper,
                    error: styles.errorInput,
                  }}
                  control={formMethods.control}
                  name={"origin"}
                  textInputTypeAttribute={"url"}
                  placeholder={applicationLoc.OriginPlaceholder}
                  label={applicationLoc.OriginPrompt}
                />
              </div>
            )}
            <div className={styles.ack}>
              <ReactHookFormCheckbox
                classes={{
                  labelAndCheckbox: styles.checkboxLabel,
                  label: styles.ackLabel,
                }}
                label={applicationLoc.AgreeToTOU}
                name={"agreedToCurrentEula"}
                control={formMethods.control}
              />
              <Anchor url={RouteHelper.LegalTermsOfUse()}>
                <HiExternalLink />
              </Anchor>
            </div>
            <div className={styles.button}>
              <Button
                buttonType={"gold"}
                submit={true}
                disabled={
                  isSubmitting ||
                  !formMethods.watch("agreedToCurrentEula") ||
                  formMethods.formState.isSubmitting
                }
              >
                {props.app ? applicationLoc.SaveButton : applicationLoc.Create}
              </Button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  );
};
