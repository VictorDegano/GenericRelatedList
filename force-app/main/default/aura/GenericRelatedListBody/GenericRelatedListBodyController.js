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
        if (eventType.toLowerCase() === "SUCCESS".toLowerCase() && eventMessage.toLowerCase().includes(component.get("v.privateState.sobjectLabel").toLowerCase())) {
            helper.fetchData(component, event, helper);
            event.stopPropagation();
        }
    },

    //TILE FORMAT ACTIONS
    handleTileAction: function (component, event, helper) {
        let action = event.getParam("value");
        let record = event.getSource().get("v.value");

        helper.fireAction(component, action, record);
    },
    handleGoToRecord: function (component, event, helper) {
        let navLink = component.find("navigationService");
        let pageRef = {
            type: "standard__recordPage",
            attributes: {
                objectApiName: component.get("v.state.sobjectApiName"),
                actionName: "view",
                recordId: event.target.id
            }
        };
        event.preventDefault();
        navLink.navigate(pageRef);
    }
});
