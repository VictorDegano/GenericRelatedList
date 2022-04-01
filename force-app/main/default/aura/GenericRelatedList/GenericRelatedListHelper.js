({
    createRecord: function (currentState, event) {
        let createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            entityApiName: currentState.sobjectApiName,
            defaultFieldValues: {
                [currentState.relatedFieldApiName]: currentState.recordId
            },
            navigationLocation: "RELATED_LIST"
        });
        event.preventDefault();
        createRecordEvent.fire();
    },
    goToComponent: function (component, event, currentState) {
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
    },
    goToRelatedList: function (currentState, event) {
        let relatedListEvent = $A.get("e.force:navigateToRelatedList");
        relatedListEvent.setParams({
            relatedListId: currentState.parentRelationshipApiName,
            parentRecordId: currentState.recordId
        });
        event.preventDefault();
        relatedListEvent.fire();
    }
});
