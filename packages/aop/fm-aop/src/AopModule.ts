import {
  IocExt,
  Inject,
  ContainerToken,
  IContainer,
  LifeScopeToken,
  IocState,
  LifeState,
} from '@ferrymen/fm-ioc-core';
import { Joinpoint } from './joinpoints';
import { Aspect } from './decorators';
import { AopActions, AopActionFactory } from './actions';
import { Advisor } from './Advisor';
import {
  ProxyMethod,
  AdvisorChain,
  AdvisorChainFactory,
  ReturningRecognizer,
  SyncProceeding,
} from './access';
import { AdviceMatcher } from './AdviceMatcher';

@IocExt('setup')
export class AopModule {
  constructor(@Inject(ContainerToken) private container: IContainer) {}
  /**
   * register aop for container.
   *
   */
  setup() {
    let container = this.container;
    container.register(Joinpoint);
    // container.register(AdvisorChainFactory);
    // container.register(ReturningRecognizer);
    // container.register(SyncProceeding);
    // container.register(AdvisorChain);
    // container.register(ProxyMethod);
    container.register(Advisor);
    container.register(AdviceMatcher);

    let lifeScope = container.get(LifeScopeToken);

    let factory = new AopActionFactory();
    lifeScope.addAction(
      factory.create(AopActions.registAspect),
      IocState.design
    );

    lifeScope.addAction(
      factory.create(AopActions.matchPointcut),
      IocState.runtime,
      LifeState.beforeConstructor
    );

    lifeScope.addAction(
      factory.create(AopActions.invokeBeforeConstructorAdvices),
      IocState.runtime,
      LifeState.beforeConstructor
    );

    lifeScope.registerDecorator(
      Aspect,
      AopActions.registAspect,
      AopActions.exetndsInstance
    );
  }
}
