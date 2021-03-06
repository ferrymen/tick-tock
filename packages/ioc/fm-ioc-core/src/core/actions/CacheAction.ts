import { ActionData } from '../ActionData';
import { ClassMetadata } from '../metadatas';
import { IContainer } from '../../IContainer';
import { CacheManagerToken } from '../../ICacheManager';
import { isClass, isNumber } from '../../utils';
import { hasOwnClassMetadata, getOwnTypeMetadata } from '../factories';
import { ActionComposite } from './ActionComposite';
import { CoreActions } from './CoreActions';

/**
 * cache action data.
 *
 */
export interface CacheActionData extends ActionData<ClassMetadata> {}

/**
 * cache action. To cache instance of Token. define cache expires in decorator.
 *
 */
export class CacheAction extends ActionComposite {
  constructor() {
    super(CoreActions.cache);
  }

  protected working(container: IContainer, data: CacheActionData) {
    if (data.raiseContainer && data.raiseContainer !== container) {
      return data;
    }

    if (data.singleton || !data.targetType || !isClass(data.targetType)) {
      return data;
    }
    let cacheManager = container.get(CacheManagerToken);

    if (data.target) {
      if (!cacheManager.hasCache(data.targetType)) {
        let cacheMetadata = this.getCacheMetadata(container, data);
        if (cacheMetadata) {
          cacheManager.cache(
            data.targetType,
            data.target,
            cacheMetadata.expires
          );
        }
      }
    } else {
      let target = cacheManager.get(data.targetType);
      if (target) {
        let cacheMetadata = this.getCacheMetadata(container, data);
        if (cacheMetadata) {
          cacheManager.cache(data.targetType, target, cacheMetadata.expires);
          data.execResult = target;
        }
      }
    }

    return data;
  }

  getCacheMetadata(
    container: IContainer,
    data: CacheActionData
  ): ClassMetadata {
    let lifeScope = container.getLifeScope();
    let matchs = lifeScope.getClassDecorators(surm =>
      hasOwnClassMetadata(surm.name, data.targetType)
    );
    let cacheMetadata: ClassMetadata;
    for (let i = 0; i < matchs.length; i++) {
      let surm = matchs[i];
      let metadata = getOwnTypeMetadata<ClassMetadata>(
        surm.name,
        data.targetType
      );
      if (Array.isArray(metadata) && metadata.length > 0) {
        cacheMetadata = metadata.find(
          c => c && isNumber(c.expires) && c.expires > 0
        );
        if (cacheMetadata) {
          break;
        }
      }
    }
    return cacheMetadata;
  }
}
