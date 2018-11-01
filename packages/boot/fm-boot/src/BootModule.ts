import {
  IocExt,
  Inject,
  ContainerToken,
  IContainer,
  LifeScopeToken,
  CoreActions,
} from '@ferrymen/fm-ioc-core';
import { DIModule } from './decorators';
import * as modus from './modules';
import * as boot from './boot';
import * as annotations from './annotations';

/**
 * Bootstrap ext for ioc. auto run setup after registered.
 * with @IocExt('setup') decorator.
 * @class BootModule
 */

@IocExt('setup')
export class BootModule {
  constructor(@Inject(ContainerToken) private container: IContainer) {}

  /**
   * register aop for container.
   *
   */
  setup() {
    let container = this.container;

    let lifeScope = container.get(LifeScopeToken);

    lifeScope.registerDecorator(
      DIModule,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );

    container.use(annotations, modus, boot);
  }
}
