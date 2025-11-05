sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
],
	/**
	 * @param {typeof fioriusuariosgrupossku.controller.BaseController} BaseController
	 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
	 * @param {typeof sap.ui.model.Filter} Filter
	 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
	 * @param {typeof sap.ui.core.Fragment} Fragment
	 * @param {typeof sap.m.MessageBox} MessageBox
	 */
	function (BaseController, JSONModel, Filter, FilterOperator, Fragment, MessageBox) {
		"use strict";

		return BaseController.extend("fioriusuariosgrupossku.controller.Users", {
			
			onInit: function () {
				// Modelo para controlar estado de botones
				this.getView().setModel(new JSONModel({
					editEnabled: false,
					deleteEnabled: false
				}), "viewState");

				// Modelo para el diálogo de "Crear"
				this.getView().setModel(new JSONModel({
					USERID: "",
					USERNAME: "",
					ALIAS: "",
					EMAIL: ""
				}), "newUser");
			},
			
			onNavBack: function () {
				this.getRouter().navTo("Main", {}, true);
			},

			onSearch: function (oEvent) {
				var sQuery = oEvent.getParameter("newValue");
				var aFilters = [];
				if (sQuery && sQuery.length > 0) {
					var oFilter = new Filter({
						filters: [
							new Filter("USERID", FilterOperator.Contains, sQuery),
							new Filter("USERNAME", FilterOperator.Contains, sQuery),
							new Filter("ALIAS", FilterOperator.Contains, sQuery),
							new Filter("EMAIL", FilterOperator.Contains, sQuery)
						],
						and: false
					});
					aFilters.push(oFilter);
				}
				var oTable = this.byId("usersTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);
			},

			onSelectionChange: function (oEvent) {
				var oTable = oEvent.getSource();
				var bIsItemSelected = oTable.getSelectedItem() !== null;
				this.getView().getModel("viewState").setProperty("/editEnabled", bIsItemSelected);
				this.getView().getModel("viewState").setProperty("/deleteEnabled", bIsItemSelected);
			},

			// --- Lógica de CREAR Usuario ---
			onAddUser: function () {
				this.getView().getModel("newUser").setData({
					USERID: "", USERNAME: "", ALIAS: "", EMAIL: ""
				});
				this.loadAndOpenDialog("addUserDialog", "fioriusuariosgrupossku.fragment.AddUserDialog");
			},
			onSaveAdd: function () {
				var oNewUser = this.getView().getModel("newUser").getData();
				var oModel = this.getView().getModel();
				var aUsers = oModel.getProperty("/users");
				
				aUsers.unshift(oNewUser); // Añade al inicio de la lista
				
				oModel.refresh(true);
				this.byId("addUserDialog").close();
			},
			onCloseAddDialog: function () {
				this.byId("addUserDialog").close();
			},

			// --- Lógica de EDITAR Usuario ---
			onEditUser: function () {
				var oSelectedItem = this.byId("usersTable").getSelectedItem();
				if (!oSelectedItem) return;

				var sPath = oSelectedItem.getBindingContext().getPath();
				
				this.loadAndOpenDialog("editUserDialog", "fioriusuariosgrupossku.fragment.EditUserDialog", function(oDialog) {
					oDialog.bindElement(sPath);
				});
			},
			onSaveEdit: function () {
				this.byId("editUserDialog").close();
			},
			onCloseEditDialog: function () {
				this.byId("editUserDialog").close();
			},

			// --- Lógica de BORRAR Usuario ---
			onDeleteUser: function () {
				var oSelectedItem = this.byId("usersTable").getSelectedItem();
				if (!oSelectedItem) return;
				
				var oUser = oSelectedItem.getBindingContext().getObject();
				var sPath = oSelectedItem.getBindingContext().getPath();
				
				MessageBox.confirm("¿Está seguro de que desea eliminar al usuario '" + oUser.USERNAME + "'?", {
					title: "Confirmar Eliminación",
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.OK) {
							this._onDeleteConfirmed(sPath);
						}
					}.bind(this)
				});
			},
			_onDeleteConfirmed: function (sPath) {
				var iIndex = parseInt(sPath.split("/").pop());
				var oModel = this.getView().getModel();
				var aUsers = oModel.getProperty("/users");

				aUsers.splice(iIndex, 1);
				oModel.refresh(true);

				this.byId("usersTable").removeSelections(true);
				this.getView().getModel("viewState").setProperty("/editEnabled", false);
				this.getView().getModel("viewState").setProperty("/deleteEnabled", false);
			},

			/**
			 * Función genérica para cargar y abrir un diálogo (Fragmento)
			 */
			loadAndOpenDialog: function (sDialogId, sFragmentName, fnAfterOpen) {
				var oView = this.getView();
				var pDialog = this["_p" + sDialogId]; 

				if (!pDialog) {
					pDialog = Fragment.load({
						id: oView.getId(),
						name: sFragmentName,
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
					this["_p" + sDialogId] = pDialog;
				}
				pDialog.then(function(oDialog) {
					oDialog.open();
					if (fnAfterOpen) {
						fnAfterOpen(oDialog);
					}
				});
			}
		});
	});