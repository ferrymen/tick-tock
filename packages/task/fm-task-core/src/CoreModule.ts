import {
  IocExt,
  Inject,
  ContainerToken,
  IContainer,
  CoreActions,
} from '@ferrymen/fm-ioc-core';
import { Workflow, Task } from './decorators';
import { InputDataToken } from './core';
import * as injectors from './injectors';
import * as activites from './activities';
import * as core from './core';
import { RunAspect } from './aop';

@IocExt('setup')
export class CoreModule {
  constructor(@Inject(ContainerToken) private container: IContainer) {}

  setup() {
    let container = this.container;
    let lifeScope = container.getLifeScope();
    lifeScope.registerDecorator(
      Workflow,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );
    lifeScope.registerDecorator(
      Task,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );

    container.bindProvider(InputDataToken, null);
    container
      .use(injectors)
      .use(core)
      .register(RunAspect)
      .use(activites);
  }
}
