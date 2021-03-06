import 'mocha';
import { expect } from 'chai';
import { IContainer } from '@ferrymen/fm-ioc-core';

import { ContainerBuilder } from '../src';
import {
  SimppleAutoWried,
  ClassRoom,
  MClassRoom,
  CollegeClassRoom,
  InjMClassRoom,
  InjCollegeClassRoom,
  Student,
  StringIdTest,
  SymbolIdest,
} from './debug';

describe('auto register with build', () => {
  let container: IContainer;
  before(async () => {
    let builder = new ContainerBuilder();
    container = await builder.build({
      files: __dirname + '/debug.ts',
    });
    // container.register(IocLog);
  });

  it('should auto wried property', () => {
    let instance = container.get(SimppleAutoWried);
    expect(instance).not.undefined;
    expect(instance.dateProperty).not.undefined;
    expect(instance.dateProperty).instanceOf(Date);
  });

  it('should auto create constructor params', () => {
    let instance = container.get(ClassRoom);
    // console.log(instance);
    expect(instance).not.undefined;
    expect(instance.service).not.undefined;
    expect(instance.service.current).instanceOf(Date);
  });

  it('should auto create prop with spec @Param class.', () => {
    let instance = container.get(MClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.join).instanceOf(Date);
    expect(instance.leader.sayHi()).eq('I am a middle school student');
  });

  it('should auto create constructor params with spec @Param class.', () => {
    let instance = container.get(CollegeClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.join).instanceOf(Date);
    expect(instance.leader.sayHi()).eq('I am a college student');
  });

  it('should auto create prop with spec @Inject class.', () => {
    let instance = container.get(InjMClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.join).instanceOf(Date);
    expect(instance.leader.sayHi()).eq('I am a middle school student');
  });

  it('should auto create constructor params with spec @Inject class.', () => {
    let instance = container.get(InjCollegeClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.join).instanceOf(Date);
    expect(instance.leader.sayHi()).eq('I am a college student');
  });

  it('should provider implement sub class to abstract class', () => {
    let instance = container.get(Student);
    expect(instance).not.undefined;
    // console.log(instance.sayHi());
    expect(instance.join).instanceOf(Date);
    expect(instance.sayHi()).eq('I am a middle school student');

    let instance2 = container.get(Student, 'college');
    // console.log(instance2);
    expect(instance2).not.undefined;
    expect(instance2.join).instanceOf(Date);
    expect(instance2.sayHi()).eq('I am a college student');
  });

  it('should work with sting id to get class', () => {
    let instance = container.get(StringIdTest);
    expect(instance).not.undefined;
    expect(instance.room).not.undefined;
    expect(instance.room.leader).not.undefined;
    expect(instance.room.leader.join).instanceOf(Date);
    expect(instance.room.leader.sayHi()).eq('I am a middle school student');
  });

  it('should work with Symbol id to get class', () => {
    let instance = container.get(SymbolIdest);
    expect(instance).not.undefined;
    expect(instance.container).not.undefined;
    expect(instance.room).not.undefined;
    expect(instance.room.leader).not.undefined;
    expect(instance.room.leader.join).instanceOf(Date);
    expect(instance.room.leader.container).not.undefined;
    expect(instance.room.leader.sayHi()).eq('I am a college student');
  });
});
