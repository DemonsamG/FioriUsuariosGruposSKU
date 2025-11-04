sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
],
	/**
	 * provide app-view type models (as static factory methods)
	 * * @param {typeof sap.ui.model.json.JSONModel} JSONModel
	 * @param {typeof sap.ui.Device} Device
	 * * @returns {object} the models
	 */
	function (JSONModel, Device) {
		"use strict";

		return {
			createDeviceModel: function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			createLocalModel: function () {
				var oModel = new JSONModel({
					"navigation": [
						{
							"title": "Usuarios",
							"key": "Users"
						},
						{
							"title": "Aplicaciones",
							"key": "Application"
						},
						{
							"title": "Privilegios de App",
							"key": "RoleAppPrivileges"
						},
						// --- AÑADIR ESTE NUEVO ITEM ---
						{
							"title": "Grupos de Roles",
							"key": "RoleGroups"
						}
					],
					"users": [
						{
							"USERID": "001",
							"USERNAME": "Johnathan Doe (Mock)",
							"ALIAS": "JohnnyD",
							"EMAIL": "john.doe@example.com"
						},
						{
							"USERID": "002",
							"USERNAME": "Ana García (Mock)",
							"ALIAS": "Anita",
							"EMAIL": "ana.garcia@example.com"
						},
						{
							"USERID": "003",
							"USERNAME": "Peter Jones (Mock)",
							"ALIAS": "Petey",
							"EMAIL": "peter.jones@example.com"
						}
					],
					"applications": [
						{
							"APPID": "APP01",
							"NAME": "Gestor de Ventas"
						},
						{
							"APPID": "APP02",
							"NAME": "Portal de RH"
						}
					],
					"roleAppPrivileges": [
						{
							"ROLEID": "ADMIN",
							"APPID": "APP01",
							"PRIVILEGEID": "READ",
							"PROCESSID": "P001",
							"VIEWID": "V001",
							"ACTIVED": true
						},
						{
							"ROLEID": "ADMIN",
							"APPID": "APP01",
							"PRIVILEGEID": "WRITE",
							"PROCESSID": "P001",
							"VIEWID": "V001",
							"ACTIVED": true
						},
						{
							"ROLEID": "USER",
							"APPID": "APP02",
							"PRIVILEGEID": "READ",
							"PROCESSID": "P005",
							"VIEWID": "V003",
							"ACTIVED": false
						}
					],
					// --- AÑADIR ESTE NUEVO BLOQUE DE DATOS ---
					"roleGroups": [
						{
							"ROLEID": "ADMIN",
							"IDSOCIEDAD": 1000,
							"IDCEDI": 200,
							"IDGRUPOET": "G1",
							"ID": "ID_01",
							"PRIVILEGEID": "P_READ",
							"ACTIVED": true,
							"DELETED": false
						},
						{
							"ROLEID": "USER",
							"IDSOCIEDAD": 1000,
							"IDCEDI": 200,
							"IDGRUPOET": "G2",
							"ID": "ID_02",
							"PRIVILEGEID": "P_WRITE",
							"ACTIVED": true,
							"DELETED": false
						},
						{
							"ROLEID": "ADMIN",
							"IDSOCIEDAD": 1000,
							"IDCEDI": 300,
							"IDGRUPOET": "G1",
							"ID": "ID_03",
							"PRIVILEGEID": "P_DELETE",
							"ACTIVED": false,
							"DELETED": false
						}
					]
				});
				return oModel;
			}
		};
	});