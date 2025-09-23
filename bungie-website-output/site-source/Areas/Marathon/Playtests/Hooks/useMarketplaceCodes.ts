import { useCallback, useEffect, useState } from "react";
import { Platform } from "@Platform";

export function useMarketplaceCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Platform.TokensService.MarketplacePlatformCodeOfferHistory();
      setCodes(Array.isArray(res) ? res : []);
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
