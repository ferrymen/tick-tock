import {
  Injectable,
  Inject,
  ContainerToken,
  IContainer,
  Provider,
  Lang,
} from '@ferrymen/fm-ioc-core';

import { Advices, Advicer } from '../advices';

import { isUndefined, isArray } from 'util';
import { NonePointcut } from '../decorators';
import {
  AdvisorChainFactoryToken,
  IAdvisorChainFactory,
} from './IAdvisorChainFactory';
import { AdvisorToken, IAdvisor } from '../IAdvisor';
import { Joinpoint, JoinpointState } from '../joinpoints';
import { IAdvisorChain, AdvisorChainToken } from './IAdvisorChain';

@NonePointcut()
@Injectable(AdvisorChainFactoryToken)
export class AdvisorChainFactory implements IAdvisorChainFactory {
  constructor(
    @Inject(ContainerToken) private container: IContainer,
    @Inject(AdvisorToken) private advisor: IAdvisor,
    private advices: Advices
  ) {}

  getAdvicers(adviceType: string): Advicer[] {
    return (adviceType ? this.advices[adviceType] : null) || [];
  }

  invoaction(
    joinPoint: Joinpoint,
    state: JoinpointState,
    valueOrthrowing?: any
  ): void {
    joinPoint.state = state;
    joinPoint.returning = undefined;
    joinPoint.throwing = undefined;

    switch (state) {
      case JoinpointState.Before:
        this.before(joinPoint);
        break;
      case JoinpointState.Pointcut:
        this.pointcut(joinPoint);
        break;

      case JoinpointState.After:
        joinPoint.returning = valueOrthrowing;
        this.after(joinPoint);
        break;

      case JoinpointState.AfterThrowing:
        joinPoint.throwing = valueOrthrowing;
        this.afterThrowing(joinPoint);
        break;

      case JoinpointState.AfterReturning:
        joinPoint.returning = valueOrthrowing;
        this.afterReturning(joinPoint);
        break;
    }
  }

  before(joinPoint: Joinpoint) {
    let cloneJp = Lang.assign({}, joinPoint);
    this.getAdvicers('Around').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });

    if (!isUndefined(cloneJp.args)) {
      joinPoint.args = cloneJp.args;
    }

    this.getAdvicers('Before').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });
  }

  pointcut(joinPoint: Joinpoint) {
    let cloneJp = Lang.assign({}, joinPoint);
    this.getAdvicers('Pointcut').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });

    if (!isUndefined(cloneJp.args)) {
      joinPoint.args = cloneJp.args;
    }
  }

  after(joinPoint: Joinpoint) {
    let cloneJp = Lang.assign({}, joinPoint);
    this.getAdvicers('Around').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });

    this.getAdvicers('After').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });
  }

  afterThrowing(joinPoint: Joinpoint) {
    let cloneJp = Lang.assign({}, joinPoint);
    this.getAdvicers('Around').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });

    this.getAdvicers('AfterThrowing').forEach(advicer => {
      this.invokeAdvice(cloneJp, advicer);
    });
  }

  afterReturning(joinPoint: Joinpoint) {
    let cloneJp = Lang.assign({}, joinPoint);
    let advChain = this.container.resolve<IAdvisorChain>(AdvisorChainToken, {
      joinPoint: cloneJp,
    });
    this.getAdvicers('Around').forEach(advicer => {
      advChain.next(jp => {
        return this.invokeAdvice(jp, advicer);
      });
    });

    this.getAdvicers('AfterReturning').forEach(advicer => {
      advChain.next(jp => {
        return this.invokeAdvice(jp, advicer);
      });
    });

    advChain.next(jp => {
      if (!isUndefined(jp.returning)) {
        joinPoint.returning = jp.returning;
      }
      return joinPoint;
    });

    advChain.process();
  }

  invokeAdvice(joinPoint: Joinpoint, advicer: Advicer) {
    let providers = [];

    providers.push(
      Provider.createExtends(Joinpoint, joinPoint, (inst, provider) => {
        inst._cache_JoinPoint = provider.resolve(this.container);
      })
    );

    let metadata: any = advicer.advice;

    if (!isUndefined(joinPoint.args) && metadata.args) {
      providers.push(Provider.create(metadata.args, joinPoint.args));
    }

    if (metadata.annotationArgName) {
      providers.push(
        Provider.create(metadata.annotationArgName, () => {
          let curj = joinPoint;
          let annotations = curj.annotations;
          while (!annotations && joinPoint.provJoinpoint) {
            curj = joinPoint.provJoinpoint;
            if (curj && curj.annotations) {
              annotations = curj.annotations;
              break;
            }
          }

          if (isArray(annotations)) {
            if (metadata.annotationName) {
              let d: string = metadata.annotationName;
              d = /^@/.test(d) ? d : `@${d}`;
              return annotations.filter(a => a.decorator === d);
            }
            return annotations;
          } else {
            return [];
          }
        })
      );
    }

    if (!isUndefined(joinPoint.returning) && metadata.returning) {
      providers.push(Provider.create(metadata.returning, joinPoint.returning));
    }

    if (!isUndefined(joinPoint.throwing) && metadata.throwing) {
      providers.push(Provider.create(metadata.throwing, joinPoint.throwing));
    }

    return this.advisor
      .getContainer(advicer.aspectType, this.container)
      .syncInvoke<any>(
        advicer.aspectType,
        advicer.advice.propertyKey,
        null,
        ...providers
      );
  }
}
