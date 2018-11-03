import {
  Registration,
  Token,
  MetadataAdapter,
  MetadataExtends,
  isToken,
  isString,
  isObject,
} from '@ferrymen/fm-ioc-core';
import { WorkflowMetadata } from '../metadatas';
import {
  IDIModuleDecorator,
  IModuleBuilder,
  createDIModuleDecorator,
} from '@ferrymen/fm-boot';
import { IActivityBuilder } from '../core';

/**
 * workflow decorator.
 *
 */
export interface IWorkflowDecorator<T extends WorkflowMetadata>
  extends IDIModuleDecorator<T> {
  /**
   * task decorator, use to define class as task element.
   *
   * @Workflow
   *
   */
  (metadata?: T): ClassDecorator;

  /**
   * task decorator, use to define class as task element.
   *
   */
  (
    provide: Registration<any> | symbol | string,
    alias?: string
  ): ClassDecorator;

  /**
   * task decorator, use to define class as task element.
   *
   */
  (
    provide: Registration<any> | symbol | string,
    builder?: Token<IActivityBuilder>,
    alias?: string
  ): ClassDecorator;

  /**
   * task decorator, use to define class as task element.
   *
   * @Task
   */
  (target: Function): void;
}

export function createWorkflowDecorator<T extends WorkflowMetadata>(
  name: string,
  builder?: Token<IModuleBuilder<any>>,
  annotationBuilder?: Token<IActivityBuilder> | IActivityBuilder,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): IWorkflowDecorator<T> {
  return createDIModuleDecorator(
    name,
    builder,
    annotationBuilder,
    args => {
      if (adapter) {
        adapter(args);
      }
      args.next<WorkflowMetadata>({
        match: arg =>
          arg &&
          (isString(arg) || (isObject(arg) && arg instanceof Registration)),
        setMetadata: (metadata, arg) => {
          if (isString(arg)) {
            metadata.name = arg;
          } else {
            (metadata as any).provide = arg;
          }
        },
      });

      args.next<WorkflowMetadata>({
        match: arg => isString(arg) || isToken(arg),
        setMetadata: (metadata, arg) => {
          if (isString(arg)) {
            metadata.name = arg;
          } else {
            (metadata as any).annotationBuilder = arg;
          }
        },
      });

      args.next<WorkflowMetadata>({
        match: arg => isString(arg),
        setMetadata: (metadata, arg) => {
          metadata.name = arg;
        },
      });
    },
    metadataExtends
  ) as IWorkflowDecorator<T>;
}

/**
 * Workflow decorator, define for class as workflow.
 *
 * @Workflow
 */
export const Workflow: IWorkflowDecorator<
  WorkflowMetadata
> = createWorkflowDecorator<WorkflowMetadata>('Workflow');
