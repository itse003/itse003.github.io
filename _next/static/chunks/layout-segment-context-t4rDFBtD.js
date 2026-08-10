import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { r as require_react } from "./framework-CZh43tRa.js";
import { E as getLayoutSegmentContext } from "./navigation-errors-BLoiTHW_.js";
import "./index-B_043At-.js";
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/layout-segment-context.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Layout segment context provider.
*
* Must be "use client" so that Vite's RSC bundler renders this component in
* the SSR/browser environment where React.createContext is available. The RSC
* entry imports and renders LayoutSegmentProvider directly, but because of the
* "use client" boundary the actual execution happens on the SSR/client side
* where the context can be created and consumed by useSelectedLayoutSegment(s).
*
* Without "use client", this runs in the RSC environment where
* React.createContext is undefined, getLayoutSegmentContext() returns null,
* the provider becomes a no-op, and useSelectedLayoutSegments always returns [].
*
* The context is shared with navigation.ts via getLayoutSegmentContext()
* to avoid creating separate contexts in different modules.
*/
var committedSegmentMapsByProviderId = /* @__PURE__ */ new Map();
function mergeLayoutSegmentMap(previous, next) {
	if (!previous) return next;
	return {
		...previous,
		...next
	};
}
/**
* Wraps children with the layout segment context.
*
* Each layout in the App Router tree wraps its children with this provider,
* passing a map of parallel route key to segment path. The "children" key is
* always present (the default parallel route). Named parallel slots at this
* layout level add their own keys.
*
* Components inside the provider call useSelectedLayoutSegments(parallelRoutesKey)
* to read the segments for a specific parallel route.
*/
function LayoutSegmentProvider({ providerId, segmentMap, children }) {
	const previousSegmentMap = (0, import_react.useRef)(null);
	const ctx = getLayoutSegmentContext();
	const mergedSegmentMap = mergeLayoutSegmentMap(previousSegmentMap.current ?? (providerId ? committedSegmentMapsByProviderId.get(providerId) ?? null : null), segmentMap);
	(0, import_react.useEffect)(() => {
		previousSegmentMap.current = mergedSegmentMap;
		if (providerId) committedSegmentMapsByProviderId.set(providerId, mergedSegmentMap);
	}, [mergedSegmentMap, providerId]);
	if (!ctx) return children;
	return (0, import_react.createElement)(ctx.Provider, { value: mergedSegmentMap }, children);
}
//#endregion
export { LayoutSegmentProvider, mergeLayoutSegmentMap };
