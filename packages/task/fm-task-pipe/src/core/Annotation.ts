import { InjectPipeActivityToken } from './IPipeActivity';

import { IPipeConfigure } from './IPipeConfigure';

import { TransformType } from './pipeTypes';

import { PipeTask } from '../decorators';

import { PipeActivity } from './PipeActivity';

import { PipeActivityContext } from './PipeActivityContext';

/**
 * annotation activity token
 */
export const AnnotationAcitvityToken = new InjectPipeActivityToken<
  AnnotationActivity
>('Annotation');

export interface AnnotationsConfigure extends IPipeConfigure {
  /**
   * annotation framework.
   *
   */
  annotationFramework: TransformType;
}

/**
 * annotation activity.
 *
 */
@PipeTask(AnnotationAcitvityToken)
export class AnnotationActivity extends PipeActivity {
  /**
   * annotation framework.
   *
   */
  annotationFramework: TransformType;

  async onActivityInit(config: AnnotationsConfigure) {
    await super.onActivityInit(config);
    this.annotationFramework = await this.toExpression(
      config.annotationFramework
    );
  }

  /**
   * begin pipe.
   *
   */
  protected async beforePipe(ctx: PipeActivityContext): Promise<void> {
    await super.beforePipe(ctx);
    if (this.annotationFramework) {
      let annotation = await this.context.exec(
        this,
        this.annotationFramework,
        ctx
      );
      ctx.data = await this.pipeStream(ctx.data, ctx, annotation);
    }
  }
}
