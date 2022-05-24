// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import {
  createCustomModal,
  CustomModalProps,
} from "@UIKit/Controls/Modal/CreateCustomModal";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpIconActionCards } from "../../../../Generated/contentstack-types";
import styles from "./PmpIconActionCards.module.scss";

type PmpIconActionCardsProps = DataReference<
  "pmp_icon_action_cards",
  BnetStackPmpIconActionCards
> & {
  classes?: {};
};

type TCardItem = BnetStackPmpIconActionCards["action_cards"][number];

export const PmpIconActionCards: React.FC<PmpIconActionCardsProps> = (
  props
) => {
  const { classes, data } = props;

  const getCardItem = (card: TCardItem) => {
    return card?.Modal_Card ?? card?.Link_Card;
  };

  const openModal = (modalCard: TCardItem["Modal_Card"]) => {
    modalCard && CustomCardModal.show({ data: modalCard.modal });
  };

  const getCardAction = (card: TCardItem) => {
    if (card?.Modal_Card) {
      return () => openModal(card?.Modal_Card);
    } else {
      return card?.Link_Card?.link_url;
    }
  };

  return (
    <div className={classNames(styles.cardsWrapper)}>
      {data?.action_cards?.map((card, i) => {
        const cardItem = getCardItem(card);

        return (
          <IconActionCard
            key={i}
            cardTitle={cardItem?.card_btn?.heading}
            cardSubtitle={cardItem?.card_btn?.sub_heading}
            backgroundImage={cardItem?.card_btn?.thumb_bg?.url}
            action={getCardAction(card)}
            classes={{
              root: styles.card,
            }}
          />
        );
      })}
    </div>
  );
};

type CardModalProps = CustomModalProps & {
  data: BnetStackPmpIconActionCards["action_cards"][number]["Modal_Card"]["modal"];
};

type CardModalState = {
  responsive: IResponsiveState;
};

/**
 * Opens an image in a modal with arrows to paginate between a list of images
 */
class CardModal extends React.Component<CardModalProps, CardModalState> {
  constructor(props: CardModalProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d());
  }

  public render() {
    const {
      blurb,
      desktop_bg,
      heading,
      mobile_bg,
      sub_heading,
      exit_box_color,
    } = this.props.data ?? {};

    const bgImage = responsiveBgImageFromStackFile(
      desktop_bg,
      mobile_bg,
      this.state.responsive.mobile
    );
    const exitIcon =
      "https://images.contentstack.io/v3/assets/blte410e3b15535c144/blt5447c143939cb5a3/6283e08a1cd65960bcfecb66/modal_close_x.svg";

    return (
      <div className={styles.content} style={{ backgroundImage: bgImage }}>
        <div
          className={styles.exit}
          style={{
            backgroundImage: `url(${exitIcon})`,
            backgroundColor: exit_box_color,
          }}
          onClick={this.props.modalRef?.current?.close}
        />
        <p className={styles.smallHeading}>{sub_heading}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.blurb}>{blurb}</p>
      </div>
    );
  }
}

const CustomCardModal = createCustomModal<CardModalProps>(
  CardModal,
  {
    className: styles.modal,
    contentClassName: styles.modalContentOuter,
  },
  (props) => {
    return true;
  }
);
