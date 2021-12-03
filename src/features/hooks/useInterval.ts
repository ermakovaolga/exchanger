import {useEffect, useRef} from 'react';
import { delay, mergeMap, repeat, skipWhile } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export function useInterval<ValueType = any, ObsType = any>(
    {
        error,
        skipWhileFn,
        mergeMapFn,
        delayInterval,
        callback,
    }: {
        error: string,
        skipWhileFn: (err: string) => boolean;
        mergeMapFn: (clb: (data: ValueType) => void) => Observable<ObsType>;
        delayInterval: number | Date;
        callback: (data: ValueType) => void;
    }) {
    const savedCallback = useRef((data: ValueType) => {});

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const savedError = useRef('');
    useEffect(() => {

        savedError.current = error;
    }, [error]);


    useEffect(() => {
    const pollingSubscription = of({})
      .pipe(
          skipWhile( () => skipWhileFn(savedError.current)),
          mergeMap(() => mergeMapFn(savedCallback.current)),
          delay(delayInterval),
          repeat(),
      )
      .subscribe();
    return () => pollingSubscription.unsubscribe();
  }, []);
}
