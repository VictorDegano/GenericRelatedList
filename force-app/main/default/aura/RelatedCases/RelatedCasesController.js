({
    initialize: function (component, event, helper) {
        let columns = [
            {
                label: "Nombre",
                fieldName: "LinkName",
                type: "url",
                typeAttributes: {
                    label: { fieldName: "CaseNumber" },
                    target: "_top"
                }
            },
            {
                label: "Tipo",
                fieldName: "Type",
                type: "Text"
            },
            {
                label: "Estado",
                fieldName: "Status",
                type: "Text"
            },
            {
                label: "Fecha",
                fieldName: "CreatedDate",
                type: "date",
                typeAttributes: {
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            }
        ];

        let customActions = [
            //{ label: "Custom action", name: "custom_action" }
        ];

        helper.setState(component, "v.state", {
            currentRecordId: component.get("v.recordId"),
            customActions: customActions,
            columns: columns
        });
    },
    loadData: function (component, event, helper) {
        helper.setState(component, "v.state", {
            // relationForeignkeyField: Account.Id, //You should set it if you want to use another field
            relatedFieldApiName: "AccountId",
            recordId: component.get("v.caseRecord").AccountId,
            isLoaded: true
        });
    }
});
