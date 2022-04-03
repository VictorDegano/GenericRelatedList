({
    initialize: function (component, event, helper) {
        let columns = [
            {
                label: "Name",
                fieldName: "LinkName",
                type: "url",
                typeAttributes: {
                    label: { fieldName: "CaseNumber" },
                    target: "_top"
                }
            },
            {
                label: "Type",
                fieldName: "Type",
                type: "Text"
            },
            {
                label: "Status",
                fieldName: "Status",
                type: "Text"
            },
            {
                label: "Created Date",
                fieldName: "CreatedDate",
                type: "date",
                typeAttributes: {
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            },
            {
                label: "Account",
                fieldName: "Account_LinkName",
                type: "url",
                typeAttributes: {
                    label: { fieldName: "Account_Id" },
                    target: "_top"
                }
            },
            {
                label: "Account Name",
                fieldName: "Account_Name",
                type: "Text"
            }
        ];

        let customActions = [
            //{ label: "Custom action", name: "custom_action" }
        ];

        LightningUtilities.setState(component, "v.state", {
            currentRecordId: component.get("v.recordId"),
            customActions: customActions,
            columns: columns,
            isLoaded: true
        });
    },
    loadData: function (component, event, helper) {
        LightningUtilities.setState(component, "v.state", {
            // relationForeignkeyField: Account.Id, //You should set it if you want to use another field
            relatedFieldApiName: "AccountId",
            recordId: component.get("v.caseRecord").AccountId,
            recordLoaded: true
        });
    }
});
