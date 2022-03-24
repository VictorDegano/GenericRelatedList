({
    launchToastAndClose: function (component, params) {
        LightningUtilities.showToast(params.title, params.mode, params.message, params.type, params.icon);
        component.find("overlayLib").notifyClose();
    }
});
