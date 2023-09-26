// Created by atseng, 2023
import { ApplicationScopesHelper } from "@Areas/Application/Shared/ApplicationScopes";
import { Localizer } from "@bungie/localization/Localizer";
import {
  AclEnum,
  ApplicationScopes,
  ApplicationStatus,
  DeveloperRole,
} from "@Enum";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { Applications } from "@Platform";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { FormikValues } from "formik";

export interface IApplicationScopeCheckBoxValues {
  name: string;
  value: boolean;
}

export class ApplicationUtils {
  public static getScope = (values: FormikValues): number => {
    const scopeValues = Object.values(
      ApplicationScopesHelper.applicationScopesStringValues
    );

    return scopeValues.reduce((accum, current) => {
      if (
        Object.entries(values).find((k, v) => k[0] === current.name && k[1])
      ) {
        //this needs to be added in
        return (
          accum | EnumUtils.getNumberValue(current.name, ApplicationScopes)
        );
      }

      return accum;
    }, 0);
  };

  public static statusFormat(application: Applications.Application): string {
    const applicationLoc = Localizer.Application;

    switch (application.status) {
      case ApplicationStatus.Blocked:
        return applicationLoc.applicationstatusblocked;
      case ApplicationStatus.Disabled:
        return applicationLoc.applicationstatusdisabled;
      case ApplicationStatus.Private:
        return applicationLoc.applicationstatusprivate;
      case ApplicationStatus.Public:
        return applicationLoc.applicationstatuspublic;
    }

    return "";
  }

  public static userAppRole(
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>,
    app: Applications.Application
  ): Applications.ApplicationDeveloper {
    return app?.team?.find(
      (m) =>
        m.user?.membershipId === globalState.loggedInUser?.user?.membershipId
    );
  }

  public static isAppTeamMember(
    userAppRole: Applications.ApplicationDeveloper,
    app: Applications.Application
  ): boolean {
    return userAppRole && userAppRole.role === DeveloperRole.TeamMember;
  }

  public static isAppOwner(
    userAppRole: Applications.ApplicationDeveloper,
    app: Applications.Application
  ): boolean {
    return userAppRole && userAppRole.role === DeveloperRole.Owner;
  }

  public static hasApplicationSupervisionACL(
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ): boolean {
    return !!globalState?.loggedInUser?.userAcls?.find(
      (ac) => ac === AclEnum.BNextApplicationSupervision
    );
  }

  public static hasElevatedReadPermission(
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>,
    app: Applications.Application
  ): boolean {
    const isLoggedIn = UserUtils.isAuthenticated(globalState);

    return (
      isLoggedIn &&
      app &&
      (this.isAppTeamMember(this.userAppRole(globalState, app), app) ||
        this.hasPermissionToChange(globalState, app))
    );
  }

  public static hasPermissionToChange(
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>,
    app: Applications.Application
  ): boolean {
    const isLoggedIn = UserUtils.isAuthenticated(globalState);

    return (
      isLoggedIn &&
      app &&
      (this.isAppOwner(this.userAppRole(globalState, app), app) ||
        this.hasApplicationSupervisionACL(globalState))
    );
  }

  public static redirectToRazor(subpage: string, appId?: string) {
    return `/${Localizer.CurrentCultureName}/Application/${
      subpage === "Index" ? "" : subpage
    }${`/${appId}`}`;
  }
}
