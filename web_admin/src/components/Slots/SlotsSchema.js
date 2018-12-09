export default [
	[
		{
			id: 'denomination',
			type: 'String',
			placeholder: 'Nombre de Cajon',
			prefixIcon: 'home',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'address',
			type: 'String',
			placeholder: 'Dirección',
			prefixIcon: 'environment',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'status',
			type: 'String',
			placeholder: 'Estado',
			prefixIcon: 'wifi',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		}
	], 
	[
		{
			id: 'location.coordinates[0]',
			type: 'Number',
			placeholder: 'Longitud',
			prefixIcon: 'environment',
			options: { max: 180, min: -180, step: 0.1 },
			rules: [{ required: true }],
		},
		{
			id: 'location.coordinates[1]',
			type: 'Number',
			placeholder: 'Latitud',
			prefixIcon: 'environment',
			options: { max: 90, min: -90, step: 0.1 },
			rules: [{ required: true }],
		}
	]
];