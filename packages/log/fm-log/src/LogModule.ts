import {
  IContainer,
  Inject,
  IocExt,
  ContainerToken,
} from '@ferrymen/fm-ioc-core';

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
    console.log('this is LogModule...');
  }
}
