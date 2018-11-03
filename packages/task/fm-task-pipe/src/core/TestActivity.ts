// /**
//  * test activity token.
//  */
// export const TestAcitvityToken = new InjectPipeActivityToken<TestActivity>('test');

// /**
//  * test activity configure.
//  *
//  */
// export interface TestConfigure extends SourceConfigure {

//     /**
//      * set match test file source.
//      *
//      */
//     enable?: ExpressionType<boolean>;

//     /**
//      * test framewok. default use gulp-mocha to test.
//      *
//      */
//     framework?: TransformConfig;

//     /**
//      * test options.
//      *
//      */
//     options?: CtxType<any>;
// }

// /**
//  * test activity.
//  *
//  */
// @PipeTask(TestAcitvityToken)
// export class TestActivity extends SourceActivity {

//     /**
//      * task framework
//      *
//      */
//     framework: TransformType;

//     /**
//      * test options.
//      *
//      */
//     options: any;

//     /**
//      * eanble test or not.
//      *
//      */
//     enable: Expression<boolean>;

//     async onActivityInit(config: TestConfigure) {
//         await super.onActivityInit(config);
//         this.options = this.context.to(config.options);
//         if (!isUndefined(config.enable)) {
//             this.enable = await this.toExpression(config.enable);
//         }
//         if (config.framework) {
//             this.framework = await this.toExpression(config.framework);
//         } else {
//             this.framework = () => {
//                 let mocha = require('gulp-mocha');
//                 return this.options ? mocha(this.options) : mocha();
//             };
//         }
//     }

//     protected async afterPipe(ctx: PipeActivityContext): Promise<void> {
//         await super.afterPipe(ctx);
//         let test = await this.context.exec(this, this.enable, ctx);
//         if (test !== false) {
//             await this.executePipe(ctx.data, ctx, this.framework, true);
//         }
//     }
// }
