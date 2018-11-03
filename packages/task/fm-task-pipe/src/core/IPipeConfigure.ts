/**
 * pipe configure.
 *
 */
export interface IPipeConfigure extends ActivityConfigure {
  /**
   * transform pipes
   *
   */
  pipes?: TransformExpress;
}
