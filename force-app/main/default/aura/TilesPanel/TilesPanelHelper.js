({
//Tile Format
createRow: function (component, records, currentTileRows) {
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
                                    onclick: component.getReference("c.handleGoToRecord")
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
                                isDeletable: component.get("v.privateState.isDeletable"),
                                isUpdatable: component.get("v.privateState.isUpdatable"),
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
                                self.createRow(component, records, currentTileRows);
                            } else {
                                component.set("v.privateState.tileBody", currentTileRows);
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
}
})
