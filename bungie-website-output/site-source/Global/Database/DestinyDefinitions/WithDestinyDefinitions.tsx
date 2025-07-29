// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { ConfirmationModalInline } from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import React from "react";
import {
  AllDefinitionsFetcherized,
  DestinyDefinitions,
  DestinyDefinitionType,
  IDestinyDefinitionsObserverProps,
  ManifestPayload,
} from "./DestinyDefinitions";
import styles from "./withDestinyDefinitions.module.scss";

interface D2DatabaseComponentState extends ManifestPayload {
  indexedDBNotSupported: boolean;
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
    throw new Error(
      "You cannot use DestinyInventoryItemDefinition without acknowledging that you know you are going to force users to download a large file. If you don't KNOW FOR SURE that you need these large files, you should DestinyInventoryItemLiteDefinition instead"
    );
  }

  return class extends React.Component<P, D2DatabaseComponentState> {
    private destroyer: DestroyCallback;
    private readonly modalRef = React.createRef<Modal>();

    constructor(props: P) {
      super(props);
      this.state = {
        isLoading: true,
        locale: Localizer.CurrentCultureName,
        indexedDBNotSupported: false,
      };
    }

    public componentDidMount() {
      this.checkIndexedDBSupport();
      this.tryRequestDefinitions();
    }

    public componentDidUpdate(
      prevProps: Readonly<P>,
      prevState: Readonly<D2DatabaseComponentState>
    ) {
      if (DestinyDefinitions.state.locale !== this.state.locale) {
        this.setState({
          locale: DestinyDefinitions.state.locale,
        });
      }
      if (
        this.props.definitions !== prevProps.definitions ||
        this.state.locale !== prevState.locale ||
        this.state.indexedDBNotSupported !== prevState.indexedDBNotSupported
      ) {
        this.destroyer?.();
        this.tryRequestDefinitions();
      }
    }

    private tryRequestDefinitions() {
      if (this.state.indexedDBNotSupported) {
        return;
      }
      const needsDefs = observerProps.types.some(
        (type) =>
          !DestinyDefinitions.definitions[type] ||
          this.state.locale !== DestinyDefinitions.state.locale
      );

      if (!needsDefs) {
        this.setState({
          isLoading: false,
        });

        return;
      }

      this.destroyer = DestinyDefinitions.observe(
        (data) => {
          // This callback will run whenever any component that uses DestinyDefinitions needs to load something.
          // To prevent isLoading being set to true when nothing in this instance needs to be loaded the definition list is consulted for missing data
          const isLoading =
            data.isLoading &&
            (observerProps.types.some(
              (type) => !DestinyDefinitions.definitions[type]
            ) ||
              this.state.locale !== DestinyDefinitions.state.locale);
          this.setState({
            isLoading: isLoading,
            hasError: data.hasError,
          });
        },
        observerProps,
        true
      );
    }

    public componentWillUnmount() {
      this.destroyer?.();
    }

    private checkIndexedDBSupport() {
      const request = indexedDB.open("test", 1);
      request.onerror = (e: Event) => {
        Logger.logToServer(
          "Error logged to server: IndexedDB not supported in Firefox privacy/incognito mode",
          RendererLogLevel.Error
        );

        this.setState({
          indexedDBNotSupported: true,
        });
      };
    }

    public render() {
      const { indexedDBNotSupported, hasError, isLoading } = this.state;

      if (indexedDBNotSupported) {
        return (
          <div className={styles.featureIsNotSupported}>
            {Localizer.Errors.ThisFeatureIsNotSupported}
          </div>
        );
      }

      // If we encounter any errors, we'll show this modal which will let users hit the DestinyDefinitions.scorchedEarth() function (deletes the databases and attempts to redownload stuff).
      if (hasError) {
        const label = (
          <>
            {Localizer.FormatReact(
              Localizer.Destiny.DestinyDefinitionLoadIssue,
              {
                helpForumLink: (
                  <Anchor url={RouteHelper.Forums({ tg: "Help" })}>
                    {Localizer.Destiny.HelpForumLinkLabel}
                  </Anchor>
                ),
              }
            )}
          </>
        );

        return (
          <ConfirmationModalInline
            open={true}
            preventUserClose={true}
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
      if (isLoading) {
        return <></>;
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
