import {
  Inject,
  ContainerToken,
  IContainer,
  Express,
  IRecognizer,
  RecognizerToken,
} from '@ferrymen/fm-ioc-core';
import { Joinpoint } from '../joinpoints';
import { IAdvisorChain } from './IAdvisorChain';
import { AdvisorProceedingToken } from './IAdvisorProceeding';

export class AdvisorChain implements IAdvisorChain {
  @Inject(ContainerToken)
  container: IContainer;

  protected actions: Express<Joinpoint, any>[];

  constructor(protected joinPoint: Joinpoint) {
    this.actions = [];
  }

  next(action: Express<Joinpoint, any>) {
    this.actions.push(action);
  }

  getRecognizer(): IRecognizer {
    return this.container.get(RecognizerToken, this.joinPoint.state);
  }

  process(): void {
    let alias = this.getRecognizer().recognize(this.joinPoint.returning);
    this.container
      .get(AdvisorProceedingToken, alias)
      .proceeding(this.joinPoint, ...this.actions);
  }
}
