({
    initTileRows: function (component, event, helper) {
        let records = component.get("v.records");
        let currentTileRows = [];
        helper.createRow(component, records, currentTileRows);
    },
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
                objectApiName: component.get("v.sobjectApiName"),
                actionName: "view",
                recordId: event.target.id
            }
        };
        event.preventDefault();
        navLink.navigate(pageRef);
    }
})
