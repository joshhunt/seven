import React, { FC } from "react";
import styles from "./FrequentlyAskedQuestions.module.scss";
import { Button } from "plxp-web-ui/components/base";
import { Launch } from "@mui/icons-material";

interface QuestionBlockProps {
  question?: string;
  answer?: string;
}

/*
 * QuestionBlock:
 * Question and Answer container itself.
 * */

const QuestionBlock: FC<QuestionBlockProps> = ({ question, answer }) =>
  question && answer ? (
    <div className={styles.questionContainer}>
      <dt className={styles.question}>{question}</dt>
      <dd className={styles.answer}>{answer}</dd>
    </div>
  ) : null;

interface FrequentlyAskedQuestionsProps {
  sectionTitle?: string;
  questions?: QuestionBlockProps[];
  buttonData?: {
    title?: string;
    href?: string;
    onClick?: () => void;
  };
}

/*
 * FrequentlyAskedQuestions:
 * Maps through questions provided by the CMS & renders the FAQ section.
 * */

const FrequentlyAskedQuestions: FC<FrequentlyAskedQuestionsProps> = ({
  sectionTitle,
  questions,
  buttonData,
}) =>
  Array.isArray(questions) && questions?.length > 0 ? (
    <div>
      {sectionTitle && <h3 className={styles.heading}>{sectionTitle}</h3>}
      <dl className={styles.questionsList}>
        {questions.map((questionBlock) => (
          <QuestionBlock
            key={questionBlock.question}
            question={questionBlock.question}
            answer={questionBlock.answer}
          />
        ))}
      </dl>
      <Button
        sx={{ margin: "0 auto" }}
        variant={"contained"}
        themeVariant={"bungie-core"}
        onClick={buttonData?.onClick ? buttonData.onClick : null}
        href={buttonData?.href ? buttonData.href : null}
        endIcon={buttonData?.href && <Launch />}
        {...(buttonData?.href ? { target: "_newTab" } : null)}
      >
        {buttonData?.title}
      </Button>
    </div>
  ) : null;

export default FrequentlyAskedQuestions;
