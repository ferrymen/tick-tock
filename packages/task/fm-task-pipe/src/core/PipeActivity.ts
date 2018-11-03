/**
 * Pipe activity.
 *
 */
@PipeTask(PipeActivityToken)
export class PipeActivity extends NodeActivity implements IPipeActivity {
  /**
   * pipes.
   *
   */
  pipes: TransformType[];
  /**
   * stream merger.
   *
   */
  merger: TransformType;

  /**
   * pipe config.
   *
   */
  config: IPipeConfigure;

  /**
   * run task.
   *
   */
  protected async execute(ctx: PipeActivityContext) {
    await this.beforePipe(ctx);
    await this.pipe(ctx);
    await this.afterPipe(ctx);
  }

  /**
   * execute pipe.
   *
   */
  protected async pipe(ctx: PipeActivityContext): Promise<void> {
    ctx.data = await this.pipeStream(ctx.data, ctx, ...this.pipes);
  }

  /**
   * create activity context.
   *
   */
  protected verifyCtx(input?: any): PipeActivityContext {
    let ctx: PipeActivityContext = super.verifyCtx(
      input
    ) as PipeActivityContext;
    if (!(ctx instanceof PipeActivityContext)) {
      ctx = this.ctxFactory.create(ctx) as PipeActivityContext;
    }
    return ctx;
  }

  /**
   * begin pipe.
   *
   */
  protected async beforePipe(ctx: PipeActivityContext): Promise<void> {}

  /**
   * end pipe.
   *
   */
  protected async afterPipe(ctx: PipeActivityContext): Promise<void> {}

  /**
   * stream pipe transform.
   *
   */
  protected async pipeStream(
    stream: ITransform,
    ctx: PipeActivityContext,
    ...pipes: TransformType[]
  ): Promise<ITransform> {
    if (pipes.length < 1) {
      return stream;
    }

    if (pipes.length === 1) {
      return await this.executePipe(stream, ctx, pipes[0]);
    }

    let pstream = Promise.resolve(stream);
    pipes.forEach(transform => {
      if (transform) {
        pstream = pstream.then(stm => {
          return this.executePipe(stm, ctx, transform);
        });
      }
    });
    return await pstream;
  }

  /**
   * execute pipe.
   *
   */
  protected async executePipe(
    stream: ITransform,
    ctx: PipeActivityContext,
    transform: TransformType,
    waitend = false
  ): Promise<ITransform> {
    let next: ITransform = await this.context.exec(this, transform, ctx);
    let piped = false;
    if (isTransform(stream)) {
      if (isTransform(next)) {
        if (!next.changeAsOrigin) {
          piped = true;
          next = stream.pipe(next);
        }
      } else {
        next = stream;
      }
    }

    if (piped && waitend) {
      return await new Promise((resolve, reject) => {
        next
          .once('end', () => {
            resolve();
          })
          .once('error', reject);
      }).then(
        () => {
          next.removeAllListeners('error');
          next.removeAllListeners('end');
          return next;
        },
        err => {
          next.removeAllListeners('error');
          next.removeAllListeners('end');
          if (!isUndefined(process)) {
            process.exit(1);
            return err;
          } else {
            return Promise.reject(new Error(err));
          }
        }
      );
    } else {
      return next;
    }
  }
}
