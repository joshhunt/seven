import React, { FC, ReactNode, useEffect, useState } from "react";
import FrequentlyAskedQuestions from "@UI/Content/FrequentlyAskedQuestions";
import { Localizer } from "@bungie/localization";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { ContentStackClient } from "../../../../../../Platform/ContentStack/ContentStackClient";
import Hero from "../Hero";
import { BnetStackFrequentlyAskedQuestions } from "../../../../../../Generated/contentstack-types";
import styles from "./PageTemplate.module.scss";

interface PageTemplateProps {
  children: ReactNode;
  hero?: {
    heading?: string;
    subheading?: string;
    buttonData?: {
      label?: string;
      link?: string;
    };
  };
  faqEntryId?: string;
}

const PageTemplate: FC<PageTemplateProps> = ({
  children,
  hero,
  faqEntryId,
}) => {
  const [
    faqData,
    setFaqData,
  ] = useState<BnetStackFrequentlyAskedQuestions | null>(null);
  const AccountLoc = Localizer.parentalcontrols;
  const heading = hero?.heading ?? AccountLoc.ParentalControls;

  useEffect(() => {
    if (faqEntryId) {
      ContentStackClient()
        .ContentType("frequently_asked_questions")
        .Entry(faqEntryId)
        .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
        .toJSON()
        .fetch()
        .then(setFaqData);
    }
  }, []);

  return (
    <div className={styles.templateContainer}>
      <Hero
        heading={heading}
        subheading={hero?.subheading}
        buttonData={hero?.buttonData}
      />
      <div className={styles.childWrapper}>
        {children}
        {faqData ? (
          <FrequentlyAskedQuestions
            sectionTitle={faqData?.section_title}
            questions={faqData?.questions?.question_block}
            buttonData={faqData?.link}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PageTemplate;
