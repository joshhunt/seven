import { useCallback, useEffect, useState } from "react";
import { Contracts, Platform } from "@Platform";

export function useMarketplaceCodes() {
  const [codes, setCodes] = useState<
    Contracts.PlatformMarketplaceCodeResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Platform.TokensService.MarketplacePlatformCodeOfferHistory();
      setCodes(res.filter((r) => r.offerKey === "goliath_june_playtest"));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);
  return { codes, loading, error, reload: load };
}
