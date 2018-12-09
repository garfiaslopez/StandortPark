export default [
	[
		{
			id: 'user_id',
			type: 'String',
			placeholder: 'Usuario_ID',
			prefixIcon: 'user',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'slot_id',
			type: 'String',
			placeholder: 'Cajon_ID',
			prefixIcon: 'car',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		},
		{
			id: 'folio',
			type: 'String',
			placeholder: 'Folio',
			prefixIcon: 'idcard',
			rules: [{ required: true }, { min: 3 }, { max: 32 }]
		}
	], 
	[
		{
			id: 'total',
			type: 'Number',
			placeholder: 'Total',
			prefixIcon: 'credit-card',
			options: { max: 120, min: 0, step: 15 },
			rules: [{ required: true }],
		},
		{
			id: 'date_in',
			type: 'Date',
			placeholder: 'Fecha Ingreso',
			prefixIcon: 'calendar',
			rules: [{ required: true }],
		},
		{
			id: 'date_out',
			type: 'Date',
			placeholder: 'Fecha Salida',
			prefixIcon: 'calendar',
			rules: [{ required: true }],
		}
	]
];