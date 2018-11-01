import {
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
} from '@ferrymen/fm-ioc-core';
import { Aspect, Around, Joinpoint } from '@ferrymen/fm-aop';
import { LoggerAspect } from '../src';

@Singleton
@Aspect
export class DebugLogAspect extends LoggerAspect {
  constructor(@Inject(ContainerToken) container: IContainer) {
    super(container);
  }

  @Around('execution(*.*)')
  logging2(joinPoint: Joinpoint) {
    this.processLog(joinPoint);
  }
}
