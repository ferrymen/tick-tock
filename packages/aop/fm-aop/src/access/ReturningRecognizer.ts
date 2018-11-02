import { NonePointcut } from '../decorators';
import {
  Singleton,
  RecognizerToken,
  IRecognizer,
  isPromise,
  isObservable,
} from '@ferrymen/fm-ioc-core';
import { JoinpointState } from '../joinpoints';
import { ReturningType } from './ReturningType';

@NonePointcut()
@Singleton(RecognizerToken, JoinpointState.AfterReturning)
export class ReturningRecognizer implements IRecognizer {
  constructor() {}

  recognize(value: any): string {
    if (isPromise(value)) {
      return ReturningType.promise;
    }

    if (isObservable(value)) {
      return ReturningType.observable;
    }

    return ReturningType.sync;
  }
}
