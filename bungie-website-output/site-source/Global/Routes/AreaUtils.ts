import { DetailedError } from "@CustomErrors";
import { ActionRoute } from "@Routes/ActionRoute";
import { StringCompareOptions, StringUtils } from "@Utilities/StringUtils";

export class AreaUtils {
  public static getAction(
    areaName: string,
    actionRoutes: ActionRoute[],
    actionName = "Index"
  ): ActionRoute {
    const matchingAction = actionRoutes.find((route) =>
      StringUtils.equals(
        route.action,
        actionName,
        StringCompareOptions.IgnoreCase
      )
    );
    if (matchingAction) {
      return matchingAction;
    }

    throw new DetailedError(
      "Action Not Found",
      `Action "${actionName}" requested for area "${areaName}", but none was found.`
    );
  }

  public static resolveAction<T = any>(
    areaName: string,
    actionRoutes: ActionRoute[],
    actionName = "Index",
    params?: Pick<T, any>
  ) {
    const action = this.getAction(areaName, actionRoutes, actionName);

    return action.resolve<T>(params);
  }
}
