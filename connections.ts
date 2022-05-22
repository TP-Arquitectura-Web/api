import * as mongoose from 'mongoose';
import * as configPrivate from './config.private';

function schemaDefaults(schema) {
	schema.set('toJSON', {
		virtuals: true,
		versionKey: false
	});
}

export class Connections {
	static main: mongoose.Connection;

	/**
     * Inicializa las conexiones a MongoDB
     *
     * @static
     *
     * @memberOf Connections
     */
	static initialize() {
		// Configura Mongoose
		(mongoose as any).Promise = global.Promise;
		mongoose.plugin(schemaDefaults);

		// Conecta y configura conexiones
		// 1. PRINCIPAL
		mongoose.connect(configPrivate.hosts.mongoDB_main.host, configPrivate.hosts.mongoDB_main.options);
		this.main = mongoose.connection;
	}
}
