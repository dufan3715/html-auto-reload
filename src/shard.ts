import { HtmlAutoReloadOption } from "./type";

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}

export const version = new Date().toLocaleString('en-US', dateTimeFormatOptions);

export const getScriptChildren = (publicPath: string, option: HtmlAutoReloadOption = {}) => {
  const versionUrl = publicPath.replace(/\/$/, '') + '/version.txt';
  const {
    onvisibilitychange = true,
    onerror = true,
    polling = false,
    prompt = true,
  } = option;
  const ms = typeof polling === 'number' ? polling : 1000 * 60;
  const promptContent = prompt === true ? '请求资源已更新，请刷新页面' : prompt;

  const funcStr = `
    /* eslint-disable */
    const localVersion = '${version}';
    ${polling ? `let timer;` : ''}
    const checkVersion = () => {
      const url = \`${versionUrl}?t=\${Date.now()}\`;
      fetch(url)
        .then(res => res.text())
        .then(remoteVersion => {
          if (
            remoteVersion &&
            remoteVersion.length === localVersion.length &&
            remoteVersion !== localVersion
          ) {
            const key = \`__html_auto_reload_\${remoteVersion}__\`;
            if (sessionStorage.getItem(key) !== 'Y') {
              sessionStorage.setItem(key, 'Y');
              ${promptContent ? `if (window.confirm('${promptContent}')) window.location.reload();` : `window.location.reload();`}
            }
          }
        })
    };
    ${onerror ? `
    function errorListener(event) {
      const error = event.reason || event;
      const source = event.target || event.srcElement;
      if (
        error.message?.includes('Loading chunk') ||
        source instanceof HTMLScriptElement ||
        source instanceof HTMLLinkElement
      ) {
        checkVersion();
      }
    }`
    : ''}
    function addEvent() {
      ${onvisibilitychange ? `
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) return;
        checkVersion();
      });`
    : ''}
      ${onerror ? `
      window.addEventListener('error', errorListener, { capture: true });`
    : ''}
      ${polling ? `
      timer = setInterval(() => {
        if (document.hidden) return;
        checkVersion();
      }, ${ms});`
    : ''}
    };
    addEvent();
  `.replace(/^\s*[\r\n]/gm, '');
  return `\n${funcStr}`;
};
