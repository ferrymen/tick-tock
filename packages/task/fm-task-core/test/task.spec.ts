import 'mocha';
import { expect } from 'chai';
import { ITaskContainer, ActivityRunner } from '../src';
import { TaskContainer } from './mock';

describe('auto register with build', () => {
  let container: ITaskContainer;
  before(async () => {
    container = TaskContainer.create(__dirname);
  });

  it('should bootstrap with single task.', async () => {
    let runner = await container.bootstrap(SimpleTask);
    expect(runner instanceof ActivityRunner).eq(true);
    let result = await runner.start();
    // console.log(result);
    expect(result).eq('simple task');
  });
});
