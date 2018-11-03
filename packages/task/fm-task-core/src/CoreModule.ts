import {
  IocExt,
  Inject,
  ContainerToken,
  IContainer,
  CoreActions,
} from '@ferrymen/fm-ioc-core';
import { Workflow, Task } from './decorators';

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

    // container.bindProvider(InputDataToken, null);
    // container
    //   .use(injectors)
    //   .use(core)
    //   .register(RunAspect)
    //   .use(activites);
  }
}
