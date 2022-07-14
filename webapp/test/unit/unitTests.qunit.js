/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comgalemdar/aktivite_proje/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
