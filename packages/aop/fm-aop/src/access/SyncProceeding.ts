import { NonePointcut } from '../decorators';
import { Singleton, Express } from '@ferrymen/fm-ioc-core';
import {
  AdvisorProceedingToken,
  IAdvisorProceeding,
} from './IAdvisorProceeding';
import { ReturningType } from './ReturningType';
import { Joinpoint } from '../joinpoints';

@NonePointcut()
@Singleton(AdvisorProceedingToken, ReturningType.sync)
export class SyncProceeding implements IAdvisorProceeding {
  proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]) {
    joinPoint.returningValue = joinPoint.returning;
    actions.forEach(action => {
      action(joinPoint);
    });
  }
}
