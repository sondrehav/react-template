import type { Plugin } from 'vite';

export type InjectCSPPoliciesPluginOptions = { content?: string };

/**
 * This plugin injects CSP headers in the head tag of the index page.
 * @param content See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
const injectCSPPoliciesPlugin = ({
  content,
}: InjectCSPPoliciesPluginOptions): Plugin => ({
  name: 'inject-csp-policies',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      if (!content) return html;
      return html.replace(
        /<\/head>/gm,
        () =>
          `<meta http-equiv="Content-Security-Policy" content="${content}" /></head>` ||
          '</head>',
      );
    },
  },
});

export default injectCSPPoliciesPlugin;
