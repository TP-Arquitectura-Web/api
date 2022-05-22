var mongoose = require('mongoose');

export const LlamadaSchema = new mongoose.Schema(
	{
		nombre: { type: String, lowercase: true },		
	},
	{
		timestamps: true
	}
);

export let llamada = mongoose.model('Llamada', LlamadaSchema, 'llamada');
