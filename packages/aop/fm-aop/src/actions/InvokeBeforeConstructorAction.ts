import {
  ActionData,
  ActionComposite,
  IContainer,
  getClassName,
  Provider,
  Providers,
} from '@ferrymen/fm-ioc-core';

import {
  AdviceMetadata,
  isValideAspectTarget,
  AdvisorToken,
  Joinpoint,
  IJoinpoint,
  JoinpointState,
} from '..';

import { AopActions } from '.';

/**
 * action data for invoke before constructor action.
 *
 */
export interface InvokeBeforeConstructorActionData
  extends ActionData<AdviceMetadata> {}

/**
 * actions invoke before constructor.
 *
 */
export class InvokeBeforeConstructorAction extends ActionComposite {
  constructor() {
    super(AopActions.registAspect);
  }

  protected working(
    container: IContainer,
    data: InvokeBeforeConstructorActionData
  ) {
    // aspect class do nothing.
    if (!isValideAspectTarget(data.targetType)) {
      return;
    }

    let advisor = container.get(AdvisorToken);
    let className = getClassName(data.targetType);
    let advices = advisor.getAdvices(className + '.constructor');
    if (!advices) {
      return;
    }

    let targetType = data.targetType;
    let target = data.target;

    let joinPoint = container.resolve(
      Joinpoint,
      Provider.create('options', <IJoinpoint>{
        name: 'constructor',
        state: JoinpointState.Before,
        fullName: className + '.constructor',
        target: target,
        args: data.args,
        params: data.params,
        targetType: targetType,
      })
    );
    let providers: Providers[] = [Provider.create(Joinpoint, joinPoint)];

    if (data.providerMap) {
      providers.push(data.providerMap);
    }

    advices.Before.forEach(advicer => {
      advisor
        .getContainer(advicer.aspectType, container)
        .syncInvoke(
          advicer.aspectType,
          advicer.advice.propertyKey,
          null,
          ...providers
        ); // new Joinpoint(joinPoint) // container.resolve(Joinpoint, { json: joinPoint })
    });

    advices.Around.forEach(advicer => {
      advisor
        .getContainer(advicer.aspectType, container)
        .syncInvoke(
          advicer.aspectType,
          advicer.advice.propertyKey,
          null,
          ...providers
        );
    });
  }
}
