import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { RouteHelper } from "@Routes/RouteHelper";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { StickySubNav } from "@UI/Navigation/StickySubNav";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import styles from "./EditionsStickyNav.module.scss";

interface EditionsStickNavProps {
  heroRef: React.RefObject<HTMLDivElement>;
  skus: { label: string; sku: string; url: string }[];
  logo: string;
  buyBtnText: string;
  dropdownTitle: string;
  dateText: string;
}

export const EditionsStickyNav: React.FC<EditionsStickNavProps> = (props) => {
  const { heroRef, skus, logo, buyBtnText, dropdownTitle, dateText } = props;
  const [selectedSku, setSelectedSku] = useState("thefinalshapeannual");
  const [isFixed, setIsFixed] = useState(false);

  const handleDropdownChange = (sku: string) => {
    setSelectedSku(sku);
  };

  const handleSkuBtnClick = (sku: string) => {
    const skuItem = skus?.find((skuItm) => skuItm?.sku === selectedSku);
    const hasUrl = Boolean(skuItem?.url.length !== 0 || skuItem?.url);

    if (!hasUrl) {
      DestinySkuSelectorModal.show({ skuTag: sku });
    } else {
      window.location.href = skuItem.url;
    }
  };

  return Array.isArray(skus) && skus?.length > 0 ? (
    <StickySubNav
      onFixedChange={(status) => setIsFixed(status)}
      relockUnder={heroRef}
      backgroundColor={"#0b0f12"}
    >
      <>
        {!isFixed && <div className={styles.stickyNavBorder} />}
        <div className={styles.stickyNavContents}>
          {(logo || dateText) && (
            <div className={styles.textContent}>
              {logo && <img src={logo} className={styles.logo} />}
              {dateText && <p className={styles.date}>{dateText}</p>}
            </div>
          )}
          <div className={styles.selectorWrapper}>
            <div className={styles.dropDownWrapper}>
              {Array.isArray(skus) && skus?.length > 0 && (
                <FinalShapeNavDropdown
                  title={dropdownTitle}
                  options={skus}
                  onChange={handleDropdownChange}
                />
              )}
              <Button
                className={styles.skuBuyBtn}
                onClick={() => handleSkuBtnClick(selectedSku)}
              >
                {buyBtnText}
              </Button>
            </div>
          </div>
        </div>
      </>
    </StickySubNav>
  ) : null;
};

interface IFinalShapeNavDropdown {
  options: { label: string; sku: string }[];
  onChange: (value: string) => void;
  title: string;
}

const FinalShapeNavDropdown: React.FC<IFinalShapeNavDropdown> = (props) => {
  const responsive = useDataStore(Responsive);

  const { options, onChange, title } = props;

  const [selectedOption, setSelectedOption] = useState(0);
  const [showDropdown, setShowDropDownState] = useState(false);
  const showDropdownRef = useRef(false);
  const setShowDropDown = (status: boolean) => {
    setShowDropDownState(status);
    showDropdownRef.current = status;
  };

  useEffect(() => {
    window.addEventListener("click", handleScreenClick);

    return () => window.removeEventListener("click", handleScreenClick);
  }, []);

  // hide dropdown options whenever screen is clicked if they are shown
  const handleScreenClick = (e: MouseEvent) => {
    if (showDropdownRef.current) {
      setShowDropDown(false);
    }
  };

  const onDropdownChange = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    onChange(options[optionIndex].sku);
  };

  const toggleShowDropdown = () => {
    // make sure window click event listener has fired before updating state
    window.requestAnimationFrame(() => setShowDropDown(!showDropdown));
  };

  const selected = options?.[selectedOption];

  return (
    <div className={styles.skuDropDown}>
      <p className={styles.selectorTitle}>{title}</p>
      <div className={styles.selectedValue} onClick={toggleShowDropdown}>
        <p>{selected?.label}</p>
        <Icon
          className={classNames(styles.arrow, { [styles.up]: showDropdown })}
          iconName={"arrow_right"}
          iconType={"material"}
        />
      </div>
      <div
        className={classNames(styles.options, { [styles.show]: showDropdown })}
      >
        {options?.map((opt, i) => {
          return (
            <div
              key={i}
              className={classNames(styles.dropdownOption, {
                [styles.selected]: selectedOption === i,
              })}
              onClick={() => onDropdownChange(i)}
            >
              {opt.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditionsStickyNav;
