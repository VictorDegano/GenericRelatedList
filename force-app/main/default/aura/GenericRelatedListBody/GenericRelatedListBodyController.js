({
    initialize: function (component, event, helper) {
        helper.fetchData(component, event, helper);
    },
    handleColumnsChange: function (component, event, helper) {
        helper.initColumnsWithActions(component, event, helper);
    },
    handleRowAction: function (component, event, helper) {
        let action = event.getParam("action");
        let row = event.getParam("row");
        let onRowActionHandler = component.get("v.privateState.onRowActionHandler");

        onRowActionHandler ? $A.enqueueAction(onRowActionHandler) : helper.fireAction(component, action.name, row);
    },
    handleToastEvent: function (component, event, helper) {
        let eventType = event.getParam("type");
        let eventMessage = event.getParam("message");
        if (
            eventType.toLowerCase() === "SUCCESS".toLowerCase() &&
            eventMessage.toLowerCase().includes(component.get("v.privateState.sobjectLabel").toLowerCase())
        ) {
            helper.fetchData(component, event, helper);
            event.stopPropagation();
        }
    }
});
