sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
],
	function (BaseController, JSONModel, Filter, FilterOperator, Fragment, MessageBox) {
		"use strict";

		return BaseController.extend("ui5.user.management.controller.RoleGroups", {
			
			onInit: function () {
				// Modelo para estado de botones
				this.getView().setModel(new JSONModel({
					editEnabled: false,
					deleteEnabled: false
				}), "viewState");

				// Modelo para el diálogo de "Crear"
				this.getView().setModel(new JSONModel({
					ROLEID: "",
					IDSOCIEDAD: null,
					IDCEDI: null,
					IDGRUPOET: "",
					ID: "",
					PRIVILEGEID: "",
					ACTIVED: true
				}), "newGroup");
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
							new Filter("ROLEID", FilterOperator.Contains, sQuery),
							new Filter("IDGRUPOET", FilterOperator.Contains, sQuery),
							new Filter("ID", FilterOperator.Contains, sQuery),
							new Filter("PRIVILEGEID", FilterOperator.Contains, sQuery)
						],
						and: false
					});
					aFilters.push(oFilter);
				}
				var oTable = this.byId("groupsTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);
			},

			onSelectionChange: function (oEvent) {
				var oTable = oEvent.getSource();
				var bIsItemSelected = oTable.getSelectedItem() !== null;
				this.getView().getModel("viewState").setProperty("/editEnabled", bIsItemSelected);
				this.getView().getModel("viewState").setProperty("/deleteEnabled", bIsItemSelected);
			},

			// --- CREAR ---
			onAdd: function () {
				this.getView().getModel("newGroup").setData({
					ROLEID: "", IDSOCIEDAD: null, IDCEDI: null, IDGRUPOET: "", ID: "", PRIVILEGEID: "", ACTIVED: true
				});
				this.loadAndOpenDialog("addGroupDialog", "ui5.user.management.fragment.AddGroupDialog");
			},
			onSaveAdd: function () {
				var oNewGroup = this.getView().getModel("newGroup").getData();
				var oModel = this.getView().getModel();
				var aGroups = oModel.getProperty("/roleGroups");
				
				aGroups.unshift(oNewGroup);
				oModel.refresh(true);
				this.byId("addGroupDialog").close();
			},
			onCloseAddDialog: function () {
				this.byId("addGroupDialog").close();
			},

			// --- EDITAR ---
			onEdit: function () {
				var oSelectedItem = this.byId("groupsTable").getSelectedItem();
				if (!oSelectedItem) return;

				var sPath = oSelectedItem.getBindingContext().getPath();
				
				this.loadAndOpenDialog("editGroupDialog", "ui5.user.management.fragment.EditGroupDialog", function(oDialog) {
					oDialog.bindElement(sPath);
				});
			},
			onSaveEdit: function () {
				this.byId("editGroupDialog").close();
			},
			onCloseEditDialog: function () {
				this.byId("editGroupDialog").close();
			},

			// --- BORRAR ---
			onDelete: function () {
				var oSelectedItem = this.byId("groupsTable").getSelectedItem();
				if (!oSelectedItem) return;
				
				var oGroup = oSelectedItem.getBindingContext().getObject();
				var sPath = oSelectedItem.getBindingContext().getPath();
				
				MessageBox.confirm("¿Está seguro de eliminar este grupo?", {
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
				var aGroups = oModel.getProperty("/roleGroups");

				aGroups.splice(iIndex, 1);
				oModel.refresh(true);

				this.byId("groupsTable").removeSelections(true);
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