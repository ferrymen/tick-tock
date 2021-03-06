import {
  ActionData,
  ActionComposite,
  IContainer,
  Lang,
} from '@ferrymen/fm-ioc-core';
import { Joinpoint } from '../joinpoints';
import { AopActions } from './AopActions';
import { AdvisorToken } from '../IAdvisor';
import { Advices, Advicer } from '../advices';
import { AdviceMetadata } from '../metadatas';
import { isValideAspectTarget } from '../isValideAspectTarget';
import { AdviceMatcherToken } from '../IAdviceMatcher';

/**
 * match pointcut action data.
 *
 */
export interface MatchPointcutActionData extends ActionData<Joinpoint> {}

/**
 *  match pointcut action.
 *
 */
export class MatchPointcutAction extends ActionComposite {
  constructor() {
    super(AopActions.matchPointcut);
  }

  protected working(container: IContainer, data: MatchPointcutActionData) {
    // aspect class do nothing.
    if (!isValideAspectTarget(data.targetType)) {
      return;
    }

    let advisor = container.get(AdvisorToken);
    let matcher = container.get(AdviceMatcherToken);
    advisor.aspects.forEach((adviceMetas, type) => {
      let matchpoints = matcher.match(
        type,
        data.targetType,
        adviceMetas,
        data.target
      );
      matchpoints.forEach(mpt => {
        let fullName = mpt.fullName;
        let advice = mpt.advice;

        let advices = advisor.getAdvices(fullName);
        if (!advices) {
          advices = {
            Before: [],
            Pointcut: [],
            After: [],
            Around: [],
            AfterThrowing: [],
            AfterReturning: [],
          } as Advices;
          advisor.setAdvices(fullName, advices);
        }
        let advicer = Lang.assign(mpt, {
          aspectType: type,
        }) as Advicer;

        if (advice.adviceName === 'Before') {
          if (
            !advices.Before.some(a => this.isAdviceEquals(a.advice, advice))
          ) {
            advices.Before.push(advicer);
          }
        } else if (advice.adviceName === 'Pointcut') {
          if (
            !advices.Pointcut.some(a => this.isAdviceEquals(a.advice, advice))
          ) {
            advices.Pointcut.push(advicer);
          }
        } else if (advice.adviceName === 'Around') {
          if (
            !advices.Around.some(a => this.isAdviceEquals(a.advice, advice))
          ) {
            advices.Around.push(advicer);
          }
        } else if (advice.adviceName === 'After') {
          if (!advices.After.some(a => this.isAdviceEquals(a.advice, advice))) {
            advices.After.push(advicer);
          }
        } else if (advice.adviceName === 'AfterThrowing') {
          if (
            !advices.AfterThrowing.some(a =>
              this.isAdviceEquals(a.advice, advice)
            )
          ) {
            advices.AfterThrowing.push(advicer);
          }
        } else if (advice.adviceName === 'AfterReturning') {
          if (
            !advices.AfterReturning.some(a =>
              this.isAdviceEquals(a.advice, advice)
            )
          ) {
            advices.AfterReturning.push(advicer);
          }
        }
      });
    });
  }

  isAdviceEquals(advice1: AdviceMetadata, advice2: AdviceMetadata) {
    if (!advice1 || !advice2) {
      return false;
    }
    if (advice1 === advice2) {
      return true;
    }

    return (
      advice1.adviceName === advice2.adviceName &&
      advice1.pointcut === advice2.pointcut &&
      advice1.propertyKey === advice2.propertyKey
    );
  }
}
