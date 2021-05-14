import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "../../src/hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/uuum/_app/start-2065fffb.js",
			css: ["/uuum/_app/assets/start-a8cd1609.css"],
			js: ["/uuum/_app/start-2065fffb.js","/uuum/_app/chunks/vendor-4eb29b52.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/uuum/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"robots.txt","size":67,"type":"text/plain"},{"file":"svelte-welcome.png","size":360807,"type":"image/png"},{"file":"svelte-welcome.webp","size":115470,"type":"image/webp"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/about\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/about.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/todos\.json$/,
						params: empty,
						load: () => import("../../src/routes/todos/index.json.js")
					},
		{
						type: 'page',
						pattern: /^\/todos\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/todos/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/todos\/([^/]+?)\.json$/,
						params: (m) => ({ uid: d(m[1])}),
						load: () => import("../../src/routes/todos/[uid].json.js")
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/about.svelte": () => import("../../src/routes/about.svelte"),"src/routes/todos/index.svelte": () => import("../../src/routes/todos/index.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/uuum/_app/pages/__layout.svelte-9181365d.js","css":["/uuum/_app/assets/pages/__layout.svelte-3e3fdbc6.css"],"js":["/uuum/_app/pages/__layout.svelte-9181365d.js","/uuum/_app/chunks/vendor-4eb29b52.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/uuum/_app/error.svelte-caf41c4a.js","css":[],"js":["/uuum/_app/error.svelte-caf41c4a.js","/uuum/_app/chunks/vendor-4eb29b52.js"],"styles":null},"src/routes/index.svelte":{"entry":"/uuum/_app/pages/index.svelte-d0897d0b.js","css":["/uuum/_app/assets/pages/index.svelte-078f1a0b.css"],"js":["/uuum/_app/pages/index.svelte-d0897d0b.js","/uuum/_app/chunks/vendor-4eb29b52.js"],"styles":null},"src/routes/about.svelte":{"entry":"/uuum/_app/pages/about.svelte-7ef77538.js","css":["/uuum/_app/assets/pages/about.svelte-4db5be0d.css"],"js":["/uuum/_app/pages/about.svelte-7ef77538.js","/uuum/_app/chunks/vendor-4eb29b52.js"],"styles":null},"src/routes/todos/index.svelte":{"entry":"/uuum/_app/pages/todos/index.svelte-a6140a97.js","css":["/uuum/_app/assets/pages/todos/index.svelte-ef0435f2.css"],"js":["/uuum/_app/pages/todos/index.svelte-a6140a97.js","/uuum/_app/chunks/vendor-4eb29b52.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"/uuum","assets":"/uuum"} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}