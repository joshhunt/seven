export const TempGetContentStackLocale = (locale: string) => {
  const LocaleMap: Record<string, string> = {
    pl: "pl-pl",
    en: "en-us",
  };

  const mappedValue = LocaleMap[locale];

  return mappedValue ?? locale;
};
