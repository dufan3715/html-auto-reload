import { PluginOption, ResolvedConfig } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { getScriptChildren, version, HtmlAutoReloadOption } from './shard';

export const HtmlAutoReloadVitePlugin = (option: HtmlAutoReloadOption = {}): PluginOption => {
  let config: ResolvedConfig;
  return {
    name: 'html-auto-reload:vite',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml() {
      return [{
        tag: 'script',
        attrs: { type: 'module' },
        children: getScriptChildren(config.base || '/', option),
        injectTo: 'body',
      }];
    },
    closeBundle() {
      const outputDir = resolve(config.build.outDir);
      const outputPath = resolve(outputDir, 'version.txt');
      writeFileSync(outputPath, version);
    },
  };
};

export default HtmlAutoReloadVitePlugin;
