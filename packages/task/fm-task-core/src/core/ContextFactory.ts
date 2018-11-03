import {
  Injectable,
  Inject,
  ContainerToken,
  IContainer,
  Type,
  Token,
} from '@ferrymen/fm-ioc-core';
import { IActivity } from './IActivity';
import {
  ActivityContext,
  InjectActivityContextToken,
  ActivityContextToken,
  InputDataToken,
} from './ActivityContext';

@Injectable
export class ContextFactory {
  @Inject(ContainerToken)
  container: IContainer;

  constructor(private type: Type<IActivity>) {}

  /**
   * create activity context.
   *
   */
  create(data?: any, type?: Token<IActivity>, defCtx?: Token<ActivityContext>) {
    type = type || this.type;
    return this.container.getRefService(
      InjectActivityContextToken,
      type,
      defCtx || ActivityContextToken,
      { provide: InputDataToken, useValue: data }
    );
  }
}
