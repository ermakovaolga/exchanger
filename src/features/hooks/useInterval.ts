import {useEffect, useRef} from 'react';
import { delay, mergeMap, repeat, skipWhile } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export function useInterval(
    {
      skipWhileFn,
      mergeMapFn,
      delayInterval,
      callback,
}: {
      skipWhileFn?: () => boolean;
      mergeMapFn: (clb: (data: any) => void) => Observable<any>;
      delayInterval: number | Date;
      callback: (data: any) => void;
    }) {
    const savedCallback = useRef((data: any) => {});

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);


    useEffect(() => {
    const pollingSubscription = of({})
      .pipe(
        skipWhile(skipWhileFn ?? (() => false)),
        mergeMap(() => mergeMapFn(savedCallback.current)),
        delay(delayInterval),
        repeat(),
      )
      .subscribe();
    return () => pollingSubscription.unsubscribe();
  }, []);
}
