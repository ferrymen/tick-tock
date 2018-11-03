import { Workflow, Task } from '../decorators';
import {
  BaseModuelValidate,
  Singleton,
  InjectModuleValidateToken,
} from '@ferrymen/fm-ioc-core';

export const WorkflowModuleValidateToken = new InjectModuleValidateToken(
  Workflow.toString()
);

@Singleton(WorkflowModuleValidateToken)
export class WorkflowModuleValidate extends BaseModuelValidate {
  getDecorator() {
    return [Workflow.toString(), Task.toString()];
  }
}
