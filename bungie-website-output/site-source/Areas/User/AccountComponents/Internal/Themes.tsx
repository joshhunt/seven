// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import classNames from "classnames";
import { Field, FormikProps, FormikValues } from "formik";
import React, { useEffect, useState } from "react";
import { ConvertToPlatformError } from "../../../../Platform/ApiIntermediary";
import {
  Config,
  Platform,
  User,
} from "../../../../Platform/BnetPlatform.TSClient";
import { Modal } from "../../../../UI/UIKit/Controls/Modal/Modal";
import { GridCol } from "../../../../UI/UIKit/Layout/Grid/Grid";
import styles from "../IdentitySettings.module.scss";
import { IdentityPagination } from "./IdentityPagination";

interface ThemesProps {
  user: User.GeneralUser;
  formikProps: FormikProps<FormikValues>;
}

export const Themes: React.FC<ThemesProps> = ({ user, formikProps }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [themes, setThemes] = useState<Config.UserTheme[]>([]);
  const themesPerPage = 12;
  const [themeOffset, setThemeOffset] = useState(0);

  useEffect(() => {
    loadThemes();
  }, [user]);

  const handleThemePageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * themesPerPage);
    setThemeOffset(newOffset);
  };

  // profileThemeName on the user object will be the number 0 if it has not been selected, otherwise it is a string
  const _getThemePathFromThemeName = (themeName: string | number): string => {
    return `/img/UserThemes/${themeName}/mobiletheme.jpg`;
  };

  const loadThemes = () => {
    Platform.UserService.GetAvailableThemes()
      .then((data) => {
        setThemes(data);

        const themeIndex = data.findIndex(
          (theme) => user?.profileTheme === theme.userThemeId
        );
        handleThemePageChange({
          selected:
            themeIndex !== -1 ? Math.floor(themeIndex / themesPerPage) : 0,
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  return (
    <>
      <GridCol cols={2} medium={12} className={styles.sectionTitle}>
        {Localizer.Userpages.Theme}
      </GridCol>
      <GridCol cols={10} className={styles.paginatedContent}>
        <div>
          <label htmlFor={"profileTheme"} />
          {themes
            .slice(themeOffset, themeOffset + themesPerPage)
            .map((th, i) => {
              return (
                <label key={i}>
                  <Field
                    type="radio"
                    name={"profileTheme"}
                    value={th.userThemeId}
                    onChange={(e: React.ChangeEvent<any>) => {
                      // Radio type fields will, by default, convert the value to a string, this maintains the stored value as a number
                      formikProps.handleChange(e);
                      formikProps.setFieldValue(
                        "profileTheme",
                        Number(e.target.value)
                      );
                    }}
                  />
                  <img
                    src={_getThemePathFromThemeName(th.userThemeName)}
                    className={classNames(styles.theme, {
                      [styles.selected]:
                        th.userThemeId === formikProps.values?.profileTheme,
                    })}
                  />
                </label>
              );
            })}
        </div>
        <IdentityPagination
          forcePage={Math.floor(themeOffset / themesPerPage)}
          onPageChange={(e) => handleThemePageChange(e)}
          pageCount={Math.ceil(themes.length / themesPerPage)}
        />
      </GridCol>
    </>
  );
};
