import { LifeScope } from '../LifeScope';
import { ActionData } from './ActionData';
import { ActionComponent } from './actions';
import { IContainer } from '../IContainer';
import { Lang } from '../utils';

export class DefaultLifeScope {
  action: ActionComponent;

  constructor(private container: IContainer) {}

  execute<T>(data: ActionData<T>, ...names: string[]) {
    names = names.filter(n => !!n);
    let act: ActionComponent = this.action;
    names.forEach(name => {
      act = act.find(itm => itm.name === name);
    });
    if (act) {
      act.execute(this.container, data);
    }
  }

  routeExecute<T>(data: ActionData<T>, ...names: string[]) {
    this.execute(data, ...names);
    let container = this.container.parent;
    while (container) {
      container.getLifeScope().execute(Lang.assign({}, data), ...names);
      container = container.parent;
    }
  }

  addAction(action: ActionComponent, ...nodepaths: string[]): this {
    let parent = this.action;
    nodepaths.forEach(pathname => {
      parent = parent.find(act => act.name === pathname);
    });
    if (parent) {
      parent.add(action);
    }

    return this;
  }
}
