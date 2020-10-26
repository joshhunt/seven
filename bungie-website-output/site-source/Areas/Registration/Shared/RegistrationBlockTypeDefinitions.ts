export interface RegistrationBlockTypeDefinition {
  tag: string;
  blockClassName: string;
  wrapperClassName: string;
  // since contentSets don't can have links but not labels - this can be used for a special label (ex: View All Items >)
  wrapperLinkLabelLocKey?: string;
  blockLinked: boolean;
  hasLink: boolean;
  hasButton: boolean;
}

export const RegistrationBlockTypeConfig: RegistrationBlockTypeDefinition[] = [
  {
    tag: "registration-utility",
    blockClassName: "utilityBlock",
    wrapperClassName: "registrationUtility",
    blockLinked: true,
    hasLink: false,
    hasButton: false,
  },
  {
    tag: "registration-benefits-setup",
    blockClassName: "setupBlock",
    wrapperClassName: "registrationSetup",
    blockLinked: false,
    hasLink: false,
    hasButton: true,
  },
  {
    tag: "registration-benefits-apps",
    blockClassName: "appBenefitsBlock",
    wrapperClassName: "registrationBenefitsApps",
    blockLinked: false,
    hasLink: true,
    hasButton: false,
  },
  {
    tag: "registration-reward",
    blockClassName: "rewardBlock",
    wrapperClassName: "registrationRewards",
    blockLinked: false,
    hasLink: false,
    hasButton: false,
  },
  {
    tag: "registration-apps",
    blockClassName: "appBlock",
    wrapperClassName: "registrationApps",
    blockLinked: false,
    hasLink: false,
    hasButton: false,
  },
  {
    tag: "registration-community",
    blockClassName: "communityBlock",
    wrapperClassName: "registrationCommunity",
    blockLinked: false,
    hasLink: false,
    hasButton: false,
  },
  {
    tag: "registration-benefits-help",
    blockClassName: "helpBlock",
    wrapperClassName: "registrationHelp",
    blockLinked: false,
    hasLink: true,
    hasButton: false,
  },
];
