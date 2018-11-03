import { Injectable, isBoolean, isString } from '@ferrymen/fm-ioc-core';

import { AssetBuilderToken, AssetConfigure } from './AssetConfigure';

import { PipeActivityBuilder } from './PipeActivityBuilder';

import { IActivity, Src } from '@ferrymen/fm-task-core';

import { AssetActivity } from './AssetActivity';

import { SourceActivity, SourceConfigure } from './SourceActivity';

import { DestActivity, DestConfigure } from './DestActivity';

import { AnnotationActivity, AnnotationsConfigure } from './Annotation';

import { SourceMapsActivity, SourceMapsConfigure } from './SourceMapsActivity';

import { UglifyActivity, UglifyConfigure } from './UglifyActivity';

/**
 * Asset task builder
 *
 */
@Injectable(AssetBuilderToken)
export class AssetBuilder extends PipeActivityBuilder {
  /**
   * asset build strategy.
   *
   */
  async buildStrategy(
    activity: IActivity,
    config: AssetConfigure
  ): Promise<IActivity> {
    await super.buildStrategy(activity, config);
    if (activity instanceof AssetActivity) {
      activity.src = await this.toActivity<
        Src,
        SourceActivity,
        SourceConfigure
      >(
        config.src,
        activity,
        act => act instanceof SourceActivity,
        src => {
          return { src: src, task: SourceActivity };
        }
      );

      if (config.test) {
        activity.test = await this.toActivity<Src, TestActivity, TestConfigure>(
          config.test,
          activity,
          act => act instanceof TestActivity,
          src => {
            if (!src) {
              return null;
            }
            return <TestConfigure>{
              src: src,
              task: TestActivity,
              framework: options => {
                let mocha = require('gulp-mocha');
                return options ? mocha(options) : mocha();
              },
            };
          }
        );
      }

      if (config.dest) {
        activity.dest = await this.toActivity<
          string,
          DestActivity,
          DestConfigure
        >(
          config.dest,
          activity,
          act => act instanceof DestActivity,
          dest => {
            return { dest: dest, task: DestActivity };
          }
        );
      }

      if (config.annotation) {
        activity.annotation = await this.toActivity<
          string | boolean,
          AnnotationActivity,
          AnnotationsConfigure
        >(
          config.annotation,
          activity,
          act => act instanceof AnnotationActivity,
          dest => {
            if (isBoolean(dest)) {
              if (dest) {
                return this.getDefaultAnnotation(activity);
              }
              return null;
            }
            return <AnnotationsConfigure>{
              annotationFramework: require(dest),
              task: AnnotationActivity,
            };
          },
          cfg => {
            if (isString(cfg)) {
              <AnnotationsConfigure>{
                annotationFramework: require(cfg),
                task: AnnotationActivity,
              };
            }
            return cfg;
          }
        );
      }

      if (config.watch) {
        activity.watch = await this.toActivity<
          Src | boolean,
          WatchActivity,
          WatchConfigure
        >(
          config.watch,
          activity,
          act => act instanceof WatchActivity,
          watch => {
            if (isBoolean(watch)) {
              if (watch && activity.src) {
                return <WatchConfigure>{
                  src: activity.src.src,
                  task: WatchActivity,
                };
              }
              return null;
            }
            return <WatchConfigure>{ src: watch, task: WatchActivity };
          }
        );
      }

      if (config.sourcemaps) {
        activity.sourcemaps = await this.toActivity<
          boolean | string,
          SourceMapsActivity,
          SourceMapsConfigure
        >(
          config.sourcemaps,
          activity,
          act => act instanceof SourceMapsActivity,
          sourcemaps => {
            if (isBoolean(sourcemaps)) {
              if (sourcemaps) {
                return { sourcemaps: '', task: SourceMapsActivity };
              }
              return null;
            }
            return { sourcemaps: sourcemaps, task: SourceMapsActivity };
          }
        );
      }

      if (config.uglify) {
        activity.uglify = await this.toActivity<
          any,
          UglifyActivity,
          UglifyConfigure
        >(
          config.uglify,
          activity,
          act => act instanceof UglifyActivity,
          uglify => {
            if (isBoolean(uglify)) {
              if (uglify) {
                return { task: UglifyActivity };
              }
              return null;
            }
            return <UglifyConfigure>{
              uglifyOptions: uglify,
              task: UglifyActivity,
            };
          }
        );
      }
    }

    return activity;
  }

  /**
   * get default activity.
   *
   */
  getDefaultAcitvity() {
    return AssetActivity;
  }

  /**
   * get default annotation.
   *
   */
  protected getDefaultAnnotation(
    activity: AssetActivity
  ): AnnotationsConfigure {
    return activity.defaultAnnotation;
  }
}