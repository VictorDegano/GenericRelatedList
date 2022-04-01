({
    fetchData: function (component, event, helper) {
        let state = component.get("v.state");

        let params = {
            request: {
                relatedFieldApiName: state.relatedFieldApiName,
                numberOfRecords: state.numberOfRecords ? state.numberOfRecords + 1 : state.numberOfRecords,
                sobjectApiName: state.sobjectApiName,
                recordId: state.recordId,
                sortBy: state.sortedBy,
                fields: state.fields,
                sortDirection: state.sortedDirection,
                relationForeignkeyField: state.relationForeignkeyField
            }
        };

        LightningUtilities.callApex(component, "initData", params)
            .then((result) => this.handleFetchSuccess(component, result, state))
            .catch((errors) => this.handleFetchError(component, errors));
    },
    handleFetchSuccess: function (component, data, state) {
        let records = data.records;

        let filteredRecords = records.filter((value, index, arr) => {
            return state.currentRecordId !== value.Id;
        });

        if (
            state.numberOfRecords &&
            records.length > state.numberOfRecords &&
            filteredRecords.length >= records.length
        ) {
            filteredRecords.pop();
        }
        records = filteredRecords;

        let numberOfRecordsTitle =
            data.recordsSize > state.numberOfRecords
                ? `${state.numberOfRecords}+`
                : Math.min(state.numberOfRecords, records.length);

        records.forEach((record) => this.processRetrievedRecord(record, data.sObjectLabel));

        LightningUtilities.setState(component, "v.state", {
            parentRelationshipApiName: !state.parentRelationshipApiName
                ? data.parentRelationshipApiName
                : state.parentRelationshipApiName,
            tableTitle: !state.tableTitle ? data.sObjectLabelPlural : state.tableTitle,
            iconName: !state.iconName ? data.iconName : state.iconName
        });

        let hasRecords = records.length > 0;
        LightningUtilities.setState(component, "v.privateState", {
            records: records,
            numberOfRecordsForTitle: numberOfRecordsTitle,
            isCreatable: data.isCreatable,
            isDeletable: data.isDeletable,
            isUpdatable: data.isUpdatable,
            isLoading: false,
            sobjectLabel: data.sObjectLabel,
            hasRecords: hasRecords
        });

        this.initColumnsWithActions(component);

        let componentEvent = component.getEvent("fetchDataEvent");
        componentEvent.setParams({
            eventData: {
                tableTitle: data.sObjectLabelPlural,
                numberOfRecordsForTitle: numberOfRecordsTitle,
                iconName: data.iconName,
                isCreatable: data.isCreatable,
                hasRecords: hasRecords
            }
        });
        componentEvent.fire();
    },
    processRetrievedRecord: function (record, sObjectLabel) {
        record.LinkName = "/" + record.Id;
        for (const col in record) {
            const curCol = record[col];

            //we need to flat the object cause the datatable doesn't support complex objects
            if (typeof curCol === "object") {
                const newVal = curCol.Id ? "/" + curCol.Id : null;

                this.flattenStructure(record, col + "_", curCol);

                if (newVal !== null) {
                    record[col + "_LinkName"] = newVal;
                }
            }

            if ("case" === sObjectLabel.toLocaleLowerCase()) {
                record["Name"] = record.CaseNumber;
            }
        }
    },
    handleFetchError: function (component, errors) {
        LightningUtilities.showToast("¡Error!", "pester", errors, "error", "error");

        LightningUtilities.setState(component, "v.privateState", { isLoading: false });
    },
    // flat the object to get access to all fields (Datatablerow doesn't accept estructured objects)
    flattenStructure: function (topObject, prefix, toBeFlattened) {
        for (const prop in toBeFlattened) {
            const curVal = toBeFlattened[prop];
            typeof curVal === "object"
                ? this.flattenStructure(topObject, prefix + prop + "_", curVal)
                : (topObject[prefix + prop] = curVal);
        }
    },
    initColumnsWithActions: function (component) {
        let privateState = component.get("v.privateState");
        let state = component.get("v.state");

        let customActions = state.customActions;
        if (!customActions.length) {
            customActions = [];

            if (privateState.isUpdatable) {
                customActions.push({ label: "Edit", name: "Edit" });
            }

            if (privateState.isDeletable) {
                customActions.push({ label: "Delete", name: "Delete" });
            }
        }

        LightningUtilities.setState(component, "v.privateState", {
            columnsWithActions: [...state.columns, { type: "action", typeAttributes: { rowActions: customActions } }]
        });
    },
    removeRecord: function (component, row) {
        const sobjectLabel = component.get("v.privateState.sobjectLabel");
        const componentsToRender = [
            ["c:DeleteRecordContent", { sobjectLabel: sobjectLabel }],
            ["c:DeleteRecordFooter", { record: row, sobjectLabel: sobjectLabel }]
        ];

        LightningUtilities.castComponent(
            component,
            componentsToRender,
            this.removeRecordComponentCastSuccess,
            this.removeRecordComponentCastError
        );
    },
    removeRecordComponentCastSuccess: function (component, components, status, errorMessage) {
        let modalBody = components[0];
        let modalFooter = components[1];
        component.find("overlayLib").showCustomModal({
            header: `Delete ${component.get("v.privateState.sobjectLabel")}`,
            body: modalBody,
            footer: modalFooter,
            showCloseButton: true
        });
    },
    removeRecordComponentCastError: function (component, components, status, errorMessage) {
        console.log(errorMessage);
    },
    editRecord: function (component, row) {
        let createRecordEvent = $A.get("e.force:editRecord");
        createRecordEvent.setParams({
            recordId: row.Id
        });
        createRecordEvent.fire();
    },
    fireAction: function (component, actionName, row) {
        switch (actionName.toLowerCase()) {
            case "edit":
                this.editRecord(component, row);
                break;
            case "delete":
                this.removeRecord(component, row);
                break;
        }
    }
});
