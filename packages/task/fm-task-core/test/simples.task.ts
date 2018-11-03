import { Activity, Task, ActivityContext } from '../src';

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
