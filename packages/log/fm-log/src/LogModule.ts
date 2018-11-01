import {
  IContainer,
  Inject,
  IocExt,
  ContainerToken,
  LifeScopeToken,
  LifeState,
  CoreActions,
} from '@ferrymen/fm-ioc-core';
import { AopModule } from '@ferrymen/fm-aop';
import { Logger } from './decorators';
import { ConfigureLoggerManger } from './ConfigureLoggerManger';
import { ConsoleLogManager } from './ConsoleLogManager';
import { LogFormater } from './LogFormater';

/**
 * aop logs ext for Ioc. auto run setup after registered.
 * with @IocExt('setup') decorator.
 */
@IocExt('setup')
export class LogModule {
  constructor(@Inject(ContainerToken) private container: IContainer) {}

  /**
   * register aop for container.
   *
   */
  setup() {
    let container = this.container;
    if (!container.has(AopModule)) {
      container.register(AopModule);
    }
    let lifeScope = container.get(LifeScopeToken);
    lifeScope.registerDecorator(
      Logger,
      LifeState.onInit,
      CoreActions.bindParameterProviders
    );
    container.register(ConfigureLoggerManger);
    container.register(LogFormater);
    container.register(ConsoleLogManager);
  }
}
