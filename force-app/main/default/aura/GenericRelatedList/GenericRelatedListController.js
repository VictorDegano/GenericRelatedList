({
    initialize: function (component, event, helper) {
        let parentState = component.get("v.parentState");

        LightningUtilities.setState(component, "v.childState", {
            recordId: parentState.recordId,
            currentRecordId: parentState.currentRecordId,
            relationForeignkeyField: parentState.relationForeignkeyField,
            sobjectApiName: parentState.sobjectApiName,
            relatedFieldApiName: parentState.relatedFieldApiName,
            sortedBy: parentState.sortedBy,
            numberOfRecords: parentState.numberOfRecords,
            sortedDirection: parentState.sortedDirection,
            customActions: parentState.customActions,
            columns: parentState.columns,
            fields: parentState.fields,
            parentRelationshipApiName: parentState.parentRelationshipApiName,
            tileFormat: parentState.tileFormat
        });

        LightningUtilities.setState(component, "v.ownState", {
            tableTitle: parentState.tableTitle,
            iconName: parentState.iconName,
            numberOfRecordsForTitle: 0,
            isCreatable: false,
            hasRecords: false,
            isLoading: true,
            showBody: true
        });
    },
    handleFetchDataEvent: function (component, event, helper) {
        let data = event.getParam("eventData");
        let currentOwnState = component.get("v.ownState");

        let newOwnState = {
            isCreatable: data.isCreatable,
            numberOfRecordsForTitle: data.numberOfRecordsForTitle,
            hasRecords: data.hasRecords,
            isLoading: false
        };

        if (!currentOwnState.iconName) {
            newOwnState["iconName"] = data.iconName;
        }
        if (!currentOwnState.tableTitle) {
            newOwnState["tableTitle"] = data.tableTitle;
        }

        LightningUtilities.setState(component, "v.ownState", newOwnState);
    },
    handleGotoRelatedList: function (component, event, helper) {
        let currentState = component.get("v.childState");

        currentState.relationForeignkeyField ? helper.goToComponent(component, event, currentState) : helper.goToRelatedList(currentState, event);
    },
    handleCreateRecord: function (component, event, helper) {
        helper.createRecord(component.get("v.childState"), event);
    }
});
