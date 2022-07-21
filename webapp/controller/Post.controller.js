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
                this.getOwnerComponent().getRouter().getRoute("post").attachMatched(this.filter, this);
            },

            filter:function(oEvent){
                var userId = oEvent.getParameter('arguments').postId;
                console.log(userId);
                
                var AktiviteYarat = new JSONModel({

                    Aktiviteid: "",
                    Aktiviteadi: "",
                    Saat: "",
                    Tarih: "",
                    Aciklama: "",
                    Kullaniciid: userId
                });

                this.getView().setModel(AktiviteYarat, "CreateAktivite");

                var that = this;
                this.oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "aktiviteModel");

                this.oDataModel.read("/UserSet('" + userId + "')", {
                    urlParameters: { "$expand": "UserToAktiviteNav" },
                    method: "GET",
                    success: function(oData, oResponse) {
                        that.getView().getModel("aktiviteModel").setProperty("/AktiviteListesi", oData.UserToAktiviteNav.results);
                       console.log(oData, oResponse);
                    },
                    error: function(oError) {   
    
                    }
                });
            },


            onPressDeleteAktivite:function(oEvent){

                var id = oEvent.getSource().getBindingContext('aktiviteModel').getObject("Aktiviteid");
                var oDataModel = this.getView().getModel();

                oDataModel.remove("/AktiviteSet('" + id + "')", {
                    method: "DELETE",
                    
                    success: function (oData, oResponse) {
                        //MessageBox.success("Silme İşlemi Başarılı");  
                        location.reload();                      
                    },
                    error: function (oError) {
                        MessageBox.error("Silme İşlemi Başarısız");
                    }
                });
               
            },


            onAktiviteFragmentOpen: function (oEvent) {
                    var oView = this.getView();
                    if (!this._pDialog) {    
                        this._pDialog = this.loadFragment({    
                            name: 'com.galemdar.aktiviteproje.view.Dialog.Aktivite'
                        }).then(function (oDialog) {    
                            oView.addDependent(oDialog);    
                            return oDialog;    
                        });
                        }
                        this._pDialog.then(function (oDialog) { 
                            oDialog.open();
                        }.bind(this)
    
                    );
    
            }, 

                
            onAktiviteUpdatefragmantOpen: function(oEvent){

                var id = oEvent.getSource().getBindingContext('aktiviteModel').getObject("Aktiviteid");
                console.log(id);
                var oView = this.getView();
                var oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "aktiviteModel");

                oDataModel.read("/AktiviteSet('" + id + "')", {
                    method: "GET",
                    success: function(oData, oResponse) {

                        var getModel = new JSONModel({
                            Kullaniciid: oData.Kullaniciid,
                            Aktiviteid: oData.Aktiviteid,
                            Aktiviteadi: oData.Aktiviteadi,
                            Saat: oData.Saat,
                            Tarih: oData.Tarih,
                            Aciklama: oData.Aciklama
                        });

                        oModel.setData(oData);
                        oView.setModel(oModel, "aktiviteModel");
                        console.log(oModel);
                        console.log(getModel);
                    },
                    error: function(oError) {   
    
                    }
                });

                    if (!this._oDialog) {    
                        this._oDialog = this.loadFragment({    
                            name: 'com.galemdar.aktiviteproje.view.Dialog.AktiviteGncl'
                        }).then(function (oDialog) {    
                            oView.addDependent(oDialog);    
                            return oDialog;    
                        });
                        }
                        this._oDialog.then(function (oDialog) { 
                            oDialog.setModel(oModel, "aktiviteModel");
                            oDialog.open();
                        }.bind(this)
    
                    );
            },


            onAktiviteFragmentSave:function(){

                var oEntry = {};

                var aktiviteModel = this.getView().getModel("CreateAktivite");

                oEntry.Aktiviteid  = aktiviteModel.getData().Aktiviteid;
                oEntry.Aktiviteadi = aktiviteModel.getData().Aktiviteadi;
                oEntry.Saat        = aktiviteModel.getData().Saat;
                oEntry.Tarih       = new Date(aktiviteModel.getData().Tarih);
                oEntry.Aciklama    = aktiviteModel.getData().Aciklama;
                oEntry.Kullaniciid = aktiviteModel.getData().Kullaniciid;
            
                var oDataModel = this.getView().getModel();
                
                oDataModel.create("/AktiviteSet",oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Kayıt İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Kayıt İşlemi Başarısız");
                    }
                });
            },

            onAktiviteFragmentClose:function(){
                this.byId("AktiviteFragment").close();
                location.reload();
            },

            onAktiviteUpdateFragmentClose:function(){
                this.byId("AktiviteUpdateFragment").close();
                location.reload();
            },

            onAktiviteUpdateFragmentSave: function(oEvent) {
			    var oEntry = {};
                
                var aktiviteModel = this.getView().getModel("aktiviteModel");

                oEntry.Aktiviteid  = aktiviteModel.getData().Aktiviteid;
                oEntry.Aktiviteadi = aktiviteModel.getData().Aktiviteadi;
                oEntry.Saat        = aktiviteModel.getData().Saat;
                oEntry.Tarih       = new Date(aktiviteModel.getData().Tarih);
                oEntry.Aciklama    = aktiviteModel.getData().Aciklama;
                oEntry.Kullaniciid = aktiviteModel.getData().Kullaniciid;
                
                console.log(oEntry.Aktiviteid);
                var oDataModel = this.getView().getModel();                
                oDataModel.update("/AktiviteSet('" + oEntry.Aktiviteid + "')", oEntry, {
                    success: function(oData, oResponse) {
                        MessageBox.success("Güncelleme İşlemi Başarılı");
                    },
                    error: function(oError) {
                        MessageBox.error("Güncelleme İşlemi Başarısız");
                    }
                });
    
            }, 

        });
    });
