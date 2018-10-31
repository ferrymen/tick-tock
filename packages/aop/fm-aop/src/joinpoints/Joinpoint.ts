import {
  Type,
  IParameter,
  Injectable,
  MethodMetadata,
} from '@ferrymen/fm-ioc-core';
import { IJoinpoint, JoinpointToken } from './IJoinpoint';
import { NonePointcut } from '../decorators';
import { JoinpointState } from './JoinpointState';
import { Advicer } from '../advices';

/**
 * Join point data.
 *
 */
@Injectable(JoinpointToken)
@NonePointcut()
export class Joinpoint implements IJoinpoint {
  /**
   * method name
   *
   */
  name: string;

  /**
   * prov joinpoint.
   *
   */
  provJoinpoint: IJoinpoint;
  /**
   * full name.
   *
   */
  fullName: string;
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
   * pointcut returing
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
   * advicer of joinpoint
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

  constructor(options: IJoinpoint) {
    this.provJoinpoint = options.provJoinpoint;
    this.name = options.name;
    this.fullName = options.fullName;
    this.params = options.params || [];
    this.args = options.args;
    this.returning = options.returning;
    this.throwing = options.throwing;
    this.state = options.state;
    this.advicer = options.advicer;
    this.annotations = options.annotations;
    this.target = options.target;
    this.targetType = options.targetType;
  }
}
