// Created by atseng, 2019
// Copyright Bungie, Inc.

import { EnumUtils } from "@Utilities/EnumUtils";
import * as React from "react";
import styles from "./DestinyPlatformSelector.module.scss";
import { User, CrossSave } from "@Platform";
import { IDropdownOption, Dropdown } from "@UI/UIKit/Forms/Dropdown";
import { Localizer } from "@Global/Localization/Localizer";
import { BungieMembershipType } from "@Enum";

// Required props
interface IDestinyPlatformSelectorProps {
  userMembershipData: User.UserMembershipData;
  onChange: (value: string) => void;
  defaultValue: BungieMembershipType;
  crossSavePairingStatus: CrossSave.CrossSavePairingStatus;
}

// Default props - these will have values set in DestinyPlatformSelector.defaultProps
interface DefaultProps {}

type Props = IDestinyPlatformSelectorProps & DefaultProps;

interface IDestinyPlatformSelectorState {
  selectedValue: string;
}

/**
 * DestinyPlatformSelector - a dropdown for users destiny memberships
 *  *
 * @param {IDestinyPlatformSelectorProps} props
 * @returns
 */
export class DestinyPlatformSelector extends React.Component<
  Props,
  IDestinyPlatformSelectorState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedValue: EnumUtils.getStringValue(
        this.props.defaultValue,
        BungieMembershipType
      ),
    };
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    // if cross saved only show the cross saved one
    const crossSavePlatform =
      typeof this.props.crossSavePairingStatus !== "undefined" &&
      typeof this.props.userMembershipData.destinyMemberships.find(
        (value) =>
          value.membershipType ===
          this.props.crossSavePairingStatus.primaryMembershipType
      ) !== "undefined"
        ? this.props.userMembershipData.destinyMemberships.find(
            (value) =>
              value.membershipType ===
              this.props.crossSavePairingStatus.primaryMembershipType
          )
        : null;

    const platformOptions: IDropdownOption[] =
      crossSavePlatform !== null
        ? [
            {
              iconPath: crossSavePlatform.iconPath,
              label: `${crossSavePlatform.displayName} : ${
                Localizer.Platforms[
                  EnumUtils.getStringValue(
                    crossSavePlatform.membershipType,
                    BungieMembershipType
                  )
                ]
              }`,
              value: EnumUtils.getStringValue(
                crossSavePlatform.membershipType,
                BungieMembershipType
              ),
            },
          ]
        : this.props.userMembershipData.destinyMemberships.map((value) => {
            const bMembershipTypeString = EnumUtils.getStringValue(
              value.membershipType,
              BungieMembershipType
            );

            return {
              iconPath: value.iconPath,
              label: `${value.displayName} : ${Localizer.Platforms[bMembershipTypeString]}`,
              value: bMembershipTypeString,
            };
          });

    return (
      <Dropdown
        className={styles.platformDropdown}
        onChange={(newValue: string) => this.onDropdownChange(newValue)}
        options={platformOptions}
        selectedValue={this.state.selectedValue}
      />
    );
  }

  private onDropdownChange(newValue: string) {
    this.props.onChange(newValue);

    this.setState({
      selectedValue: newValue,
    });
  }
}
