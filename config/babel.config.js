export default function babelConfig(api) {
	api.cache(true)
	return {
		presets: [['@babel/preset-env']]
	}
}
