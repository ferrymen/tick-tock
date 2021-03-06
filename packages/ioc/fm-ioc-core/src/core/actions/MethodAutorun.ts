import { ActionData } from '../ActionData';
import { AutorunMetadata } from '../metadatas';
import { ActionComposite } from './ActionComposite';
import { IContainer } from '../../IContainer';
import { Lang, isNumber } from '../../utils';
import { CoreActions } from './CoreActions';
import { hasMethodMetadata, getMethodMetadata } from '../factories';
import { Autorun } from '../decorators';

/**
 * auto run action data.
 *
 */
export interface MethodAutorunActionData extends ActionData<AutorunMetadata> {}

/**
 * Inject DrawType action.
 *
 */
export class MethodAutorun extends ActionComposite {
  constructor() {
    super(CoreActions.methodAutorun);
  }

  protected working(container: IContainer, data: MethodAutorunActionData) {
    if (data.raiseContainer && data.raiseContainer !== container) {
      return;
    }
    if (data.target && data.targetType) {
      if (hasMethodMetadata(Autorun, data.targetType)) {
        let metas = getMethodMetadata<AutorunMetadata>(
          Autorun,
          data.targetType
        );
        let lastmetas: AutorunMetadata[] = [];
        let idx = Lang.keys(metas).length;
        Lang.forIn(metas, (mm, key: string) => {
          if (mm && mm.length) {
            let m = mm[0];
            m.autorun = key;
            idx++;
            if (!isNumber(m.order)) {
              m.order = idx;
            }
            lastmetas.push(m);
          }
        });

        lastmetas
          .sort((au1, au2) => {
            return au1.order - au1.order;
          })
          .forEach(aut => {
            container.syncInvoke(data.targetType, aut.autorun, data.target);
          });
      }
    }
  }
}
