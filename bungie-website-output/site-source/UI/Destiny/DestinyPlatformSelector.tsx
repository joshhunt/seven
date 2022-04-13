// Created by atseng, 2019
// Copyright Bungie, Inc.

import { EnumUtils } from "@Utilities/EnumUtils";
import * as React from "react";
import { UserUtils } from "../../Utilities/UserUtils";
import styles from "./DestinyPlatformSelector.module.scss";
import { User, CrossSave, Platform } from "@Platform";
import { IDropdownOption, Dropdown } from "@UI/UIKit/Forms/Dropdown";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, BungieMembershipType } from "@Enum";

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
  credentialNameMap: Record<string, string>;
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
      credentialNameMap: null,
    };
  }

  public static defaultProps: DefaultProps = {};

  private readonly getSanitizedNames = () => {
    Platform.UserService.GetSanitizedPlatformDisplayNames(
      this.props.userMembershipData.bungieNetUser.membershipId
    ).then((names) =>
      this.setState({
        credentialNameMap: UserUtils.getStringKeyedMapForSanitizedCredentialNames(
          names
        ),
      })
    );
  };

  private readonly getLoggedInCredential = () => {
    //update the default selected credential to the logged in credential
    Platform.UserService.GetCurrentUserAuthContextState().then((result) => {
      const platform = UserUtils.getMembershipTypeFromCredentialType(
        result.AuthProvider
      );

      if (this.props.defaultValue !== platform) {
        const platformString = EnumUtils.getStringValue(
          platform,
          BungieMembershipType
        );
        this.onDropdownChange(platformString);
      }
    });
  };

  public componentDidMount() {
    this.getLoggedInCredential();
    this.getSanitizedNames();
  }

  public shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<IDestinyPlatformSelectorState>
  ) {
    if (
      nextProps.userMembershipData.bungieNetUser !==
      this.props.userMembershipData.bungieNetUser
    ) {
      this.getSanitizedNames();
    }

    return true;
  }

  public render() {
    const primaryMembershipType =
      this.props.crossSavePairingStatus?.primaryMembershipType ??
      BungieMembershipType.None;
    const crossSavePlatform =
      this.props.userMembershipData.destinyMemberships?.find(
        (v) => v.membershipType === primaryMembershipType
      ) ?? null;

    // if cross saved only show the cross saved one
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
            const bCredentialTypeString = EnumUtils.getStringValue(
              UserUtils.getCredentialTypeFromMembershipType(
                value.membershipType
              ),
              BungieCredentialType
            );
            const sanitizedPlatformName = this.state.credentialNameMap?.[
              bCredentialTypeString
            ];

            return {
              iconPath: value.iconPath,
              label: `${sanitizedPlatformName} : ${Localizer.Platforms[bMembershipTypeString]}`,
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
