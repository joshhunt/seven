// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { IResponsiveState, Responsive } from "@Boot/Responsive";
import ClickableVideoOrImgThumb from "@UI/Marketing/ClickableVideoOrImgThumb";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import classNames from "classnames";
import * as React from "react";
import styles from "./MarketingContentBlock.module.scss";

export type ContentAlignments = "center" | "left" | "right" | "centerTop";

interface IMediaBoxProps {
  ImageThumbnail: string;
  VideoId?: string;
  LargeImage?: string;
}

interface IMarketingContentBlockProps {
  /** Small, underlined title at the top of the text section */
  smallTitle: React.ReactNode;
  /** Title under the small title, it is medium for left- or right-aligned content and large for centered content */
  sectionTitle: React.ReactNode;
  /** Explanatory callout under section title */
  callout?: React.ReactNode;
  /** Background image or video */
  bgs?: React.ReactNode;
  /** Background image rendered at mobile size */
  mobileBg?: React.ReactNode;
  /** Background color for content block, defaults to the background color for the site */
  bgColor?: string;
  alignment: ContentAlignments;
  /** This will determine how much margin the text block will have */
  margin?: string;
  /** A marketing block has default styling for a medium block of text*/
  blurb?: React.ReactNode;
  children?: React.ReactNode;
  /** Is this a splitscreen block? - next to another marketing block when the page is wide */
  splitScreen?: boolean;
  /** Three clickable thumbnails at bottom of section */
  threeMediaBoxes?: IMediaBoxProps[] | null;
}

interface IMarketingContentBlockState {
  responsive: IResponsiveState;
}

/**
 * MarketingContentBlock - Reusable block component for marketing pages with small and large title and then any additional content
 *  *
 * @param {IMarketingContentBlockProps} props
 * @returns
 */
export class MarketingContentBlock extends React.Component<
  IMarketingContentBlockProps,
  IMarketingContentBlockState
> {
  private readonly sectionRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();

  constructor(props: IMarketingContentBlockProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  public render() {
    const {
      smallTitle,
      sectionTitle,
      callout,
      blurb,
      bgs,
      mobileBg,
      bgColor,
      alignment,
      margin,
      children,
      splitScreen,
      threeMediaBoxes,
    } = this.props;

    return (
      <div
        className={classNames({ [styles.splitScreen]: splitScreen })}
        style={{ backgroundColor: bgColor ? bgColor : "rgb(33, 40, 51)" }}
      >
        <Section
          className={styles.section}
          alignment={SectionAlignment[alignment]}
          bgs={bgs}
          mobileBg={mobileBg}
        >
          <div>
            <TextContainer margin={margin}>
              <MarketingTitles
                smallTitle={smallTitle}
                sectionTitle={sectionTitle}
                callout={callout}
                alignment={alignment}
                splitScreen={splitScreen}
              />
              {blurb && <p className={styles.mediumBlurb}>{blurb}</p>}
            </TextContainer>
            {threeMediaBoxes && (
              <ThreeMediaBoxes
                mediaBoxes={threeMediaBoxes}
                isMedium={this.state.responsive.medium}
              />
            )}
            {children}
          </div>
        </Section>
      </div>
    );
  }
}

interface IBasicDivProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface IThreeMediaBoxesProps {
  mediaBoxes: IMediaBoxProps[];
  isMedium: boolean;
}

const ThreeMediaBoxes = (props: IThreeMediaBoxesProps) => {
  const { isMedium, mediaBoxes } = props;

  return (
    <div className={styles.mediaBoxes}>
      {mediaBoxes?.map((mediaBox, i) => {
        return (
          <ClickableVideoOrImgThumb
            thumbnailClass={styles.marketingThumbnail}
            key={i}
            thumbnailPath={mediaBox.ImageThumbnail}
            screenshotPath={mediaBox.LargeImage || null}
            youTubeId={mediaBox.VideoId || null}
            isMedium={isMedium}
          />
        );
      })}
    </div>
  );
};

interface ISectionTitleProps extends IBasicDivProps {
  isSmall?: boolean;
}

const SectionTitle = (props: ISectionTitleProps) => {
  const { children, ...rest } = props;

  return (
    <div className={classNames(styles.sectionTitle)} {...rest}>
      {children}
    </div>
  );
};
const SmallTitle = (props: IBasicDivProps) => {
  return <div className={styles.smallTitle}>{props.children}</div>;
};

enum SectionAlignment {
  none,
  center,
  left,
  right,
  centerTop,
}

interface ISectionProps extends IBasicDivProps {
  alignment?: SectionAlignment;
  bgs?: React.ReactNode;
  mobileBg?: React.ReactNode;
}

const Section = (props: ISectionProps) => {
  const { alignment, bgs, mobileBg, children, className, ...rest } = props;

  const alignmentReal =
    alignment === undefined ? SectionAlignment.center : alignment;

  const sectionClasses = classNames(
    className,
    styles.section,
    styles[SectionAlignment[alignmentReal]]
  );

  return (
    <div className={sectionClasses} {...rest}>
      <div className={styles.bg}>{bgs}</div>
      {mobileBg && <div className={styles.mobileBg}>{mobileBg}</div>}
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

interface ITextContainerProps extends IBasicDivProps {
  margin?: string;
}

const TextContainer = (props: ITextContainerProps) => {
  return (
    <div className={styles.sectionTextContent} style={{ margin: props.margin }}>
      {props.children}
    </div>
  );
};
