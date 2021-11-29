import { useEffect } from 'react';
import { delay, mergeMap, repeat, skipWhile, tap } from 'rxjs/operators';
import { noop, Observable, of } from 'rxjs';

export function useInterval<ValueType = any>(
    {
      skipWhileFn,
      mergeMapFn,
      delayInterval,
}: {
      skipWhileFn?: () => boolean;
      mergeMapFn: () => Observable<any>;
      delayInterval: number | Date;
    }) {
  useEffect(() => {
    const pollingSubscription = of({})
      .pipe(
        skipWhile(skipWhileFn ?? (() => false)),
        mergeMap(mergeMapFn),
        delay(delayInterval),
        repeat(),
      )
      .subscribe();
    return () => pollingSubscription.unsubscribe();
  }, []);
}
