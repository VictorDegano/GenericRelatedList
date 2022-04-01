({
    initialize: function (component, event, helper) {
        const column = component.get("v.column");
        const record = component.get("v.record");

        LightningUtilities.setState(component, "v", {
            fieldValue:
                "LinkName" === column.fieldName ? record[column.fieldName].replace("/", "") : record[column.fieldName],
            labelValue: record[column.label]
        });
    }
});
