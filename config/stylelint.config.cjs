module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
	rules: {
		indentation: ['tab', { ignore: 'inside-parens' }],
		'unit-allowed-list': ['em', 'rem', '%', 'px', 's', 'deg', 'fr', 'vh', 'vw', 'ms'],
		'declaration-colon-newline-after': null,
		'value-list-comma-newline-after': null,
		'custom-property-pattern': [
			'([a-z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)?$',
			{
				message: 'Expected custom property name to be FUN-case'
			}
		],
		'selector-class-pattern': [
			'^([a-z][a-zA-Z0-9]*)(-[a-zA-Z0-9]+)?$',
			{
				message: 'Expected class selector to be FUN-case'
			}
		]
	}
}
