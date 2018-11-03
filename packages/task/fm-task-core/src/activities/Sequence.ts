import {
  InjectAcitityToken,
  IActivity,
  SequenceConfigure,
  ActivityType,
  ActivityContext,
  ContextActivity,
} from '../core';
import { Task } from '../decorators';

/**
 * sequence activity token
 */
export const SequenceActivityToken = new InjectAcitityToken<SequenceActivity>(
  'sequence'
);

/**
 * sequence activity.
 *
 */
@Task(SequenceActivityToken)
export class SequenceActivity extends ContextActivity {
  activities: IActivity[];

  async onActivityInit(config: SequenceConfigure): Promise<any> {
    this.activities = this.activities || [];
    await super.onActivityInit(config);
    if (config.sequence && config.sequence.length) {
      await this.buildChildren(this, config.sequence);
    }
  }

  async buildChildren(
    activity: SequenceActivity,
    configs: ActivityType<IActivity>[]
  ) {
    let sequence = await Promise.all(
      configs.map(cfg => this.buildActivity(cfg))
    );
    activity.activities = sequence;
    return activity;
  }

  protected async execute(ctx: ActivityContext): Promise<void> {
    let execPromise = Promise.resolve();
    this.activities.forEach(task => {
      execPromise = execPromise.then(pdata => task.run(ctx));
    });
    await execPromise;
  }
}
