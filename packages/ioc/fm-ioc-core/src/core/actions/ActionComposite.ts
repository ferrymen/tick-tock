import { ActionComponent } from './ActionComponent';
import { IContainer } from '../../IContainer';
import { ActionData } from '../ActionData';
import { Metadate } from '../metadatas';
import { GComposite } from '../../components';
import { NullAction } from './NullAction';

/**
 * action composite
 *
 */
export class ActionComposite extends GComposite<ActionComponent>
  implements ActionComponent {
  parent: ActionComponent;
  protected children: ActionComponent[];
  constructor(name: string) {
    super(name);
    this.children = [];
  }

  insert(node: ActionComponent, index: number): this {
    node.parent = this;
    if (index < 0) {
      index = 0;
    } else if (index >= this.children.length) {
      index = this.children.length - 1;
    }
    this.children.splice(index, 0, node);
    return this;
  }

  execute(container: IContainer, data: ActionData<Metadate>, name?: string) {
    if (name) {
      this.find(it => it.name === name).execute(container, data);
    } else {
      this.trans(action => {
        if (action instanceof ActionComposite) {
          action.working(container, data);
        }
      });
    }
  }

  empty() {
    return NullAction;
  }

  protected working(container: IContainer, data: ActionData<any>) {
    // do nothing.
  }
}
