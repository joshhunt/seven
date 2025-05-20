import React, { FC } from "react";
import { Button } from "plxp-web-ui/components/base";
import { Launch } from "@mui/icons-material";
import styles from "./Hero.module.scss";

interface HeroProps {
  heading: string;
  subheading?: string;
  buttonData?: {
    label?: string;
    link?: string;
    onClick?: () => void;
  };
}

const Hero: FC<HeroProps> = ({ heading, subheading, buttonData }) => {
  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.heading}>{heading}</h1>
      {subheading && <p className={styles.subheading}>{subheading}</p>}
      {buttonData && (
        <Button
          sx={{ margin: "0 auto" }}
          variant={"contained"}
          themeVariant={"bungie-core"}
          onClick={!buttonData?.link && buttonData?.onClick}
          href={!buttonData?.onClick && buttonData?.link}
          endIcon={buttonData?.link && <Launch />}
          {...(buttonData?.link && { target: "_newTab" })}
        >
          {buttonData?.label}
        </Button>
      )}
    </div>
  );
};

export default Hero;
