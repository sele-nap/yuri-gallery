export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CMjgL9nZ.js",app:"_app/immutable/entry/app.BuYJPQAp.js",imports:["_app/immutable/entry/start.CMjgL9nZ.js","_app/immutable/chunks/Cdvfbyxu.js","_app/immutable/chunks/DwJuiUu3.js","_app/immutable/chunks/OHcLh-Le.js","_app/immutable/entry/app.BuYJPQAp.js","_app/immutable/chunks/DwJuiUu3.js","_app/immutable/chunks/D8ryNI38.js","_app/immutable/chunks/D0H7xmoZ.js","_app/immutable/chunks/OHcLh-Le.js","_app/immutable/chunks/DH46Tfgu.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
