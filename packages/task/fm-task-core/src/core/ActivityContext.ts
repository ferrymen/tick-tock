import { IActivity } from './IActivity';
import {
  InjectToken,
  Registration,
  Token,
  Injectable,
  Inject,
  isNullOrUndefined,
} from '@ferrymen/fm-ioc-core';
import { IContext, ContextToken } from './IContext';
import { Activity } from './Activity';
import { Events } from '@ferrymen/fm-boot';
import { ITranslator } from './Translator';

/**
 * activity run context.
 *
 */
export interface IActivityContext<T> {
  /**
   * input data
   *
   */
  input: any;

  /**
   * execute activity.
   *
   */
  execute?: IActivity;

  /**
   * target activiy.
   *
   */
  target?: IActivity;

  /**
   * evn context.
   *
   */
  context: IContext;

  /**
   * ge activity execute result.
   *
   */
  readonly execResult: any;
}

/**
 * inpit data token.
 */
export const InputDataToken = new InjectToken<any>('Context_Inputdata');

/**
 * inject actitiy context token.
 *
 */
export class InjectActivityContextToken extends Registration<ActivityContext> {
  constructor(type: Token<IActivity>) {
    super(type, 'AContext');
  }
}

/**
 * Activity Context Token.
 */
export const ActivityContextToken = new InjectActivityContextToken(Activity);

/**
 * base activity context.
 *
 */
@Injectable(ActivityContextToken)
export class ActivityContext extends Events implements IActivityContext<any> {
  protected _input: any;
  /**
   * execute data.
   *
   */
  // protected data: any;
  public data: any;

  /**
   * execute activity.
   *
   */
  execute: IActivity;

  /**
   * target activiy.
   *
   */
  target: IActivity;

  constructor(
    @Inject(InputDataToken) public input: any,
    @Inject(ContextToken) public context: IContext
  ) {
    super();
    this.setExecResult(input);
  }

  /**
   * execute Resulte.
   *
   */
  get execResult() {
    return this.data;
  }

  setExecResult(data: any) {
    if (!isNullOrUndefined(data)) {
      data = this.translate(data);
    }
    if (data !== this.data) {
      this.emit('resultChanged', data);
    }
    this.data = data;
  }

  protected translate(data: any): any {
    let translator = this.getTranslator(data);
    if (translator) {
      return translator.translate(data);
    }
    return data;
  }

  protected getTranslator(input: any): ITranslator {
    return null;
  }
}
