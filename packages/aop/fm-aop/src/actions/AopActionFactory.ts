import { ActionComponent } from '@ferrymen/fm-ioc-core';
import { AopActions } from './AopActions';
import { RegistAspectAction } from './RegistAspectAction';
import { MatchPointcutAction } from './MatchPointcutAction';
import { InvokeBeforeConstructorAction } from './InvokeBeforeConstructorAction';

/**
 * aop action factory.
 *
 */
export class AopActionFactory {
  create(type: string): ActionComponent {
    let action: ActionComponent;
    switch (type) {
      case AopActions.registAspect:
        action = new RegistAspectAction();
        break;

      case AopActions.matchPointcut:
        action = new MatchPointcutAction();
        break;

      case AopActions.invokeBeforeConstructorAdvices:
        action = new InvokeBeforeConstructorAction();
        break;

      // case AopActions.invokeAfterConstructorAdvices:
      //   action = new InvokeAfterConstructorAction();
      //   break;

      // case AopActions.bindMethodPointcut:
      //   action = new BindMethodPointcutAction();
      //   break;

      // case AopActions.bindPropertyPointcut:
      //     action = new BindPropertyPointcutAction();
      //     break;

      // case AopActions.exetndsInstance:
      //   action = new ExetndsInstanceAction();
      //   break;
    }
    return action;
  }
}
