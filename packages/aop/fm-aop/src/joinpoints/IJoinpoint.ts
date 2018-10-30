import {
  IParameter,
  MethodMetadata,
  Type,
  InjectToken,
} from '@ferrymen/fm-ioc-core';
import { IPointcut } from './IPointcut';
import { JoinpointState } from './JoinpointState';
import { Advicer } from '../advices';

/**
 * Aop IJoinpoint interface token.
 * it is a token id, you can register yourself IJoinpoint for this.
 */
export const JoinpointToken = new InjectToken<IJoinpoint>('DI_IJoinpoint');

/**
 * Joinpoint interface
 *
 */
export interface IJoinpoint extends IPointcut {
  /**
   * prov joinpoint.
   *
   */
  provJoinpoint: IJoinpoint;

  /**
   * join point state.
   *
   */
  state: JoinpointState;
  /**
   * params of pointcut.
   *
   */
  params: IParameter[];
  /**
   * args of pointcut.
   *
   */
  args: any[];
  /**
   * pointcut returing data
   *
   */
  returning?: any;

  /**
   * the result value of returing.
   *
   */
  returningValue?: any;

  /**
   * pointcut throwing error.
   *
   */
  throwing?: any;

  /**
   * Advicer of joinpoint.
   *
   */
  advicer: Advicer;

  /**
   * orgin pointcut method metadatas.
   *
   */
  annotations: MethodMetadata[];

  /**
   * pointcut target instance
   *
   */
  target: any;
  /**
   * pointcut target type.
   *
   */
  targetType: Type<any>;
}
