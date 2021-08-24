// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ResponsiveSize } from "@bungie/responsive";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { ISubNavClasses, ISubNavLink, SubNav } from "@UI/UIKit/Controls/SubNav";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { StringCompareOptions, StringUtils } from "@Utilities/StringUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";

export interface TabData {
  tabLabel: string;
  tabRender?: (label: string) => React.ReactNode;
  tabTo: IMultiSiteLink;
  contentComponent: React.ReactNode;
  pathName: string;
}

export interface TabSystemClasses extends ISubNavClasses {
  list?: string;
  container?: string;
  contentContainer?: string;
}

export interface TabSystemProps extends RouteComponentProps<any> {
  tabDataArray: TabData[];
  tabClasses?: TabSystemClasses;
  /**
   * If provided, this will render if none of the paths in the tabs are matched
   */
  defaultRouteComponent?: React.ReactNode;
  mobileDropdownBreakpoint?: ResponsiveSize | "none";
  /**
   * If true, this will render only the tabs section
   */
  tabsOnly?: boolean;
  /**
   * If true, this will render only the content
   */
  contentOnly?: boolean;

  verticalTabs?: boolean;
}

interface TabSystemState {
  /*	currentTab: TabData;*/
}

class TabSystemInner extends React.Component<TabSystemProps, TabSystemState> {
  constructor(props: TabSystemProps) {
    super(props);
  }

  public render() {
    const {
      tabDataArray,
      tabClasses,
      mobileDropdownBreakpoint,
      children,
      defaultRouteComponent,
      history,
    } = this.props;

    const routes = tabDataArray.filter((td) => !!td.pathName);

    const subNavLinks: ISubNavLink[] = tabDataArray.map((td) => {
      const tabPath = UrlUtils.getHrefAsLocation(td.tabTo?.url)?.pathname;
      const pathMatches = StringUtils.equals(
        tabPath,
        history.location.pathname,
        StringCompareOptions.IgnoreCase
      );

      return {
        label: td?.tabLabel,
        to: td?.tabTo,
        current: pathMatches,
        render: td.tabRender,
      };
    });

    return (
      <InnerErrorBoundary>
        <div className={tabClasses?.container}>
          <Grid className={tabClasses?.list}>
            <GridCol cols={12}>
              <SubNav
                history={this.props.history}
                links={subNavLinks}
                vertical={true}
                classes={tabClasses}
                mobileDropdownBreakpoint={mobileDropdownBreakpoint}
              />
            </GridCol>
          </Grid>
          <Grid className={tabClasses?.contentContainer}>
            <GridCol cols={12}>
              {children}
              <AnimatedRouter>
                {routes
                  .filter((r) => !!r.pathName)
                  .map((td, i) => {
                    return (
                      <Route key={i} path={td.pathName}>
                        {td.contentComponent}
                      </Route>
                    );
                  })}
                {defaultRouteComponent && (
                  <Route path={"*"}>{defaultRouteComponent}</Route>
                )}
              </AnimatedRouter>
            </GridCol>
          </Grid>
        </div>
      </InnerErrorBoundary>
    );
  }
}

export default withRouter(TabSystemInner);
