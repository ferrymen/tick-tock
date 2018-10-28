/**
 * Before component init.
 *
 */
export interface BeforeInit {
  /**
   * component before init hooks. after constructor befor property inject.
   *
   */
  beforeInit();
}

/**
 * on component init.
 *
 */
export interface OnInit {
  /**
   * component on init hooks. after property inject.
   *
   */
  onInit();
}

/**
 * after component init.
 *
 */
export interface AfterInit {
  /**
   * component after init hooks. after property inject.
   *
   */
  afterInit();
}

/**
 * after component destory.
 *
 */
export interface OnDestroy {
  /**
   * component after destory hooks. after property inject.
   *
   */
  onDestroy();
}

/**
 * component decorator class liefcycle hooks.
 *
 */
export interface ComponentLifecycle {
  /**
   * component before init hooks. after constructor befor property inject.
   *
   */
  beforeInit?();

  /**
   * component on init hooks. after property inject
   *
   */
  onInit?();

  /**
   * after component init.
   *
   */
  afterInit?();

  /**
   * component on destroy hooks.
   *
   */
  onDestroy?();
}
