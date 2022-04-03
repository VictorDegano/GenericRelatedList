({
    initialize: function (component, event, helper) {
        const column = component.get("v.column");
        const record = component.get("v.record");

        const fieldValue = column.fieldName.includes("_LinkName")
            ? window.location.href.substring(0, window.location.href.indexOf("com/")) + "com" + record[column.fieldName]
            : record[column.fieldName];
        const labelValue = column.fieldName.includes("_LinkName")
            ? column.fieldName.includes("Case")
                ? record[column.label].CaseNumber
                : record[column.label].Name
            : record[column.label.replace(" ", "")];

        LightningUtilities.setState(component, "v", {
            fieldValue: fieldValue,
            fieldLabel: labelValue,
            show: true
        });
    }
});
