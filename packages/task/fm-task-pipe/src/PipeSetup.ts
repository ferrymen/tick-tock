import {
  IocExt,
  Inject,
  ContainerToken,
  IContainer,
  CoreActions,
} from '@ferrymen/fm-ioc-core';

@IocExt('setup')
export class PipeSetup {
  constructor(@Inject(ContainerToken) private container: IContainer) {}
  setup() {
    let lifeScope = this.container.getLifeScope();
    lifeScope.registerDecorator(
      PipeTask,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );
    lifeScope.registerDecorator(
      Assets,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );
    lifeScope.registerDecorator(
      AssetTask,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );
    lifeScope.registerDecorator(
      Package,
      CoreActions.bindProvider,
      CoreActions.cache,
      CoreActions.componentBeforeInit,
      CoreActions.componentInit,
      CoreActions.componentAfterInit
    );
  }
}
