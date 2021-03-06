import 'reflect-metadata';
import { Type, AbstractType, ObjectMap } from '../../types';
import {
  Metadate,
  ClassMetadata,
  MethodMetadata,
  PropertyMetadata,
  ParameterMetadata,
} from '../metadatas';
import {
  isClass,
  isMetadataObject,
  isAbstractDecoratorClass,
  isNumber,
  isUndefined,
  isFunction,
  isArray,
  Lang,
} from '../../utils';
import { ArgsIterator } from './ArgsIterator';
import { DecoratorType } from './DecoratorType';

export const ParamerterName = 'paramerter_names';

export interface MetadataAdapter {
  (args: ArgsIterator);
}

/**
 * extend metadata.
 *
 */
export interface MetadataExtends<T> {
  (metadata: T): T;
}

export interface MetadataTarget<T> {
  (target: Type<any> | object): Type<any> | object;
}

/**
 * decorator for all.
 *
 */
export interface IDecorator<T extends Metadate> {
  /**
   * define decorator setting with params.
   *
   */
  (provider: string | symbol | Type<any>, alias?: string): any;
  /**
   * define decorator setting with metadata map.
   *
   */
  (metadata?: T): any;
  (target: Type<any>): void;
  (target: object, propertyKey: string | symbol): void;
  (target: object, propertyKey: string | symbol, parameterIndex: number): void;
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void;
}

/**
 * create dectorator for class params props methods.
 *
 */
export function createDecorator<T>(
  name: string,
  adapter?: MetadataAdapter,
  metadataExtends?: MetadataExtends<T>
): any {
  let metaName = `@${name}`;

  let factory = (...args: any[]) => {
    let metadata: T = null;
    if (args.length < 1) {
      return (...args: any[]) => {
        return storeMetadata(name, metaName, args, metadata, metadataExtends);
      };
    }
    metadata = argsToMetadata(args, adapter);
    if (metadata) {
      return (...args: any[]) => {
        return storeMetadata(name, metaName, args, metadata, metadataExtends);
      };
    } else {
      if (args.length === 1) {
        if (!isClass(args[0])) {
          return (...args: any[]) => {
            return storeMetadata(
              name,
              metaName,
              args,
              metadata,
              metadataExtends
            );
          };
        }
      }
    }

    return storeMetadata(name, metaName, args, metadata, metadataExtends);
  };

  factory.toString = () => metaName;
  (<any>factory).decoratorType = DecoratorType.All;
  return factory;
}

function argsToMetadata<T>(args: any[], adapter?: MetadataAdapter): T {
  let metadata: T = null;
  if (args.length) {
    if (adapter) {
      let iterator = new ArgsIterator(args);
      adapter(iterator);
      metadata = iterator.getMetadata() as T;
    } else if (args.length === 1 && isMetadataObject(args[0])) {
      metadata = args[0];
    }
  }
  return metadata;
}

function storeMetadata<T>(
  name: string,
  metaName: string,
  args: any[],
  metadata?: any,
  metadataExtends?: MetadataExtends<T>
) {
  let target;
  switch (args.length) {
    case 1:
      target = args[0];
      if (isClass(target) || isAbstractDecoratorClass(target)) {
        setTypeMetadata(name, metaName, target, metadata, metadataExtends);
        return target;
      }
      break;
    case 2:
      target = args[0];
      let propertyKey = args[1];
      setPropertyMetadata(
        name,
        metaName,
        target,
        propertyKey,
        metadata,
        metadataExtends
      );
      break;
    case 3:
      if (isNumber(args[2])) {
        target = args[0];
        let propertyKey = args[1];
        let parameterIndex = args[2];
        setParamMetadata(
          name,
          metaName,
          target,
          propertyKey,
          parameterIndex,
          metadata,
          metadataExtends
        );
      } else if (isUndefined(args[2])) {
        target = args[0];
        let propertyKey = args[1];
        setPropertyMetadata(
          name,
          metaName,
          target,
          propertyKey,
          metadata,
          metadataExtends
        );
      } else {
        target = args[0];
        let propertyKey = args[1];
        let descriptor = args[2];
        setMethodMetadata(
          name,
          metaName,
          target,
          propertyKey,
          descriptor,
          metadata,
          metadataExtends
        );
        return descriptor;
      }
      break;
    default:
      throw new Error(`Invalid @${name} Decorator declaration.`);
  }
}

/**
 * get all class metadata of one specail decorator in target type.
 *
 */
export function getTypeMetadata<T>(
  decorator: string | Function,
  target: Type<any> | AbstractType<T>
): T[] {
  let annotations = Reflect.getOwnMetadata(
    isFunction(decorator) ? decorator.toString() : decorator,
    target
  );
  annotations = isArray(annotations) ? annotations : [];
  return annotations;
}

/**
 * get own class metadata of one specail decorator in target type.
 *
 */
export function getOwnTypeMetadata<T>(
  decorator: string | Function,
  target: Type<any> | AbstractType<T>
): T[] {
  let annotations = Reflect.getOwnMetadata(
    isFunction(decorator) ? decorator.toString() : decorator,
    target
  );
  annotations = isArray(annotations) ? annotations : [];
  return annotations;
}

/**
 * has class decorator metadata.
 *
 */
export function hasClassMetadata(
  decorator: string | Function,
  target: Type<any> | object
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  return Reflect.hasMetadata(name, target);
}

/**
 * has own class decorator metadata.
 *
 */
export function hasOwnClassMetadata(
  decorator: string | Function,
  target: Type<any> | object
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  return Reflect.hasOwnMetadata(name, target);
}

function setTypeMetadata<T extends ClassMetadata>(
  name: string,
  metaName: string,
  target: Type<T> | AbstractType<T>,
  metadata?: T,
  metadataExtends?: MetadataExtends<any>
) {
  let annotations = getOwnTypeMetadata(metaName, target).slice(0);
  // let designParams = Reflect.getMetadata('design:paramtypes', target) || [];
  let typeMetadata = (metadata || {}) as T;
  if (!typeMetadata.type) {
    typeMetadata.type = target;
  }
  typeMetadata.decorator = name;

  if (metadataExtends) {
    typeMetadata = metadataExtends(typeMetadata);
  }
  annotations.unshift(typeMetadata);

  setParamerterNames(target);
  Reflect.defineMetadata(metaName, annotations, target);
}

let methodMetadataExt = '__method';
/**
 * get all method metadata of one specail decorator in target type.
 *
 */
export function getMethodMetadata<T extends MethodMetadata>(
  decorator: string | Function,
  target: Type<any>
): ObjectMap<T[]> {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let meta = Reflect.getMetadata(name + methodMetadataExt, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getMetadata(name + methodMetadataExt, target.constructor);
  }
  return isArray(meta) ? {} : meta || {};
}

/**
 * get own method metadata of one specail decorator in target type.
 *
 */
export function getOwnMethodMetadata<T extends MethodMetadata>(
  decorator: string | Function,
  target: Type<any>
): ObjectMap<T[]> {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let meta = Reflect.getOwnMetadata(name + methodMetadataExt, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getOwnMetadata(name + methodMetadataExt, target.constructor);
  }
  return isArray(meta) ? {} : meta || {};
}

/**
 * has own method decorator metadata.
 *
 */
export function hasOwnMethodMetadata(
  decorator: string | Function,
  target: Type<any>,
  propertyKey?: string | symbol
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  if (propertyKey) {
    let meta = getOwnMethodMetadata<any>(name, target);
    return meta && meta.hasOwnProperty(propertyKey);
  } else {
    return Reflect.hasOwnMetadata(name + methodMetadataExt, target);
  }
}

/**
 * has method decorator metadata.
 *
 */
export function hasMethodMetadata(
  decorator: string | Function,
  target: Type<any>,
  propertyKey?: string | symbol
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  if (propertyKey) {
    let meta = getMethodMetadata<any>(name, target);
    return meta && meta.hasOwnProperty(propertyKey);
  } else {
    return Reflect.hasMetadata(name + methodMetadataExt, target);
  }
}

function setMethodMetadata<T extends MethodMetadata>(
  name: string,
  metaName: string,
  target: Type<T>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
  metadata?: T,
  metadataExtends?: MetadataExtends<any>
) {
  let meta = Lang.assign({}, getOwnMethodMetadata(metaName, target));
  meta[propertyKey] = meta[propertyKey] || [];

  let methodMeadata = (metadata || {}) as T;
  methodMeadata.decorator = name;
  methodMeadata.propertyKey = propertyKey;
  // methodMeadata.descriptor = descriptor;

  if (metadataExtends) {
    methodMeadata = metadataExtends(methodMeadata);
  }
  meta[propertyKey].unshift(methodMeadata);
  Reflect.defineMetadata(
    metaName + methodMetadataExt,
    meta,
    target.constructor
  );
}

let propertyMetadataExt = '__props';
/**
 * get all property metadata of one specail decorator in target type.
 *
 */
export function getPropertyMetadata<T extends PropertyMetadata>(
  decorator: string | Function,
  target: Type<any>
): ObjectMap<T[]> {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let meta = Reflect.getMetadata(name + propertyMetadataExt, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getMetadata(name + propertyMetadataExt, target.constructor);
  }
  return isArray(meta) ? {} : meta || {};
}

/**
 * get own property metadata of one specail decorator in target type.
 *
 */
export function getOwnPropertyMetadata<T extends PropertyMetadata>(
  decorator: string | Function,
  target: Type<any>
): ObjectMap<T[]> {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let meta = Reflect.getOwnMetadata(name + propertyMetadataExt, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getOwnMetadata(
      name + propertyMetadataExt,
      target.constructor
    );
  }
  return isArray(meta) ? {} : meta || {};
}

/**
 * has property decorator metadata.
 *
 */
export function hasPropertyMetadata(
  decorator: string | Function,
  target: Type<any>,
  propertyKey?: string | symbol
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  if (propertyKey) {
    let meta = getPropertyMetadata<any>(name, target);
    return meta && meta.hasOwnProperty(propertyKey);
  } else {
    return Reflect.hasMetadata(name + propertyMetadataExt, target);
  }
}

function setPropertyMetadata<T extends PropertyMetadata>(
  name: string,
  metaName: string,
  target: Type<T>,
  propertyKey: string,
  metadata?: T,
  metadataExtends?: MetadataExtends<any>
) {
  let meta = Lang.assign({}, getOwnPropertyMetadata(metaName, target));
  let propmetadata = (metadata || {}) as T;

  propmetadata.propertyKey = propertyKey;
  propmetadata.decorator = name;
  if (!propmetadata.type) {
    let t = Reflect.getMetadata('design:type', target, propertyKey);
    if (!t) {
      // Needed to support react native inheritance
      t = Reflect.getMetadata('design:type', target.constructor, propertyKey);
    }
    propmetadata.type = t;
  }

  if (metadataExtends) {
    propmetadata = metadataExtends(propmetadata);
  }

  if (!meta[propertyKey] || !isArray(meta[propertyKey])) {
    meta[propertyKey] = [];
  }

  meta[propertyKey].unshift(propmetadata);
  Reflect.defineMetadata(
    metaName + propertyMetadataExt,
    meta,
    target.constructor
  );
}

let paramsMetadataExt = '__params';
/**
 * get paramerter metadata of one specail decorator in target method.
 *
 */
export function getParamMetadata<T extends ParameterMetadata>(
  decorator: string | Function,
  target: Type<any> | object,
  propertyKey?: string | symbol
): T[][] {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let parameters = Reflect.getMetadata(
    name + paramsMetadataExt,
    target,
    propertyKey
  );
  parameters = isArray(parameters) ? parameters : [];
  return parameters;
}

/**
 * get own paramerter metadata of one specail decorator in target method.
 *
 */
export function getOwnParamMetadata<T extends ParameterMetadata>(
  decorator: string | Function,
  target: Type<any> | object,
  propertyKey?: string | symbol
): T[][] {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  let parameters = Reflect.getOwnMetadata(
    name + paramsMetadataExt,
    target,
    propertyKey
  );
  parameters = isArray(parameters) ? parameters : [];
  return parameters;
}

/**
 * has param decorator metadata.
 *
 */
export function hasParamMetadata(
  decorator: string | Function,
  target: Type<any> | object,
  propertyKey?: string | symbol
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  return Reflect.hasMetadata(name + paramsMetadataExt, target, propertyKey);
}

/**
 * has param decorator metadata.
 *
 */
export function hasOwnParamMetadata(
  decorator: string | Function,
  target: Type<any> | object,
  propertyKey?: string | symbol
): boolean {
  let name = isFunction(decorator) ? decorator.toString() : decorator;
  return Reflect.hasOwnMetadata(name + paramsMetadataExt, target, propertyKey);
}

function setParamMetadata<T extends ParameterMetadata>(
  name: string,
  metaName: string,
  target: Type<T>,
  propertyKey: string,
  parameterIndex: number,
  metadata?: T,
  metadataExtends?: MetadataExtends<any>
) {
  let parameters: any[][] = getOwnParamMetadata(
    metaName,
    target,
    propertyKey
  ).slice(0);
  // there might be gaps if some in between parameters do not have annotations.
  // we pad with nulls.
  while (parameters.length <= parameterIndex) {
    parameters.push(null);
  }

  parameters[parameterIndex] = parameters[parameterIndex] || [];

  let paramMeadata = (metadata || {}) as ParameterMetadata;

  if (!paramMeadata.type) {
    let t = Reflect.getOwnMetadata('design:type', target, propertyKey);
    if (!t) {
      // Needed to support react native inheritance
      t = Reflect.getOwnMetadata(
        'design:type',
        target.constructor,
        propertyKey
      );
    }
    paramMeadata.type = t;
  }
  paramMeadata.propertyKey = propertyKey;
  paramMeadata.decorator = name;
  paramMeadata.index = parameterIndex;
  if (metadataExtends) {
    paramMeadata = metadataExtends(paramMeadata);
  }
  parameters[parameterIndex].unshift(paramMeadata);
  Reflect.defineMetadata(
    metaName + paramsMetadataExt,
    parameters,
    target,
    propertyKey
  );
}

export function getParamerterNames(
  target: Type<any> | AbstractType<any>
): ObjectMap<string[]> {
  let meta = Reflect.getMetadata(ParamerterName, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getMetadata(ParamerterName, target.constructor);
  }
  return isArray(meta) ? {} : meta || {};
}

export function getOwnParamerterNames(
  target: Type<any> | AbstractType<any>
): ObjectMap<string[]> {
  let meta = Reflect.getOwnMetadata(ParamerterName, target);
  if (!meta || isArray(meta) || !Lang.hasField(meta)) {
    meta = Reflect.getOwnMetadata(ParamerterName, target.constructor);
  }
  return isArray(meta) ? {} : meta || {};
}

export function setParamerterNames(target: Type<any> | AbstractType<any>) {
  let meta = Lang.assign({}, getParamerterNames(target));
  let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
  let isUglify = /^[a-z]/.test(target.name);
  let anName = '';
  if (target.classAnnations && target.classAnnations.params) {
    anName = target.classAnnations.name;
    meta = Lang.assign(meta, target.classAnnations.params);
  }
  if (!isUglify && target.name !== anName) {
    Lang.forIn(descriptors, (item, name) => {
      if (name !== 'constructor') {
        if (item.value) {
          meta[name] = getParamNames(item.value);
        }
        if (item.set) {
          meta[name] = getParamNames(item.set);
        }
      }
    });
    meta['constructor'] = getParamNames(target.prototype.constructor);
  }

  Reflect.defineMetadata(ParamerterName, meta, target);
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  if (!isFunction(func)) {
    return [];
  }
  let fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) {
    result = [];
  }
  return result;
}
