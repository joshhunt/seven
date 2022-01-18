// Created by larobinson, 2021
// Copyright Bungie, Inc.
import { Localizer } from "@bungie/localization/Localizer";
import classNames from "classnames";
import { Field, FormikProps, FormikValues } from "formik";
import React, { useEffect, useState } from "react";
import { ConvertToPlatformError } from "../../../../Platform/ApiIntermediary";
import { Platform, User } from "../../../../Platform/BnetPlatform.TSClient";
import { Modal } from "../../../../UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "../../../../UI/UIKit/Controls/Spinner";
import { GridCol } from "../../../../UI/UIKit/Layout/Grid/Grid";
import styles from "../IdentitySettings.module.scss";
import { IdentityPagination } from "./IdentityPagination";

interface IAvatarArrayValue {
  id: number;
  value: string;
}

interface AvatarsProps {
  user: User.GeneralUser;
  formikProps: FormikProps<FormikValues>;
}

export const Avatars: React.FC<AvatarsProps> = ({ user, formikProps }) => {
  const [avatars, setAvatars] = useState<IAvatarArrayValue[]>([]);
  const avatarsPerPage = 48;
  const [avatarOffset, setAvatarOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAvatarPageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * avatarsPerPage);
    setAvatarOffset(newOffset);
  };

  const loadAvatars = () => {
    setLoading(true);
    Platform.UserService.GetAvailableAvatars()
      .then((data) => {
        // We want to show the newest avatars first, the data comes in with oldest first

        const avatarsNewToOld: IAvatarArrayValue[] = [];
        let avatarIndex = 0;
        // Format of data is {number: string} in order to be able to do pagination math with the indices of the avatar data,
        //I convert it to an array of ids and value pairs like so {id: number, value: string}[]
        Object.keys(data)
          .reverse()
          .forEach((key, i) => {
            const initialProfilePicture =
              user?.profilePicture === 0 ? 70432 : user?.profilePicture;
            if (Number(key) === initialProfilePicture) {
              avatarIndex = i;
            }
            avatarsNewToOld[i] = { id: Number(key), value: data[Number(key)] };
          });
        setAvatars(avatarsNewToOld);

        handleAvatarPageChange({
          selected: Math.floor(avatarIndex / avatarsPerPage),
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAvatars();
  }, [user]);

  return (
    <>
      <GridCol cols={2} medium={12} className={styles.sectionTitle}>
        {Localizer.Userpages.Avatar}
      </GridCol>
      <GridCol cols={10} medium={12} className={styles.paginatedContent}>
        <SpinnerContainer loading={loading}>
          {avatars
            .slice(avatarOffset, avatarOffset + avatarsPerPage)
            .map((av, i) => {
              return (
                <label
                  key={i}
                  className={classNames({ [styles.hideWhileLoading]: loading })}
                >
                  <Field
                    type="radio"
                    name={"profilePicture"}
                    value={av.id}
                    onChange={(e: React.ChangeEvent<any>) => {
                      // Radio type fields will, by default, convert the value to a string, this maintains the stored value as a number
                      formikProps.handleChange(e);
                      formikProps.setFieldValue(
                        "profilePicture",
                        Number(e.target.value)
                      );
                    }}
                  />
                  <img
                    src={av.value}
                    className={classNames(styles.avatar, {
                      [styles.selected]:
                        av.id === formikProps.values?.profilePicture,
                    })}
                  />
                </label>
              );
            })}
        </SpinnerContainer>
        <IdentityPagination
          forcePage={Math.ceil(avatarOffset / avatarsPerPage)}
          onPageChange={(e) => handleAvatarPageChange(e)}
          pageCount={Math.ceil(Object.keys(avatars)?.length / avatarsPerPage)}
        />
      </GridCol>
    </>
  );
};
