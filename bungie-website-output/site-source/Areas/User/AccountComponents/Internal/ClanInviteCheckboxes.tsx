// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanInviteDataStore } from "@Areas/User/AccountComponents/DataStores/ClanInviteDataStore";
import styles from "@Areas/User/AccountComponents/Privacy.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { FormikCheckbox } from "@UIKit/Forms/FormikForms/FormikCheckbox";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Platform, User, Contract } from "@Platform";
import { BungieMembershipType } from "@Enum";

interface ClanInviteCheckboxesProps {
  user: Contract.UserDetail;
}

export const ClanInviteCheckboxes: React.FC<ClanInviteCheckboxesProps> = (
  props
) => {
  const [memberships, setMemberships] = useState<BungieMembershipType[]>([]);
  const clanInviteData = useDataStore(ClanInviteDataStore);

  useEffect(() => {
    Platform.UserService.GetMembershipDataForCurrentUser()
      .then((data: User.UserMembershipData) => {
        const membershipArray = data?.destinyMemberships?.map(
          (card) => card?.membershipType
        );
        setMemberships(membershipArray);

        return membershipArray;
      })
      .then((mts) => {
        const promises: Promise<boolean>[] = [];

        mts.forEach((mt) =>
          promises.push(Platform.GroupV2Service.GetUserClanInviteSetting(mt))
        );

        Promise.all(promises)
          .then((values) => {
            /*values is an array of booleans that we want to match back up with the memberships array from above
						the desired output is the initial state of memberships.*/

            const clanSettings: { [p: string]: boolean } = {};

            values.forEach((bool, i) => (clanSettings[mts[i]] = bool));

            ClanInviteDataStore.actions.updateInitialSettings(clanSettings);
            ClanInviteDataStore.actions.updateCurrentSettings(clanSettings);
          })
          .catch((e) => console.error(e));
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }, [props.user]);

  return (
    <div className={classNames(styles.clanInvites, styles.twoLine)}>
      {memberships.map((mt, i) => {
        return (
          <div className={styles.checkbox} key={i}>
            <FormikCheckbox
              name={clanInviteData?.clanInviteSettings?.[mt]?.toString()}
              label={`${Localizer.Format(
                Localizer.Clans.AllowClanInvitationsFor,
                {
                  platform:
                    Localizer.Platforms[
                      EnumUtils.getStringValue(mt, BungieMembershipType)
                    ],
                }
              )}`}
              checked={clanInviteData?.clanInviteSettings?.[mt]}
              value={clanInviteData?.clanInviteSettings?.[mt]?.toString()}
              onChange={(e) => {
                const newSettings = { ...clanInviteData?.clanInviteSettings };
                newSettings[mt] = e.currentTarget.value === "false";
                ClanInviteDataStore.actions.updateCurrentSettings(newSettings);
              }}
              classes={{ input: styles.input, labelAndCheckbox: styles.label }}
            />
          </div>
        );
      })}
    </div>
  );
};
