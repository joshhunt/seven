// Created by atseng, 2022
// Copyright Bungie, Inc.

export class NumberUtils {
  public static NumberToRomanNumeralString = (index: number) => {
    switch (index) {
      case 0:
        return "I";
      case 1:
        return "II";
      case 2:
        return "III";
      case 3:
        return "IV";
      case 4:
        return "V";
      case 5:
        return "VI";
      case 6:
        return "VII";
      case 7:
        return "VIII";
      case 8:
        return "IX";
      case 9:
        return "X";
      case 10:
        return "XI";
      default:
        return "";
    }
  };

  public static getRandomIntInclusive = (min: number, max: number) => {
    const minN = Math.ceil(min);
    const maxN = Math.floor(max);

    return Math.floor(Math.random() * (maxN - minN + 1)) + minN;
  };
}
