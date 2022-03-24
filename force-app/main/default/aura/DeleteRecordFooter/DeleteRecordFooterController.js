({
    handleCancel: function (component, event, helper) {
        component.find("overlayLib").notifyClose();
    },

    handleDelete: function (component, event, helper) {
        let record = component.get("v.record");
        let sobjectLabel = component.get("v.sobjectLabel");

        LightningUtilities.callApex(component, "deleteRecord", { recordId: record.Id })
            .then((result) =>
                helper.launchToastAndClose(component, {
                    time: 6000,
                    title: "¡Success!",
                    mode: "dismissible",
                    message: `${sobjectLabel} "${record.Name}" was deleted.`,
                    type: "success",
                    icon: "success"
                })
            )
            .catch((error) =>
                helper.launchToastAndClose(component, {
                    time: 7000,
                    title: "Error!",
                    mode: "pester",
                    message: `${sobjectLabel} "${record.Name}" was not deleted.`,
                    type: "error",
                    icon: "error"
                })
            );
    }
});
