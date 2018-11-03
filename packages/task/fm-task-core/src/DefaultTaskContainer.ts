import { ITaskContainer } from './ITaskContainer';
import {
  IContainer,
  LoadType,
  Token,
  Factory,
  Type,
  hasClassMetadata,
  isToken,
  Lang,
} from '@ferrymen/fm-ioc-core';
import {
  IApplicationBuilder,
  ApplicationEvents,
  DefaultAnnotationBuilderToken,
  DefaultServiceToken,
  DefaultModuleBuilderToken,
  DefaultApplicationBuilder,
  AppConfigure,
} from '@ferrymen/fm-boot';
import { AopModule, Aspect } from '@ferrymen/fm-aop';
import { LogModule } from '@ferrymen/fm-log';
import {
  WorkflowModuleValidate,
  WorkflowModuleInjector,
  WorkflowModuleInjectorToken,
  WorkflowBuilderToken,
} from './injectors';
import { CoreModule } from './CoreModule';
import {
  ActivityBuilderToken,
  ActivityRunnerToken,
  IActivityRunner,
  Active,
  UUIDToken,
  RandomUUIDFactory,
  SequenceConfigure,
} from './core';
import { SequenceActivity } from './activities';

/**
 * default task container.
 *
 */
export class DefaultTaskContainer implements ITaskContainer {
  constructor(public baseURL: string) {}

  protected container: IContainer;
  getContainer(): IContainer {
    if (!this.container) {
      this.container = this.getBuilder()
        .getPools()
        .getDefault();
    }
    return this.container;
  }

  protected builder: IApplicationBuilder<any>;
  getBuilder(): IApplicationBuilder<any> {
    if (!this.builder) {
      this.builder = this.createAppBuilder();
      this.builder.on(
        ApplicationEvents.onRootContainerCreated,
        (container: IContainer) => {
          container
            .register(WorkflowModuleValidate)
            .register(WorkflowModuleInjector);
          let chain = container.getBuilder().getInjectorChain(container);
          chain.first(container.resolve(WorkflowModuleInjectorToken));
        }
      );
      this.builder
        .use(AopModule)
        .use(LogModule)
        .use(CoreModule)
        .provider(DefaultAnnotationBuilderToken, ActivityBuilderToken)
        .provider(DefaultServiceToken, ActivityRunnerToken)
        .provider(DefaultModuleBuilderToken, WorkflowBuilderToken);
    }
    return this.builder;
  }

  protected createAppBuilder(): IApplicationBuilder<any> {
    return new DefaultApplicationBuilder(this.baseURL);
  }

  /**
   * use custom configuration.
   *
   */
  useConfiguration(config?: string | AppConfigure): this {
    this.getBuilder().useConfiguration(config);
    return this;
  }

  /**
   * use module
   *
   */
  use(...modules: LoadType[]): this {
    this.getBuilder().use(...modules);
    return this;
  }

  /**
   * bind provider
   *
   */
  provider(provide: Token<any>, provider: Token<any> | Factory<any>): this {
    this.getBuilder().provider(provide, provider);
    return this;
  }

  useLog(logAspect: Type<any>): this {
    if (hasClassMetadata(Aspect, logAspect)) {
      this.getBuilder().use(logAspect);
    } else {
      console.error('logAspect param is not right aspect');
    }
    return this;
  }

  getWorkflow<T>(workflowId: string): IActivityRunner<T> {
    return this.getContainer().resolve(workflowId);
  }

  /**
   * create workflow.
   *
   */
  async createActivity(
    activity: Active,
    workflowId?: string
  ): Promise<IActivityRunner<any>> {
    let boot: Active;
    workflowId = workflowId || this.createUUID();

    if (isToken(activity)) {
      boot = activity;
    } else {
      boot = activity || {};
      boot.id = workflowId;
      if (!boot.token) {
        boot.builder = boot.builder || WorkflowBuilderToken;
        boot.annotationBuilder = boot.annotationBuilder || ActivityBuilderToken;
      }
    }
    let env = this.getBuilder()
      .getPools()
      .create();
    let runner = (await this.getBuilder().bootstrap(
      boot,
      env,
      workflowId
    )) as IActivityRunner<any>;
    this.getContainer().bindProvider(workflowId, runner);
    return runner;
  }

  protected createUUID() {
    let container = this.getContainer();
    if (!container.has(UUIDToken)) {
      container.register(RandomUUIDFactory);
    }
    return container.get(UUIDToken).generate();
  }

  /**
   * create workflow and bootstrap.
   *
   */
  async bootstrap(...activites: Active[]): Promise<IActivityRunner<any>> {
    let workflow =
      activites.length > 1
        ? <SequenceConfigure>{ sequence: activites, activity: SequenceActivity }
        : Lang.first(activites);
    let runner = await this.createActivity(workflow);
    return runner;
  }

  /**
   * run task.
   *
   */
  run(...activites: Active[]): Promise<IActivityRunner<any>> {
    return this.bootstrap(...activites);
  }
}
