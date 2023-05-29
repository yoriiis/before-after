module.exports = () => {
	return {
		plugins: {
			'postcss-import': {},
			'postcss-url': {},
			'postcss-preset-env': {
				stage: 2,
				features: {
					'custom-properties': {
						warnings: true,
						preserve: true
					}
				}
			},
			'postcss-nested': {},
			'postcss-custom-media': {
				preserve: false
			}
		}
	}
}
