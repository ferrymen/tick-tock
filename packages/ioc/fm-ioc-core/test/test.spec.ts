import 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  AutoWired,
  Injectable,
  Inject,
  Singleton,
  Param,
} from '../src';
import {
  SimppleAutoWried,
  ClassRoom,
  MiddleSchoolStudent,
  InjMClassRoom,
  MClassRoom,
  CollegeClassRoom,
} from './debug';
// import * as debugModule from './debug';

describe('custom register test', () => {
  let container: IContainer;

  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();
    container = await builder.build();
  });

  it('decorator toString is decorator name', () => {
    expect(AutoWired.toString()).eq('@AutoWired');
    expect(Injectable.toString()).eq('@Injectable');
    expect(Singleton.toString()).eq('@Singleton');
    expect(Inject.toString()).eq('@Inject');
    expect(Param.toString()).eq('@Param');
  });

  it('should auto wried property', () => {
    container.register(SimppleAutoWried);

    let instance = container.get(SimppleAutoWried);
    expect(instance).not.undefined;
    expect(instance.dateProperty).not.undefined;
    expect(instance.dateProperty).instanceof(Date);
  });

  it('should auto create constructor params', () => {
    container.register(ClassRoom);
    let instance = container.get(ClassRoom);
    // console.log(instance);
    expect(instance).not.undefined;
    expect(instance.service).not.undefined;
    expect(instance.service.current).instanceOf(Date);
  });

  it('should auto create prop with spec @Inject class.', () => {
    container.register(MiddleSchoolStudent);
    container.register(InjMClassRoom);
    let instance = container.get(InjMClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.sayHi()).eq('I am a middle school student');
  });

  it('should auto create prop with spec @Param class.', () => {
    container.register(MClassRoom);
    let instance = container.get(MClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.sayHi()).eq('I am a middle school student');
  });

  it('should auto create constructor params with spec @Param class.', () => {
    container.register(CollegeClassRoom);
    let instance = container.get(CollegeClassRoom);
    expect(instance).not.undefined;
    expect(instance.leader).not.undefined;
    expect(instance.leader.sayHi()).eq('I am a college student');
  });
});
