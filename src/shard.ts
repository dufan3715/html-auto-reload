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
    once = true,
    polling = false,
    promptContent = '请求资源已更新，请刷新页面',
  } = option;
  const ms = typeof polling === 'number' ? polling : 1000 * 60;

  const funcStr = `
    /* eslint-disable */
    const localVersion = '${version}';
    const key = \`__html_auto_reload_\${localVersion}__\`;
    let confirmed = sessionStorage.getItem(key) === 'Y';
    ${polling ? `let timer;` : ''}
    const checkVersion = () => {
      if (confirmed) return;
      const url = \`${versionUrl}?t=\${Date.now()}\`;
      fetch(url)
        .then(res => res.text())
        .then(remoteVersion => {
          if (confirmed) return;
          if (
            remoteVersion &&
            remoteVersion.length === localVersion.length &&
            remoteVersion !== localVersion
          ) {
            ${once ? `confirmed = true;` : ''}
            sessionStorage.setItem(key, 'Y')
            if (window.confirm('${promptContent}')) {
              window.location.reload();
            } ${once ? `else { removeEvent(); }` : ''}
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
    const controller = new AbortController();
    function removeEvent() {
      controller.abort();
      ${polling ? `window.clearInterval(timer);` : ''}
    };
    function addEvent() {
      ${onvisibilitychange ? `
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) return;
        checkVersion();
      }, { signal: controller.signal });`
    : ''}
      ${onerror ? `
      window.addEventListener('error', errorListener, { capture: true, signal: controller.signal });`
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
