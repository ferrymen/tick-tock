import {
  ActionComposite,
  IContainer,
  ActionData,
  ClassMetadata,
  hasOwnClassMetadata,
  getOwnTypeMetadata,
  isClass,
} from '@ferrymen/fm-ioc-core';
import { AopActions } from './AopActions';
import { IAdvisor, AdvisorToken } from '../IAdvisor';

/**
 * regist aspect action data.
 *
 * @export
 * @interface RegistAspectActionData
 * @extends {ActionData<ClassMetadata>}
 */
export interface RegistAspectActionData extends ActionData<ClassMetadata> {}

/**
 * regist aspect action.
 *
 */
export class RegistAspectAction extends ActionComposite {
  constructor() {
    super(AopActions.registAspect);
  }

  protected working(container: IContainer, data: RegistAspectActionData) {
    let type = data.targetType;
    let lifeScope = container.getLifeScope();
    let matchs = lifeScope.getClassDecorators(
      surm =>
        surm.actions.includes(AopActions.registAspect) &&
        hasOwnClassMetadata(surm.name, type)
    );
    let aspectMgr = container.get<IAdvisor>(AdvisorToken);
    let raiseContainer = data.raiseContainer || container;
    matchs.forEach(surm => {
      let metadata = getOwnTypeMetadata<ClassMetadata>(surm.name, type);
      if (Array.isArray(metadata) && metadata.length > 0) {
        metadata.forEach(meta => {
          if (isClass(meta.type)) {
            aspectMgr.add(meta.type, raiseContainer);
          }
        });
      }
    });
  }
}
