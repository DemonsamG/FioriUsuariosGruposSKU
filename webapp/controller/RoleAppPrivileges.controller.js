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

		return BaseController.extend("fioriusuariosgrupossku.controller.RoleAppPrivileges", {
			
			onInit: function () {
				this.getView().setModel(new JSONModel({
					editEnabled: false,
					deleteEnabled: false
				}), "viewState");

				this.getView().setModel(new JSONModel({
					ROLEID: "",
					APPID: "",
					PRIVILEGEID: "",
					PROCESSID: "",
					VIEWID: "",
					ACTIVED: true
				}), "newPrivilege");
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
							new Filter("APPID", FilterOperator.Contains, sQuery),
							new Filter("PRIVILEGEID", FilterOperator.Contains, sQuery),
							new Filter("PROCESSID", FilterOperator.Contains, sQuery),
							new Filter("VIEWID", FilterOperator.Contains, sQuery)
						],
						and: false
					});
					aFilters.push(oFilter);
				}
				var oTable = this.byId("privilegesTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);
			},

			onSelectionChange: function (oEvent) {
				var oTable = oEvent.getSource();
				var bIsItemSelected = oTable.getSelectedItem() !== null;
				this.getView().getModel("viewState").setProperty("/editEnabled", bIsItemSelected);
				this.getView().getModel("viewState").setProperty("/deleteEnabled", bIsItemSelected);
			},

			onAdd: function () {
				this.getView().getModel("newPrivilege").setData({
					ROLEID: "", APPID: "", PRIVILEGEID: "", PROCESSID: "", VIEWID: "", ACTIVED: true
				});
				this.loadAndOpenDialog("addPrivilegeDialog", "fioriusuariosgrupossku.fragment.AddPrivilegeDialog");
			},
			onSaveAdd: function () {
				var oNewPriv = this.getView().getModel("newPrivilege").getData();
				var oModel = this.getView().getModel();
				var aPrivs = oModel.getProperty("/roleAppPrivileges");
				
				aPrivs.unshift(oNewPriv);
				oModel.refresh(true);
				this.byId("addPrivilegeDialog").close();
			},
			onCloseAddDialog: function () {
				this.byId("addPrivilegeDialog").close();
			},

			onEdit: function () {
				var oSelectedItem = this.byId("privilegesTable").getSelectedItem();
				if (!oSelectedItem) return;

				var sPath = oSelectedItem.getBindingContext().getPath();
				
				this.loadAndOpenDialog("editPrivilegeDialog", "fioriusuariosgrupossku.fragment.EditPrivilegeDialog", function(oDialog) {
					oDialog.bindElement(sPath);
				});
			},
			onSaveEdit: function () {
				this.byId("editPrivilegeDialog").close();
			},
			onCloseEditDialog: function () {
				this.byId("editPrivilegeDialog").close();
			},

			onDelete: function () {
				var oSelectedItem = this.byId("privilegesTable").getSelectedItem();
				if (!oSelectedItem) return;
				
				var oPriv = oSelectedItem.getBindingContext().getObject();
				var sPath = oSelectedItem.getBindingContext().getPath();
				
				MessageBox.confirm("¿Está seguro de eliminar este privilegio?", {
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
				var aPrivs = oModel.getProperty("/roleAppPrivileges");

				aPrivs.splice(iIndex, 1);
				oModel.refresh(true);

				this.byId("privilegesTable").removeSelections(true);
				this.getView().getModel("viewState").setProperty("/editEnabled", false);
				this.getView().getModel("viewState").setProperty("/deleteEnabled", false);
			},

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