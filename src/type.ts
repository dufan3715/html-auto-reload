import type { Plugin } from 'vite';
import type { Compiler } from 'webpack';

export type { Plugin, Compiler };

export type HtmlAutoReloadOption = {
  /**
   * Whether to get version on visibilitychange
   * @default true
   */
  onvisibilitychange?: boolean;
  /**
   * Whether to get version when load chunk error
   * @default true
   */
  onerror?: boolean;
  /**
   * Whether to poll to get version, and polling interval
   * polling interval time unit: ms, default 1000 * 60 ms
   * @default false
   */
  polling?: boolean | number;
  /**
   * Whether to prompt
   * @default "请求资源已更新，请刷新页面"
   */
  prompt?: boolean | string | null;
};