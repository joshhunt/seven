// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { DestroyCallback } from "@Global/DataStore";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import {
  DestinyDefinitions,
  ManifestPayload,
  DestinyDefinitionType,
  AllDefinitionsFetcherized,
  IDestinyDefinitionsObserverProps,
} from "./DestinyDefinitions";
import { Localizer } from "@Global/Localizer";
import { ConfirmationModalInline } from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";

interface D2DatabaseComponentState extends ManifestPayload {
  // The first time we receive data, we mark this as true. That way we can reliably know if things are loading or not.
  receivedInitialState: boolean;
}

export interface D2DatabaseComponentProps<T extends DestinyDefinitionType> {
  definitions?: Pick<AllDefinitionsFetcherized, T>;
}

/**
 * Includes access to Destiny definitions in your page.
 * @param BoundComponent The component to add definitions to
 * @param observerProps The info about which definitions you need
 * @param acknowledgeItemDefinitionsAreHeavy Only use this if you know what it does.
 */
export const withDestinyDefinitions = <
  T extends DestinyDefinitionType,
  P extends D2DatabaseComponentProps<T>
>(
  BoundComponent: React.ComponentClass<P> | React.FC<P>,
  observerProps: IDestinyDefinitionsObserverProps<T>,
  acknowledgeItemDefinitionsAreHeavy = false
) => {
  // We only want to allow you to use DestinyInventoryItemDefinition if you know it's enormous. It's usually not a good idea.
  if (
    (observerProps.types as string[]).indexOf(
      "DestinyInventoryItemDefinition"
    ) > -1 &&
    !acknowledgeItemDefinitionsAreHeavy
  ) {
    return class extends React.Component<P, D2DatabaseComponentState> {
      public render() {
        throw new Error(
          "You cannot use DestinyInventoryItemDefinition without acknowledging that you know you are going to force users to download a large file. If you don't KNOW FOR SURE that you need these large files, you should DestinyInventoryItemLiteDefinition instead"
        );

        return null;
      }
    };
  }

  return class extends React.Component<P, D2DatabaseComponentState> {
    private destroyer: DestroyCallback;
    private readonly modalRef = React.createRef<Modal>();

    constructor(props: P) {
      super(props);

      this.state = {
        isLoading: DestinyDefinitions.state.isLoading,
        isLoaded: DestinyDefinitions.state.isLoaded,
        receivedInitialState: false,
      };
    }

    public componentDidMount() {
      const loadedDefinitions = Object.keys(DestinyDefinitions.definitions);

      const needsDefs = observerProps.types.some(
        (defType) => loadedDefinitions.indexOf(defType) < 0
      );

      if (!needsDefs) {
        this.setState({
          isLoaded: true,
          isLoading: false,
          receivedInitialState: true,
        });

        return;
      }

      this.destroyer = DestinyDefinitions.observe(
        (data) => {
          this.setState({
            ...data,
            receivedInitialState: true,
          });
        },
        observerProps,
        true
      );
    }

    public componentWillUnmount() {
      if (this.destroyer) {
        this.destroyer();
      }
    }

    public render() {
      // If we encounter any errors, we'll show this modal which will let users hit the DestinyDefinitions.scorchedEarth() function (deletes the databases and attempts to redownload stuff).
      if (this.state.hasError) {
        const label = Localizer.FormatReact(
          Localizer.Destiny.DestinyDefinitionLoadIssue,
          {
            helpForumLink: (
              <Anchor url={RouteHelper.Forums({ tg: "Help" })}>
                {Localizer.Destiny.HelpForumLinkLabel}
              </Anchor>
            ),
          }
        );

        return (
          <ConfirmationModalInline
            open={true}
            preventUserClose={true}
            modalRef={this.modalRef}
            type={"warning"}
            confirmButtonProps={{
              labelOverride: Localizer.Destiny.DestinyDefinitionsErrorRetry,
              onClick: () => {
                DestinyDefinitions.scorchedEarth();

                return true;
              },
            }}
            cancelButtonProps={{
              disable: true,
            }}
          >
            {label}
          </ConfirmationModalInline>
        );
      }

      // Loading is handled by AppLayout.tsx, which subscribes to DestinyDefinitions and shows a loader if any of them are loading.
      // This is because we don't want to show multiple loaders if more than one component is waiting for definitions
      if (this.state.isLoading || !this.state.receivedInitialState) {
        return null;
      }

      return (
        <BoundComponent
          {...this.props}
          definitions={DestinyDefinitions.definitions}
        />
      );
    }
  };
};
