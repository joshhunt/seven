// Created by v-rgordon, 2024
// Copyright Bungie, Inc.

import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import { useState, useEffect, useRef } from "react";

interface DynamicPollingProps {
  seconds?: number;
}

interface NotificationEvent {
  EMAIL?: boolean | null;
  MOBILE_PUSH?: boolean;
  WEB_ONLY?: boolean;
  grouping?: string;
  name: string;
  type?: string;
}

interface EventData {
  seq: number;
  tab: number;
  replaced: boolean;
  events: NotificationEvent[];
}

interface DynamicPollingState {
  data: EventData;
  loading: boolean;
  error: any;
}

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  } as T;
};

export const useDynamicPolling = ({ seconds = 60 }: DynamicPollingProps) => {
  const [hookProps, setHookProps] = useState<DynamicPollingState>({
    data: {
      seq: 1,
      tab: 1,
      replaced: false,
      events: [],
    },
    loading: false,
    error: null,
  });

  const isMounted = useRef(true);
  const abortController = useRef(new AbortController());

  const fetchFTFNotificationEvent = async (seq: number, tab: number) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    try {
      const res = await Platform.NotificationService.GetRealTimeEvents(
        seq,
        tab,
        45,
        null,
        { signal: abortController.current.signal }
      );
      if (isMounted.current) {
        setHookProps((prev) => {
          const updatedSeq = res.seq || prev.data.seq;
          const updatedTab = res.tab || prev.data.tab;

          return {
            ...prev,
            data: {
              ...res,
              seq: updatedSeq,
              tab: updatedTab,
            },
            loading: false,
          };
        });
      }
    } catch (e) {
      if (isMounted.current) {
        await Logger.logToServer(e, RendererLogLevel.Error);
        setHookProps((prev) => {
          return {
            ...prev,
            error: e,
            loading: false,
          };
        });
      }
    }
  };
  const debouncedFetchFTFNotificationEvent = debounce(
    fetchFTFNotificationEvent,
    15 * 1000
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const { seq, tab } = hookProps.data;
    if (seq && tab) {
      setHookProps((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const fetchData = async () => {
        await debouncedFetchFTFNotificationEvent(seq, tab);
      };

      fetchData();

      const intervalId = setInterval(async () => {
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();
        await debouncedFetchFTFNotificationEvent(seq, tab);
      }, seconds * 1000);

      return () => {
        clearInterval(intervalId);
        if (abortController.current) {
          abortController.current.abort();
        }
      };
    }
  }, [seconds]);

  return hookProps;
};
