// Created by atseng, 2019
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { Platform, User } from "@Platform";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import styles from "./DestinyPlatformSelector.module.scss";

// Required props
interface IDestinyPlatformSelectorProps {
  userMembershipData: User.UserMembershipData;
  onChange: (value: string) => void;
  defaultValue: BungieMembershipType;
  selectedValue?: BungieMembershipType;
  isViewingOthers?: boolean;
  showCrossSaveBanner?: boolean;
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
        this.props.selectedValue ?? this.props.defaultValue,
        BungieMembershipType
      ),
      credentialNameMap: null,
    };
  }

  public static defaultProps: DefaultProps = {};

  private readonly getSanitizedNames = () => {
    Platform.UserService.GetSanitizedPlatformDisplayNames(
      this.props.userMembershipData?.bungieNetUser?.membershipId ??
        this.props.userMembershipData?.destinyMemberships?.[0]?.membershipId
    ).then((names) =>
      this.setState({
        credentialNameMap: UserUtils.getStringKeyedMapForSanitizedCredentialNames(
          names
        ),
      })
    );
  };

  private readonly getLoggedInCredential = () => {
    //only for non-crosssaved accounts
    if (
      !this.props.isViewingOthers &&
      !this.props.userMembershipData?.primaryMembershipId
    ) {
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
    }
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

    if (
      nextProps.selectedValue &&
      nextProps.selectedValue !== this.props.selectedValue
    ) {
      this.setState({
        selectedValue: EnumUtils.getStringValue(
          nextProps.selectedValue,
          BungieMembershipType
        ),
      });
    }

    return true;
  }

  public render() {
    const crossSavePlatform = this.props.userMembershipData?.destinyMemberships?.find(
      (dm) =>
        dm.membershipId === this.props.userMembershipData?.primaryMembershipId
    );

    // if cross saved only show the cross saved one
    const platformOptions: IDropdownOption[] = crossSavePlatform
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
      : this.props.userMembershipData.destinyMemberships
          .filter(
            (dm) => dm.membershipType !== BungieMembershipType.TigerStadia
          )
          .map((value) => {
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

    return !!crossSavePlatform && this.props.showCrossSaveBanner ? (
      <div className={styles.crossSaveBanner}>
        {Localizer.Profile.Crosssave}
      </div>
    ) : (
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
