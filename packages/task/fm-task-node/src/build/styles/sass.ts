import { Task } from '@ferrymen/fm-task-core';

import { mkdir } from 'fs';
import { CompilerActivity } from '../CompilerActivity';
import { CompilerActivityContext } from '../CompilerActivityContext';
import path from 'path';
import fs from 'fs';

/**
 * SassBuilder activity.
 *
 */
@Task('sass')
export class SassBuilderActivity extends CompilerActivity {
  constructor() {
    super();
  }

  protected async execute(ctx: CompilerActivityContext): Promise<void> {
    let dist = path.join(ctx.builder.dist, ctx.handle.subDist);
    if (fs.existsSync(dist)) {
      mkdir('-p', dist as any);
    }
  }
}
