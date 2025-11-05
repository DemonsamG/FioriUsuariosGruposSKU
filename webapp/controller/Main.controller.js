sap.ui.define([
	"./BaseController"
],
	/**
	 * @param {typeof fioriusuariosgrupossku.controller.BaseController} BaseController
	 */
	function (BaseController) {
		"use strict";

		return BaseController.extend("fioriusuariosgrupossku.controller.Main", {
			
			/**
			 * Maneja el clic en cualquier item de la lista de navegación
			 */
			onNavItemPress: function (oEvent) {
				const oItem = oEvent.getSource();
				// Obtenemos la "key" (ej: "Users") de nuestros datos del modelo
				const sKey = oItem.getBindingContext().getProperty("key"); 
				if (sKey) {
					// Navegamos a la ruta que tiene el mismo nombre que la key
					this.getRouter().navTo(sKey);
				}
			}
		});
	});