'use client';

import React from 'react';

function useForkRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return React.useMemo(() => {
    if (refs.every(ref => ref == null)) return () => {};
    return (value: T | null) => {
      refs.forEach(ref => {
        if (typeof ref === 'function') ref(value);
        else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T | null>).current = value;
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

export default useForkRef;
