import { Activity, Task, ActivityContext, SequenceActivity } from '../src';

@Task('test')
export class SimpleTask extends Activity<any> {
  protected async execute(ctx: ActivityContext): Promise<void> {
    // console.log('before simple task:', this.name);
    ctx.data = await Promise.resolve('simple task').then(val => {
      console.log('return simple task:', val);
      return val;
    });
  }
}

@Task('comptest')
export class SimpleCTask extends SequenceActivity {
  protected async after(ctx: ActivityContext): Promise<void> {
    // console.log('before component task:', this.name);
    ctx.data = await Promise.resolve('component task').then(val => {
      console.log('return component task:', val);
      return val;
    });
  }
}

@Task({
  name: 'test-module',
  activity: SequenceActivity,
  sequence: [
    {
      name: 'test------3',
      task: SimpleTask,
    },
    {
      name: 'test------4',
      task: SimpleCTask,
    },
  ],
})
export class TaskModuleTest {
  // extends SequenceActivity {
}
