// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Localizer } from "@Global/Localizer";
import { CodesDataStore, ICodesState } from "../CodesDataStore";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import { CrossSave } from "@Platform";
import { DataStore, DestroyCallback } from "@Global/DataStore";
import { BungieMembershipType } from "@Enum";

interface ICodesPlatformSelectModalProps {
  twoLineItem: React.ReactElement;
  crossSaveStatus: CrossSave.CrossSavePairingStatus;
}

interface ICodesPlatformSelectModalState {
  CodesDataStorePayload: ICodesState;
}

/**
 * CodesPlatformSelectModal - Replace this description
 *  *
 * @param {ICodesPlatformSelectModalProps} props
 * @returns
 */
export default class CodesPlatformSelectModal extends React.Component<
  ICodesPlatformSelectModalProps,
  ICodesPlatformSelectModalState
> {
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICodesPlatformSelectModalProps) {
    super(props);

    this.state = {
      CodesDataStorePayload: CodesDataStore.state,
    };
  }

  public componentDidMount() {
    this.subs.push(
      CodesDataStore.observe(
        (data) => {
          data &&
            this.setState({
              CodesDataStorePayload: data,
            });
        },
        null,
        true
      )
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  private readonly updatePlatform = (selectedPlatform) => {
    const codesDataStoreCopy = this.state.CodesDataStorePayload;
    codesDataStoreCopy.selectedPlatform = selectedPlatform;

    CodesDataStore.update(codesDataStoreCopy);
  };

  private readonly convertPlatformsToOptions = (
    platforms: BungieMembershipType[]
  ) => {
    const platformOptions: IDropdownOption[] = platforms.map((value) => {
      const platformEnumNumeralAsString = isNaN(value)
        ? BungieMembershipType[value].toString()
        : value.toString();

      return {
        label: Localizer.Platforms[BungieMembershipType[value].toString()],
        value: platformEnumNumeralAsString,
      };
    });

    return platformOptions;
  };

  public render() {
    const platforms = this.state.CodesDataStorePayload.userPlatforms;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.props.twoLineItem && this.props.twoLineItem}
        <p>{Localizer.UserPages.SelectWhichPlatformToApply}</p>
        <Dropdown
          options={this.convertPlatformsToOptions(platforms)}
          onChange={(value) => {
            this.updatePlatform(BungieMembershipType[value]);
          }}
        />
      </div>
    );
  }
}
