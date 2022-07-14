sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.galemdar.aktiviteproje.controller.MainView", {
           
            onInit: function () {
                var that = this;
                this.oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "mainModel");

                var kullaniciYarat = new JSONModel({

                    Kullaniciadi: "",
                    Kullaniciid: ""
                });

                this.getView().setModel(kullaniciYarat, "CreateUser");
                
                this.oDataModel.read("/UserSet", {
                    success: function(oData, oResponse) {
                        that.getView().getModel("mainModel").setProperty("/KullanıcıListesi", oData.results);
                       console.log(oData, oResponse);
                    },
                    error: function(oError) {
    
                    }
                });

            },

            onPressItem: function(oEvent) {

               var userId = oEvent.getSource().getProperty("description").split(' : ')[1];
               this.getOwnerComponent().getRouter().navTo('post', {postId: userId});
            },

            onUserFragmentOpen : function() {

                var oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = this.loadFragment({
                        name: "com.galemdar.aktiviteproje.view.Dialog.user"
                    }).then(function(oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pDialog.then(function(oDialog) {
                    oDialog.open();
                }.bind(this));
                
                
            },
            onUserFragmentSave:function(){
                var oEntry = {};

                

                var userModel = this.getView().getModel("CreateUser");
                
                oEntry.Kullaniciadi = userModel.getData().Kullaniciadi;
                oEntry.Kullaniciid = userModel.getData().Kullaniciid;

                this.oDataModel.create("/UserSet",oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Kayıt İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Kayıt İşlemi Başarısız");
                    }
                });

            },
            onUserFragmentClose : function() {
                this.byId("UserFragment").close();
                location.reload();
            },

            onPressDeleteUser:function(oEvent){
                var contexPath = oEvent.getParameter("listItem").getBindingContextPath();
                var id = this.getView().getModel("mainModel").getProperty(contexPath).Kullaniciid;
                

                this.oDataModel.remove("/UserSet('" + id + "')", {
                    method: "DELETE",
                    
                    success: function (oData, oResponse) {
                        MessageBox.success("Silme İşlemi Başarılı");                        
                    },
                    error: function (oError) {
                        MessageBox.error("Silme İşlemi Başarısız");
                    }
                });
                location.reload();
            }
        });
    });
