'use client';

import { useEffect, useState } from 'react';

/**
 * Hook للتحكم في تأخير إرسال البحث (Debounce) لتقليل عمليات التصفية غير الضرورية
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
