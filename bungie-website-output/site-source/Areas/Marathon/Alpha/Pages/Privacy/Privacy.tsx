import { useAppSelector } from "@Global/Redux/store";
import { Platform } from "@Platform";
import classNames from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Privacy.module.scss";

interface PrivacyProps {
  onComplete: () => void;
}

export const Privacy: FC<PrivacyProps> = ({ onComplete }) => {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [agreements, setAgreements] = useState({
    readAndUnderstood: false,
    confidentialityAgreement: false,
    noStreamingOrSharing: false,
    noPublicDiscussion: false,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cohortIdFromQuery = queryParams.get("cohortId");
  const cohortIdFromRedux = useAppSelector(
    (state) => state.registration.cohortId
  );

  // Use cohortId from Redux if available, fallback to query param
  const cohortId = cohortIdFromRedux || cohortIdFromQuery;

  useEffect(() => {
    const fetchCohortConfig = async () => {
      if (!cohortId) return;

      try {
        const config = await Platform.TokensService.GetCohortConfig(cohortId);
        if (config?.SkipNda && onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error("Error fetching cohort config:", error);
      }
    };

    fetchCohortConfig();
  }, [cohortId, onComplete]);

  // Handle scroll event to check if user has reached bottom
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

      // If user has scrolled to within 20px of the bottom, consider it "reached bottom"
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

      if (isBottom && !hasReachedBottom) {
        setHasReachedBottom(true);
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = contentRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);

      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleAgree = () => {
    if (hasReachedBottom && Object.values(agreements).every((v) => v)) {
      onComplete();
    }
  };

  const handleCheckboxChange = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allChecked = Object.values(agreements).every((v) => v);

  return (
    <div className={styles.ndaBlock}>
      <div className={styles.commandPrompt}>
        {`> nda_agreement > confidential`}
      </div>

      <div
        ref={contentRef}
        className={styles.ndaContent}
        onScroll={handleScroll}
      >
        <div className={styles.ndaText}>
          <h1>Private Alpha Agreement</h1>

          <div className="disclaimer">
            <p>
              BY DOWNLOADING OR USING THE ALPHA PRODUCT, YOU AGREE TO THE TERMS
              OF THIS PRIVATE ALPHA AGREEMENT ("Agreement"). If you do not agree
              to the terms of this Agreement, do not download or use the Alpha
              Product.
            </p>

            <p>
              This Agreement concerns access to the Alpha Product owned by
              Bungie Inc., a subsidiary of Sony Interactive Entertainment LLC,
              or any of its affiliates ("Licensor"), and is binding between
              Licensor and you. You must be 18 years or older to access the
              Alpha Product.
            </p>

            <p className="important">
              NOTE: IF YOU ARE A UNITED STATES RESIDENT OR A RESIDENT OF A
              COUNTRY IN NORTH, CENTRAL OR SOUTH AMERICA, TO THE FULLEST EXTENT
              PERMITTED BY LAW, THIS AGREEMENT CONTAINS A BINDING INDIVIDUAL
              ARBITRATION AND CLASS ACTION WAIVER PROVISION IN SECTION 9 THAT
              AFFECTS YOUR RIGHTS UNDER THIS AGREEMENT AND WITH RESPECT TO ANY
              DISPUTE (AS DEFINED IN SECTION 9) BETWEEN YOU AND A SONY ENTITY
              (AS DEFINED IN SECTION 9). YOU HAVE A RIGHT TO OPT OUT OF THE
              BINDING ARBITRATION AND CLASS ACTION WAIVER PROVISIONS AS
              DESCRIBED IN SECTION 9.
            </p>
          </div>

          <div className="section">
            <h2>1. Alpha Product</h2>
            <p>
              (a) Licensor may provide you with alpha software, documentation
              and access to the alpha test program (collectively, "Alpha
              Product"). Alpha Product participation is subject to this
              Agreement. Licensor may terminate this Alpha Product or your
              permission to access it at any time without cause or advance
              notice to you. You must keep the Alpha Product in your control and
              take reasonable efforts to prevent others from using it. You are
              responsible for any loss or damage to your Alpha Product or to
              Licensor's intellectual property rights in it, including loss or
              damage resulting from the disclosure of the Alpha Product. You
              will immediately notify Licensor if you become aware that the
              Alpha Product provided to you is distributed or transferred to a
              third party, and you must use your best efforts to help recover
              the Alpha Product and to prevent any further loss of disclosure.
            </p>

            <p>
              (b) The Alpha Product may be available through a third-party
              platform. Your access to the Alpha Product via a third-party
              platform is subject to your acceptance and continued compliance
              with any terms and conditions of that third-party platform and
              this Agreement.
            </p>

            <p>
              (c) Licensor may provide you access to official communication
              channels, such as private community servers or in-game
              communications, in connection with the Alpha Product ("Alpha
              Community Forums"). Your access to the Alpha Community Forums is
              subject to your acceptance and continued compliance with any terms
              and conditions of the Alpha Community Forums and this Agreement.
            </p>
          </div>

          <div className="section">
            <h2>2. License</h2>
            <p>
              When you install the Alpha Product, Licensor grants to you a
              limited, revocable, non-exclusive license to use the Alpha Product
              for personal use on your device for which the Alpha Product was
              designed. Licensor reserves all rights in the Alpha Product not
              explicitly granted to you in this license, including rights to all
              intellectual property contained in the Alpha Product. This license
              does not include the right to, and you agree not to (a) rent,
              lease or sublicense the Alpha Product or make it available on a
              network to other users; (b) modify, adapt, translate, reverse
              engineer, decompile or disassemble the Alpha Product; (c) create
              derivative works from the Alpha Product; or (d) copy, publicly
              perform or broadcast the Alpha Product in an unauthorized manner.
              These license terms are in addition to any limited software
              license agreement required to play the Alpha Product.
            </p>
          </div>

          <div className="section">
            <h2>3. Your Information</h2>
            <p>
              Licensor will collect, use, disclose and dispose of personal
              information/data as described in the applicable privacy policy at
              https://www.bungie.net/7/en/legal/privacypolicy or its successor
              URL. You further understand and agree that Licensor may record,
              store, use, and under certain circumstances share with third
              parties all or any part of your gameplay on the Alpha Product for
              any reason.
            </p>
          </div>

          <div className="section">
            <h2>4. User Generated Content</h2>
            <p>
              You may have the option to create, post, stream, transmit and
              provide content such as pictures, photographs, game related
              materials, or other information ("User Material") through the
              Alpha Product or Alpha Community Forums. To the extent permitted
              by law, you license Licensor a royalty-free and perpetual right to
              use, distribute, copy, modify, display, and publish your User
              Material for any reason without any restrictions or payments to
              you or any third parties. You acknowledge that you have received
              good and valuable consideration from Licensor for the license of
              the rights in your User Material. Licensor may sublicense its
              rights to your User Material to any third party, including its
              affiliates. You hereby waive, to the extent permitted by law, all
              claims, including any moral or patrimonial rights, against
              Licensor and its affiliates or any third party's use of the User
              Material By creating, posting, streaming, transmitting or
              providing Licensor any User Material, you represent and warrant
              that your User Material does not infringe on the intellectual
              property or other rights of any third party and is not obscene,
              defamatory, offensive or an advertisement or solicitation of
              business and you have the appropriate rights to use, create, post,
              distribute, transmit and provide User Material and to grant
              Licensor the foregoing license. You must cooperate with Licensor
              in resolving any dispute that may arise from your User Material.
            </p>
          </div>

          <div className="section">
            <h2>5. Confidential Nature of the Alpha Product</h2>
            <p>You acknowledge the following:</p>

            <p>
              (a) the Alpha Product and any information or data regarding your
              use of the Alpha Product (e.g., Alpha Community Forums and
              communications through them, keys or passwords allowing access to
              the Alpha Product, or email communications and surveys), whether
              shared with Licensor or not, is Licensor's confidential
              information. You may use the Alpha Product only in your home
              solely for the purpose of testing the Alpha Product, and, except
              as permitted through Alpha Community Forums, you will not
              transfer, distribute or disclose any materials, User Material, or
              any information in connection with the Alpha Product to any third
              party, including through a public exhibition or display, nor
              discuss your experience with the Alpha Product with third parties
              or publish or disseminate information about those experiences.
            </p>

            <p>
              (b) the Alpha Product is not thoroughly tested and includes
              pre-release materials that are not intended for public release.
            </p>

            <p>
              (c) the features provided in the Alpha Product may not be
              available in the final release.
            </p>

            <p>
              (d) disclosure of any part of the Alpha Product, User Material or
              your experiences using the Alpha Product to any third party except
              as permitted through Alpha Community Forums, including any trade
              or consumer press, news agency or any competitor of Licensor, will
              cause significant and irreparable harm to Licensor, the extent of
              which may be difficult to ascertain. Accordingly, Licensor is
              entitled to injunctive relief as well as all other legal remedies
              that may be available if you breach this Agreement.
            </p>

            <p>
              (e) under no circumstances may you share or allow anyone else to
              use any token, key, password, or other device given to you that
              permits your personal access to the Alpha Product or Alpha
              Community Forums.
            </p>
          </div>

          <div className="section">
            <h2>6. Updates and Online Server Support</h2>
            <p>
              This Agreement applies to Alpha Product and Alpha Community Forums
              ("Alpha Product and Services") updates, including all downloadable
              content for the Alpha Product. Licensor may, by automatic update
              or otherwise, modify the Alpha Product at any time for any reason.
              If the Alpha Product uses online servers, Licensor makes no
              commitment to make those servers available at any or all times.
            </p>
          </div>

          <div className="section">
            <h2>7. Internet Connection, Required Installations</h2>
            <p>
              Some Alpha Product features may require an internet connection,
              which you must provide at your expense. You are responsible for
              all costs and fees charged by your internet service provider
              related to the download and use of the Alpha Product. Access to
              the Alpha Product via a third-party platform may require that you
              have/create an account on that platform and installation of client
              supporting the platform on your device.
            </p>
          </div>

          <div className="section">
            <h2>8. DISCLAIMER/LIABILITY LIMITATIONS</h2>
            <p>
              THE ALPHA PRODUCT AND ALL RELATED SOFTWARE AND SERVICES ARE
              PROVIDED "AS IS" AND, TO THE MAXIMUM EXTENT ALLOWABLE UNDER LAW,
              LICENSOR DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED, INCLUDING ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NONINFRINGEMENT. WITHOUT LIMITING THE
              FOREGOING SENTENCE, LICENSOR DOES NOT WARRANT THAT OPERATION OF
              THE ALPHA PRODUCT OR ALPHA COMMUNICATION FORUMS WILL BE
              UNINTERRUPTED OR ERROR-FREE, THAT THEYWILL BE COMPATIBLE WITH
              DESIGNATED PLATFORMS OR HARDWARE CONFIGURATIONS OR OPERATING
              SYSTEMS, OR THAT THEY WILL WORK PROPERLY, OR AT ALL, ON ALL
              DESIGNATED DEVICES. LICENSOR MAY IN ITS SOLE DISCRETION,
              DISCONTINUE SUPPORTING AND/OR TERMINATE ACCESS TO THE ALPHA
              PRODUCT AND/OR ALPHA COMMUNICATIONS FORUMS AT ANY TIME, AND
              LICENSOR HAS NO LIABILITY FOR DISCONTINUANCE OR TERMINATION.
              LICENSOR WILL NOT BE LIABLE TO YOU FOR ANY PERSONAL INJURY,
              PROPERTY DAMAGE, LOST PROFITS, COST OF SUBSTITUTE GOODS, LOSS OF
              DATA OR ANY OTHER FORM OF DIRECT OR INDIRECT, SPECIAL, INCIDENTAL,
              CONSEQUENTIAL OR PUNITIVE DAMAGES FROM ANY CAUSES OF ACTION
              ARISING OUT OF OR RELATED TO THIS AGREEMENT OR THE ALPHA PRODUCT
              OR ALPHA COMMUNICATION FORUMS, WHETHER ARISING IN TORT (INCLUDING
              NEGLIGENCE), CONTRACT, STRICT LIABILITY OR OTHERWISE, WHETHER OR
              NOT LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF THOSE DAMAGES.
              IN NO EVENT WILL LICENSOR'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES
              EXCEED $10. SOME JURISDICTIONS DO NOT ALLOW FOR CERTAIN
              LIMITATIONS OF LIABILITIES OR WARRANTIES, SO SOME OR ALL OF THE
              ABOVE EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU.
            </p>
          </div>

          <div className="section">
            <h2>9. BINDING INDIVIDUAL ARBITRATION FOR CERTAIN RESIDENTS</h2>
            <p>
              The following terms in this Section 9, to the fullest extent
              permitted under law and except where prohibited for individuals
              resident in the Province of Quebec, only apply to you if you are a
              resident of the United States or a country in North, Central or
              South America.
            </p>

            <p>
              The term "Dispute" means any dispute, claim, or controversy
              between you and Licensor or any of its current or former
              affiliates, including parents and subsidiaries, and any
              predecessor or successor entity to any of the foregoing, including
              Sony Interactive Entertainment America LLC ("Sony Entity")
              regarding the use of the Software, whether based in contract,
              statute, regulation, ordinance, tort (including fraud,
              misrepresentation, fraudulent inducement, or negligence), or any
              other legal or equitable theory, and includes the validity,
              enforceability or scope of this Section 9 (with the exception of
              the enforceability of the Class Action Waiver clause below).
              "Dispute" has the broadest possible meaning that will be enforced.
            </p>

            <p>
              If you have a Dispute (other than one described as excluded from
              arbitration below) with any Sony Entity or a Sony Entity's
              officers, directors, employees and agents ("Adverse Sony Entity")
              that cannot be resolved through negotiation as required below, you
              and the Adverse Sony Entity must seek resolution of the Dispute
              only through arbitration of that Dispute by a neutral arbitrator
              instead of in a court by a judge or jury, and not litigate that
              Dispute in court as follows:
            </p>

            <p>
              (a) YOU AND THE SONY ENTITY ACKNOWLEDGE THAT ANY CLAIM FILED BY
              YOU OR BY A SONY ENTITY IN SMALL CLAIMS COURT IS NOT SUBJECT TO
              THE ARBITRATION TERMS CONTAINED IN THIS SECTION 9;
            </p>

            <p>
              (b) IF YOU DO NOT WISH TO BE BOUND BY THE BINDING ARBITRATION IN
              THIS SECTION 9, YOU MUST NOTIFY LICENSOR IN WRITING WITHIN 30 DAYS
              OF THE DATE THAT YOU ACCEPT THIS AGREEMENT. YOUR WRITTEN
              NOTIFICATION MUST BE MAILED TO SONY INTERACTIVE ENTERTAINMENT LLC,
              2207 BRIDGEPOINTE PARKWAY, SAN MATEO, CA 94404, ATTN: LEGAL
              DEPARTMENT - WAIVER, AND MUST INCLUDE: (1) YOUR NAME, (2) YOUR
              ADDRESS, (3) YOUR SIGN IN ID IF YOU HAVE ONE, AND (4) A CLEAR
              STATEMENT THAT YOU DO NOT WISH TO RESOLVE DISPUTES WITH ANY SONY
              ENTITY THROUGH ARBITRATION;
            </p>

            <p>
              (c) IF YOU HAVE A DISPUTE WITH ANY SONY ENTITY, YOU MUST SEND
              WRITTEN NOTICE TO SONY INTERACTIVE ENTERTAINMENT LLC, 2207
              BRIDGEPOINTE PARKWAY, SAN MATEO, CA 94404, ATTN: LEGAL DEPARTMENT
              – DISPUTE RESOLUTION, TO GIVE THE ADVERSE SONY ENTITY AN
              OPPORTUNITY TO RESOLVE THE DISPUTE INFORMALLY THROUGH NEGOTIATION;
            </p>

            <p>
              (d) you must negotiate in good faith to attempt to resolve the
              Dispute for no fewer than 60 days after you provide notice of the
              Dispute. If the Adverse Sony Entity does not resolve your Dispute
              within 60 days from its receipt of notice of the Dispute, you or
              the Adverse Sony Entity may pursue your claim in arbitration
              pursuant to the terms in this Section 9;
            </p>

            <p>
              (e) ANY DISPUTE RESOLUTION PROCEEDINGS, WHETHER IN ARBITRATION OR
              COURT, WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A
              CLASS OR REPRESENTATIVE ACTION OR AS A NAMED OR UNNAMED MEMBER IN
              A CLASS, CONSOLIDATED, REPRESENTATIVE OR PRIVATE ATTORNEY GENERAL
              ACTION, UNLESS BOTH YOU AND THE ADVERSE SONY ENTITY SPECIFICALLY
              AGREE TO DO SO IN WRITING FOLLOWING INITIATION OF THE ARBITRATION;
            </p>

            <p>
              (f) if you or the Adverse Sony Entity elect to resolve your
              Dispute through arbitration, the party initiating the arbitration
              proceeding may initiate it with the American Arbitration
              Association ("AAA"), www.adr.org, or JAMS, www.jamsadr.com. This
              Section 9's terms govern if they conflict with the rules of the
              arbitration organization that the parties select;
            </p>

            <p>
              (g) the Federal Arbitration Act ("FAA") governs the arbitrability
              of all disputes involving interstate commerce. However, applicable
              federal or state law may also apply to the substance of a Dispute.
              For claims of less than $75,000, the AAA's Supplementary
              Procedures for Consumer-Related Disputes ("Supplementary
              Procedures") apply including the schedule of arbitration fees set
              forth in section C-8 of the Supplementary Procedures; for claims
              over $75,000, the AAA's Commercial Arbitration Rules and relevant
              fee schedules for non-class action proceedings apply;
            </p>

            <p>
              (h) the AAA rules are available at www.adr.org or by calling
              1-800-778-7879. Further, if your claims do not exceed $75,000 and
              you provided notice to and negotiated in good faith with the
              Adverse Sony Entity as described above, if the arbitrator finds
              that you are the prevailing party in the arbitration, you will be
              entitled to recover reasonable attorneys' fees and costs as
              determined by the arbitrator, in addition to any rights to recover
              the same under controlling state or federal law afforded to the
              Adverse Sony Entity or you;
            </p>

            <p>
              (i) the arbitrator will make any award in writing but need not
              provide a statement of reasons unless requested by a party. The
              arbitrator's award will be binding and final, except for any right
              of appeal provided by the FAA, and may be entered in any court
              having jurisdiction over the parties for purposes of enforcement;
            </p>

            <p>
              (j) you or the Adverse Sony Entity may initiate arbitration in
              either San Mateo County, California or the county in which you
              reside. If you select the county of your residence, the Adverse
              Sony Entity may transfer the arbitration to San Mateo County if it
              agrees to pay any additional fees or costs you incur as a result
              of the change in location as determined by the arbitrator.
            </p>

            <p>
              If any clause within this Section 9 (other than the Class Action
              Waiver clause above) is not permitted under applicable law or
              unenforceable, that clause will be severed from this Section 9,
              and the remainder of this Section 9 will be given full effect. If
              the Class Action Waiver clause is found to be illegal or
              unenforceable, this entire Section 9 will be unenforceable, and
              the Dispute will be decided by a court.
            </p>
          </div>

          <div className="section">
            <h2>10. Governing Law and Venue</h2>
            <p>
              Subject to this Section, to the extent permitted under applicable
              law, you agree as follows:
            </p>

            <p>
              (a) if you reside in Japan or a country/area located in East Asia
              or Southeast Asia, this Agreement is governed by, construed and
              interpreted in accordance with the laws of Japan except for its
              conflict of law rules. Any dispute arising under or in relation to
              this Agreement, shall be exclusively submitted to the Tokyo
              District Court in Tokyo, Japan;
            </p>

            <p>
              (b) if you reside in Europe, Africa, Australia and Oceania, Middle
              East, India, or Russian Federation, this Agreement is governed by,
              construed and interpreted in accordance with English Law except
              for its conflict of law rules. Any dispute arising under or in
              relation to this Agreement, shall be exclusively submitted to any
              competent court in London, England;
            </p>

            <p>
              (c) except where prohibited for individuals resident in the
              Province of Quebec, if you reside elsewhere this Agreement is
              governed by, construed and interpreted in accordance with the laws
              of the State of California except for its conflict of law rules,
              and any Dispute not subject to arbitration and not initiated in
              small claims court must be litigated in a court of competent
              jurisdiction in either the Superior Court for the State of
              California in the County of San Mateo or in the United States
              District Court for the Northern District of California;
            </p>

            <p>
              (d) each party submits itself to the exclusive jurisdiction and
              venue of the courts above as relevant, and waives all
              jurisdictional, venue and inconvenient forum objections to those
              courts. In any litigation to enforce any part of this Agreement,
              all costs and fees, including attorney's fees, will be paid by the
              non-prevailing party.
            </p>
          </div>

          <div className="section">
            <h2>11. Miscellaneous</h2>
            <p>
              You are bound by this Agreement's most current version. Licensor
              may modify this Agreement's terms at any time. Please check this
              URL from time to time for changes to this Agreement. Your
              continued access to or use of the Alpha Product will signify your
              acceptance of the latest version of this Agreement.
            </p>

            <p>
              Except for individuals resident in the Province of Quebec who
              elect to be bound by the French version, to the extent permitted
              under applicable law, the English version of this Agreement
              supersedes any others; any translation in another language
              provided or available is for reference purposes only, and in the
              event of any conflict or inconsistency with the English version,
              the English version will control and prevail.
            </p>

            <p>
              If any provision of this Agreement is held invalid or
              unenforceable, in whole or in part, that provision will be
              modified to the minimum extent necessary to make it valid and
              enforceable, and the validity and enforceability of all other
              provisions of this Agreement shall not be affected thereby.
            </p>

            <p>
              This Agreement constitutes the entire agreement between the
              parties related to the subject matter hereof and supersedes all
              prior oral and written and all contemporaneous oral negotiations,
              commitments and understandings of the parties, all of which are
              merged herein. Sections 3, 5, 8, 9, 10, and 11 survive any
              termination of this Agreement.
            </p>
          </div>

          <div className="section">
            <h2>12. Questions or Complaints</h2>
            <p>
              You may submit any questions or complaints to Customer Support.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.agreementControls}>
        <div
          className={classNames(styles.scrollPrompt, {
            [styles.hidden]: hasReachedBottom,
          })}
        >
          {"SCROLL TO READ FULL AGREEMENT //"}
        </div>

        <div
          className={classNames(styles.checkboxContainer, {
            [styles.disabled]: !hasReachedBottom,
          })}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreements.readAndUnderstood}
              onChange={() => handleCheckboxChange("readAndUnderstood")}
              disabled={!hasReachedBottom}
            />
            <span>I HAVE READ AND UNDERSTAND THE TERMS OF THIS AGREEMENT</span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreements.confidentialityAgreement}
              onChange={() => handleCheckboxChange("confidentialityAgreement")}
              disabled={!hasReachedBottom}
            />
            <span>
              I AGREE TO MAINTAIN THE CONFIDENTIALITY OF ALL PROGRAM INFORMATION
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreements.noStreamingOrSharing}
              onChange={() => handleCheckboxChange("noStreamingOrSharing")}
              disabled={!hasReachedBottom}
            />
            <span>
              I AGREE TO NOT STREAM OR SHARE PUBLICLY ANY VIDEOS OR IMAGES FROM
              THE MARATHON CLOSED ALPHA
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreements.noPublicDiscussion}
              onChange={() => handleCheckboxChange("noPublicDiscussion")}
              disabled={!hasReachedBottom}
            />
            <span>
              I AGREE TO NOT DISCUSS MARATHON CLOSED ALPHA CONTENT OUTSIDE OF
              APPROVED PRIVATE CHANNELS IN THE OFFICIAL MARATHON DISCORD
            </span>
          </label>
        </div>

        <button
          className={classNames(styles.selectionButton, {
            [styles.disabled]: !hasReachedBottom || !allChecked,
          })}
          onClick={handleAgree}
          disabled={!hasReachedBottom || !allChecked}
        >
          {"ACCEPT AND CONTINUE"}
          <span className={styles.arrow}>›</span>
        </button>
      </div>
    </div>
  );
};
