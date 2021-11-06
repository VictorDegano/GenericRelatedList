({
    initialize: function (cmp, event, helper) {
        helper.fetchData(cmp, event, helper);
    },

    handleColumnsChange: function (cmp, event, helper) {
        helper.initColumnsWithActions(cmp, event, helper);
    },

    handleTileAction: function (cmp, event, helper) {
        let action = event.getParam("value");
        let record = event.getSource().get("v.value");

        helper.fireAction(cmp, action, record);
    },

    handleRowAction: function (cmp, event, helper) {
        let action = event.getParam("action");
        let row = event.getParam("row");
        let onRowActionHandler = cmp.get("v.privateState.onRowActionHandler");

        if (onRowActionHandler) {
            $A.enqueueAction(onRowActionHandler);
        } else {
            helper.fireAction(cmp, action.name, row);
        }
    },

    handleGotoRelatedList: function (cmp, event, helper) {
        let state = cmp.get("v.state");

        if (state.relationForeignkeyField) {
            // TODO should be handled by controller and fired by helper
            let navLink = cmp.find("navigationService");
            let pageRef = {
                type: "standard__component",
                attributes: {
                    componentName: "c__VerCasosHuerfanosFiltrados"
                },
                state: {
                    c__recordId: state.recordId,
                    c__sobjectApiName: state.sobjectApiName,
                    c__parentRelationshipApiName: state.parentRelationshipApiName
                }
            };

            event.preventDefault();
            navLink.navigate(pageRef);
        } else {
            let relatedListEvent = $A.get("e.force:navigateToRelatedList");
            relatedListEvent.setParams({
                relatedListId: state.parentRelationshipApiName,
                parentRecordId: state.recordId
            });
            relatedListEvent.fire();
        }
    },
    handleToastEvent: function (cmp, event, helper) {
        let eventType = event.getParam("type");
        let eventMessage = event.getParam("message");
        if (eventType == "SUCCESS" && eventMessage.includes(cmp.get("v.privateState.sobjectLabel"))) {
            helper.fetchData(cmp, event, helper);
            event.stopPropagation();
        }
    },

    handleGoToRecord: function (cmp, event, helper) {
        let navLink = cmp.find("navigationService");
        let pageRef = {
            type: "standard__recordPage",
            attributes: {
                objectApiName: cmp.get("v.state.sobjectApiName"),
                actionName: "view",
                recordId: event.target.id
            }
        };
        event.preventDefault();
        navLink.navigate(pageRef);
    }
});
