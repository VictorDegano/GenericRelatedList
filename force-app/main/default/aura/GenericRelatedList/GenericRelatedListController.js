({
    initialize: function (component, event, helper) {
        let parentState = component.get("v.parentState");

        helper.setState(component, "v.childState", {
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

        helper.setState(component, "v.ownState", {
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

        helper.setState(component, "v.ownState", newOwnState);
    },
    handleGotoRelatedList: function (component, event, helper) {
        let currentState = component.get("v.childState");

        if (currentState.relationForeignkeyField) {
            let navigationLink = component.find("navigationService");
            let pageReference = {
                type: "standard_component",
                attributes: {
                    componentName: "c__ShowRelatedRecords"
                },
                state: {
                    c__recordId: currentState.recordId,
                    c__sobjectApiName: currentState.sobjectApiName,
                    c__parentRelationshipApiName: currentState.parentRelationshipApiName,
                    c__relationForeignkeyField: currentState.relationForeignkeyField,
                    c__relatedFieldApiName: currentState.relatedFieldApiName
                }
            };

            event.preventDefault();
            navigationLink.navigate(pageReference);
        } else {
            let relatedListEvent = $A.get("e.force:navigateToRelatedList");
            relatedListEvent.setParams({
                relatedListId: currentState.parentRelationshipApiName,
                parentRecordId: currentState.recordId
            });
            relatedListEvent.fire();
        }
    },
    // Should be fixed when create record action will be enable
    handleCreateRecord: function (component, event, helper) {
        let currentState = component.get("v.childState");

        let createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            entityApiName: currentState.sobjectApiName,
            defaultFieldValues: {
                [currentState.relatedFieldApiName]: currentState.recordId
            },
            navigationLocation: "RELATED_LIST"
        });
        createRecordEvent.fire();
    }
});
