export default [
	[
		{
			id: 'username',
			type: 'String',
			placeholder: 'Nombre de usuario',
			prefixIcon: 'user',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'name',
			type: 'String',
			placeholder: 'Nombre',
			prefixIcon: 'user',
			rules: [{ required: true }, { min: 3 }, { max: 32 }],
		},
		{
			id: 'password',
			type: 'String',
			placeholder: 'Contraseña',
			prefixIcon: 'key',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		}
	]
];