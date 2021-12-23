({
    // callbacjResolveMethods: {
    //     fetchSuccess: function (component, helper, data, state) { helper.handleFetchSucces(component, data, state); },
    //     fetchError: function (component, helper, errors) { helper.handlerFetchError(component, errors); },
    // },
    fetchData: function (component, event, helper) {
        let state = component.get("v.state");
        // let controllerAction = component.get("c.initData");

        // controllerAction.setParams({
        //     request: {
        //         relatedFieldApiName: state.relatedFieldApiName,
        //         numberOfRecords: state.numberOfRecords ? state.numberOfRecords + 1 : state.numberOfRecords,
        //         sobjectApiName: state.sobjectApiName,
        //         recordId: state.recordId,
        //         sortBy: state.sortedBy,
        //         fields: state.fields,
        //         sortDirection: state.sortedDirection,
        //         relationForeignkeyField: state.relationForeignkeyField
        //     }
        // });
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
        //const self = this;
        this.callApexController(component, "initData", params)
            .then( result => this.handleFetchSuccess(component, result, state))
            /*.catch( errors => this.handleFetchError(component, errors))*/;

        // controllerAction.setCallback(this, function (response) {
        //     let calloutState = response.getState();
        //     if (calloutState === "SUCCESS") {
                
        //     } else if (state === "ERROR") {
                
        //     }
        // });

        // $A.enqueueAction(controllerAction);
    },
    handleFetchSuccess: function (component, data, state) {
        // let data = response.getReturnValue();
        let records = data.records;

        let filteredRecords = records.filter(function (value, index, arr) {
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

        let isCaseObject = 'case' === data.sObjectLabel.toLocaleLowerCase();
        records.forEach((record) => {
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

                if (isCaseObject) {
                    record["Name"] = record.CaseNumber;
                }
            }
        });

        this.setState(component, "v.state", {
            parentRelationshipApiName: !state.parentRelationshipApiName
                ? data.parentRelationshipApiName
                : state.parentRelationshipApiName,
            tableTitle: !state.tableTitle ? data.sObjectLabelPlural : state.tableTitle,
            iconName: !state.iconName ? data.iconName : state.iconName
        });

        let hasRecords = records.length > 0;
        this.setState(component, "v.privateState", {
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
    handleFetchError: function (component, errors) {
        this.toast(5, "¡Error!", "pester", errors, "error", "error");
    
        this.setState(component, "v.privateState", { isLoading: false });
    },
    // flat the object to get access to all fields (Datatablerow doesn't accept estructured objects)
    flattenStructure: function (topObject, prefix, toBeFlattened) {
        for (const prop in toBeFlattened) {
            const curVal = toBeFlattened[prop];
            if (typeof curVal === "object") {
                this.flattenStructure(topObject, prefix + prop + "_", curVal);
            } else {
                topObject[prefix + prop] = curVal;
            }
        }
    },
    initColumnsWithActions: function (cmp) {
        let privateState = cmp.get("v.privateState");
        let state = cmp.get("v.state");

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

        this.setState(cmp, "v.privateState", {
            columnsWithActions: [...state.columns, { type: "action", typeAttributes: { rowActions: customActions } }]
        });
    },
    removeRecord: function (cmp, row) {
        let sobjectLabel = cmp.get("v.privateState.sobjectLabel");
        $A.createComponents(
            [
                ["c:DeleteRecordContent", { sobjectLabel: sobjectLabel }],
                ["c:DeleteRecordFooter", { record: row, sobjectLabel: sobjectLabel }]
            ],
            function (components, status, errorMessage) {
                if (status === "SUCCESS") {
                    let modalBody = components[0];
                    let modalFooter = components[1];
                    cmp.find("overlayLib").showCustomModal({
                        header: "Borrar " + sobjectLabel,
                        body: modalBody,
                        footer: modalFooter,
                        showCloseButton: true
                    });
                } else if (status === "ERROR") {
                    console.log(errorMessage);
                }
            }
        );
    },
    editRecord: function (component, row) {
        let createRecordEvent = $A.get("e.force:editRecord");
        createRecordEvent.setParams({
            recordId: row.Id
        });
        createRecordEvent.fire();
    },
    fireAction: function (cmp, actionName, row) {
        switch (actionName.toLowerCase()) {
            case "edit":
                this.editRecord(cmp, row);
                break;
            case "delete":
                this.removeRecord(cmp, row);
                break;
        }
    },
    //Tile Format
    initTileRows: function (cmp, event) {
        let records = cmp.get("v.privateState.records");
        let currentTileRows = [];
        this.createRow(cmp, records, currentTileRows);
    },
    createRow: function (cmp, records, currentTileRows) {
        let self = this;
        let record = records.shift();

        $A.createComponents(
            [
                [
                    "aura:html",
                    {
                        tag: "dt",
                        HTMLAttributes: { class: "slds-dl_horizontal__label" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: "Motivo:",
                        HTMLAttributes: { class: "slds-truncate", title: "Motivo" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "dd",
                        HTMLAttributes: { class: "slds-dl_horizontal__detail slds-tile__meta" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: record.Motivo__c,
                        HTMLAttributes: { class: "slds-truncate", title: "MotivoDesc" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "dt",
                        HTMLAttributes: { class: "slds-dl_horizontal__label" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: "Estado:",
                        HTMLAttributes: { class: "slds-truncate", title: "Estado" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "dd",
                        HTMLAttributes: { class: "slds-dl_horizontal__detail slds-tile__meta" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: record.Status,
                        HTMLAttributes: { class: "slds-truncate", title: "EstadoDesc" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "dt",
                        HTMLAttributes: { class: "slds-dl_horizontal__label" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: "Fecha:",
                        HTMLAttributes: { class: "slds-truncate", title: "Fecha" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "dd",
                        HTMLAttributes: { class: "slds-dl_horizontal__detail slds-tile__meta" }
                    }
                ],
                [
                    "aura:html",
                    {
                        tag: "p",
                        body: record.Status,
                        HTMLAttributes: { class: "slds-truncate", title: "FechaDesc" }
                    }
                ],
                [
                    "lightning:formattedDateTime",
                    {
                        value: record.CreatedDate,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: "false"
                    }
                ]
            ],
            function (components, status, errorMessage) {
                if (status === "SUCCESS") {
                    var dt = components[0];
                    var p = components[1];
                    var dd = components[2];
                    var ddp = components[3];

                    var dt1 = components[4];
                    var p1 = components[5];
                    var dd1 = components[6];
                    var ddp1 = components[7];

                    var dt2 = components[8];
                    var p2 = components[9];
                    var dd2 = components[10];
                    var ddp2 = components[11];
                    var formattedDateTime = components[12];

                    dt.set("v.body", p);
                    dd.set("v.body", ddp);
                    dt1.set("v.body", p1);
                    dd1.set("v.body", ddp1);
                    dt2.set("v.body", p2);
                    dd2.set("v.body", ddp2);
                    ddp2.set("v.body", formattedDateTime);

                    let rowInfo = [dt, dd, dt1, dd1, dt2, dd2];

                    $A.createComponents(
                        [
                            [
                                "aura:html",
                                {
                                    tag: "p",
                                    HTMLAttributes: { class: "slds-var-p-around_small" }
                                }
                            ],
                            [
                                "lightning:layout",
                                {
                                    horizontalAlign: "space"
                                }
                            ],
                            [
                                "lightning:layoutItem",
                                {
                                    padding: "around-small"
                                }
                            ],
                            [
                                "aura:html",
                                {
                                    tag: "a",
                                    body: record.CaseNumber,
                                    HTMLAttributes: {
                                        id: record.Id,
                                        href: "#",
                                        onclick: cmp.getReference("c.handleGoToRecord")
                                    }
                                }
                            ],
                            [
                                "aura:html",
                                {
                                    tag: "dl",
                                    HTMLAttributes: { class: "slds-dl_horizontal" }
                                }
                            ],
                            [
                                "lightning:layoutItem",
                                {
                                    padding: "around-small"
                                }
                            ],
                            [
                                "c:RecordActionsMenu",
                                {
                                    isDeletable: cmp.get("v.privateState.isDeletable"),
                                    isUpdatable: cmp.get("v.privateState.isUpdatable"),
                                    value: record
                                }
                            ]
                        ],

                        function (components, status, errorMessage) {
                            if (status === "SUCCESS") {
                                let p = components[0];
                                let lightningLayout = components[1];
                                let lightningLayoutItem = components[2];
                                let a = components[3];
                                let dl = components[4];
                                let lightningLayoutItem1 = components[5];
                                let buttonsMenu = components[6];

                                dl.set("v.body", rowInfo);
                                lightningLayoutItem.set("v.body", [a, dl]);
                                lightningLayout.set("v.body", [lightningLayoutItem, lightningLayoutItem1]);
                                lightningLayoutItem1.set("v.body", buttonsMenu);
                                p.set("v.body", lightningLayout);

                                currentTileRows.push(p);
                                if (records.length > 0) {
                                    self.createRow(cmp, records, currentTileRows);
                                } else {
                                    cmp.set("v.privateState.tileBody", currentTileRows);
                                }
                            } else if (status === "INCOMPLETE") {
                                console.log("No response from server or client is offline.");
                                // Show offline error
                            } else if (status === "ERROR") {
                                console.log("Error: " + errorMessage);
                                // Show error message
                            }
                        }
                    );
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                    // Show error message
                }
            }
        );
    },
    //Auxiliary
    toast: function (duration, title, mode, message, type, icon) {
        $A.get("e.force:showToast")
            .setParams({
                duration: duration,
                mode: mode, //dismissible, pester, sticky
                title: title,
                key: icon,
                type: type, //'error', 'warning', 'success', 'info' or'other'
                message: message
            })
            .fire();
    },
    callApexController: function (component, actionName, parameters) {
        return new Promise(
            $A.getCallback((resolve, reject) => this.apexCallback(component, actionName, parameters, resolve, reject))
        );
    },
    apexCallback: function (component, actionName, parameters, resolve, reject) {
        const action = component.get(`c.${actionName}`);
        action.setParams(parameters);
        let self = this;

        action.setCallback(self, (callbackResult) => self.apexResultCallback(callbackResult, resolve, reject));
        $A.enqueueAction(action);
    },
    apexResultCallback: function (callbackResult, resolve, reject) {
        if (callbackResult.getState() === "SUCCESS" && callbackResult.getReturnValue()) {
            resolve(callbackResult.getReturnValue());
        }
        if (callbackResult.getState() === "ERROR") {
            reject(callbackResult.getError());
        }
    },
    setState: function (component, attributeName, newState) {
        for (const [key, value] of Object.entries(newState)) {
            component.set(`${attributeName}.${key}`, value);
        }
    }
});
