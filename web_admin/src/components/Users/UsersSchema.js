export default [
	[
		{
			id: 'name',
			type: 'String',
			placeholder: 'Nombre Completo',
			prefixIcon: 'user',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'username',
			type: 'String',
			placeholder: 'Nombre de usuario',
			prefixIcon: 'user',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'password',
			type: 'String',
			placeholder: 'Contraseña',
			prefixIcon: 'key',
			rules: [{ required: true }, { min: 3 }, { max: 32 }],
		}
	],
	[
		
		{
			id: 'plates',
			type: 'String',
			placeholder: 'Placas',
			prefixIcon: 'car',
			rules: [{ required: true }, { min: 3 }, { max: 32 }],
		
		},
		{
			id: 'phone_number',
			type: 'String',
			placeholder: 'Numero de telefono',
			prefixIcon: 'phone',
			rules: [{ required: true }, { min: 3 }, { max: 32 }],
		
		},
		{
			id: 'email',
			type: 'String',
			placeholder: 'Email',
			prefixIcon: 'email',
			rules: [{ required: true }, { min: 3 }, { max: 32 }],
		}
	]
];