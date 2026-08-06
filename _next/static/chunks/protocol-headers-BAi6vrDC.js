//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/utils/protocol-headers.js
/** Serialized middleware context (JSON) forwarded from dev server to RSC entry. */
var VINEXT_MW_CTX_HEADER = "x-vinext-mw-ctx";
/** Build-time prerender authentication secret. */
var VINEXT_PRERENDER_SECRET_HEADER = "x-vinext-prerender-secret";
/** URL-encoded JSON route params for build-time prerender renders. */
var VINEXT_PRERENDER_ROUTE_PARAMS_HEADER = "x-vinext-prerender-route-params";
/** Indicates a build-time prerender render is probing whether a route can be static. */
var VINEXT_PRERENDER_SPECULATIVE_HEADER = "x-vinext-prerender-speculative";
/** Comma-separated list of header names that middleware wants to override. */
var MIDDLEWARE_OVERRIDE_HEADERS = "x-middleware-override-headers";
/** Carries cookies set by middleware for same-render reads. */
var MIDDLEWARE_SET_COOKIE_HEADER = "x-middleware-set-cookie";
/** Skip-middleware signal. */
var MIDDLEWARE_SKIP_HEADER = "x-middleware-skip";
/** Generic prefix for all middleware internal headers. */
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-";
//#endregion
export { VINEXT_MW_CTX_HEADER as a, VINEXT_PRERENDER_SPECULATIVE_HEADER as c, MIDDLEWARE_SKIP_HEADER as i, MIDDLEWARE_OVERRIDE_HEADERS as n, VINEXT_PRERENDER_ROUTE_PARAMS_HEADER as o, MIDDLEWARE_SET_COOKIE_HEADER as r, VINEXT_PRERENDER_SECRET_HEADER as s, MIDDLEWARE_HEADER_PREFIX as t };
