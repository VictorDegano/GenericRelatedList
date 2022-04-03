({
    handleTileAction: function (component, event, helper) {
        let action = event.getParam("value");
        let record = event.getSource().get("v.value");

        LightningUtilities.fireEvent(component, "component", "tileAction", { action: { name: action }, row: record });
    }
});
