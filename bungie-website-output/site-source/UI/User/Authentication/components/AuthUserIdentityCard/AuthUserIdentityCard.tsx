import React, { FC } from "react";
import classNames from "classnames";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { BungieCredentialType } from "@Enum";
import { Typography, Button } from "plxp-web-ui/components/base";
import { AuthUserLogoBlock } from "@UI/User/Authentication/components";
import styles from "./AuthUserIdentityCard.module.scss";

interface AuthUserIdentityCardProps {
  avatarUrl?: string;
  accountData: any;
  label?: string;
  selectionOptions?: {
    style?: "button" | "card";
    isSelected?: boolean;
    setSelectedAccount?: (account: any) => void;
  };
  caption?: string;
}

const AuthUserIdentityCard: FC<AuthUserIdentityCardProps> = ({
  accountData,
  caption,
  label,
  selectionOptions,
}) =>
  accountData?.displayName && accountData?.credentialType ? (
    <div
      className={classNames(styles.cardContainer, {
        [styles.active]: selectionOptions?.isSelected,
        [styles.inactive]: !selectionOptions?.isSelected,
        [styles.arrow]:
          !selectionOptions?.isSelected && selectionOptions?.style === "card",
      })}
    >
      {label && (
        <Typography
          variant={"body2"}
          sx={() => ({
            borderBottom: `1px solid ${
              selectionOptions?.isSelected ? "#23B2FF" : "#32404E"
            }`,
            marginBottom: "12px",
            paddingBottom: "12px",
            textAlign: "center",
            fontWeight: selectionOptions?.isSelected ? 700 : 400,
          })}
        >
          {label}
        </Typography>
      )}
      <div className={styles.contentContainer}>
        <AuthUserLogoBlock
          displayName={accountData?.displayName}
          credentialType={accountData?.credentialType}
          avatarUrl={accountData?.avatarUrl}
          caption={caption}
          row
        />
        {selectionOptions?.style === "button" ? (
          <div
            className={classNames(styles.cardButtonContainer, {
              [styles.active]: selectionOptions?.isSelected,
              [styles.inactive]: !selectionOptions?.isSelected,
            })}
          >
            {selectionOptions?.isSelected ? (
              <Typography variant={"body2"}>
                {"Selected"}
                <FaCheck />
              </Typography>
            ) : (
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() =>
                  selectionOptions?.setSelectedAccount(accountData)
                }
              >
                {"Select"}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;

export default AuthUserIdentityCard;
