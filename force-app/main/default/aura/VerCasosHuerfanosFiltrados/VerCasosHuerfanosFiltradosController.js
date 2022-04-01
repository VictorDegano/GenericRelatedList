({
    initialize: function (component, event, helper) {
        var workspaceAPI = component.find("workspaceAPI");

        workspaceAPI
            .getFocusedTabInfo()
            .then(function (response) {
                console.log(response.icon);
                console.log(response.iconAlt);
                var focusedTabId = response.tabId;
                workspaceAPI.setTabLabel({
                    tabId: focusedTabId,
                    label: "Otros Casos"
                });
                workspaceAPI.setTabIcon({
                    tabId: focusedTabId,
                    icon: "standard:case",
                    iconAlt: "case"
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        var state = component.get("v.pageReference").state;

        component.set("v.sobjectApiName", state.c__sobjectApiName);
        component.set("v.recordId", state.c__recordId);
        component.set("v.parentRelationshipApiName", state.c__parentRelationshipApiName);
        component.set("v.valueToFilter", state.c__relationForeignkeyField);
        component.set("v.relatedFieldApiName", state.c__relatedFieldApiName);

        component.set("v.columns", [
            {
                label: "Caso",
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
                label: "Motivo",
                fieldName: "Motivo__c",
                type: "Text"
            },
            {
                label: "Estado",
                fieldName: "Status",
                type: "Text"
            },
            {
                label: "Prioridad",
                fieldName: "Priority",
                type: "Text"
            },
            {
                label: "Asunto",
                fieldName: "Subject",
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
            },
            {
                label: "Propietario",
                fieldName: "Owner_Name",
                type: "Text"
            }
        ]);

        component.set("v.customActions", [
            // { label: "Custom action", name: "custom_action" }
        ]);

        var breadcrumbCollection = [
            {
                label: "Cuentas",
                name: "Account",
                navigation: {
                    type: "standard__objectPage",
                    attributes: {
                        objectApiName: "Account",
                        actionName: "home"
                    }
                }
            },
            {
                label: "Personal Pay",
                name: "Personal Pay",
                navigation: {
                    type: "standard__recordPage",
                    attributes: {
                        recordId: state.c__recordId,
                        actionName: "view"
                    }
                }
            }
        ];

        component.set("v.breadcrumbCollection", breadcrumbCollection);
        component.set("v.isLoading", false);
    },

    navigateTo: function (component, event, helper) {
        var name = event.getSource().get("v.name");
        var breadcrums = component.get("v.breadcrumbCollection");

        var navigationApi = component.find("navigationService");
        var pageReference = breadcrums.filter(function (current, index, array) {
            return current.name.toLowerCase() === this;
        }, name.toLowerCase());

        event.preventDefault();

        if (pageReference && pageReference.length) {
            navigationApi.navigate(pageReference[0].navigation);
        } else {
            console.log("No se pudo redirigir al link solicitado.");
        }
    },

    handleRecordLoaded: function (component, event, helper) {
        var record = component.get("v.record");

        if (record.SuppliedEmail) {
            component.set("v.relatedFieldApiName", "SuppliedEmail");
            component.set("v.valueToFilter", record.SuppliedEmail);
        } else {
            component.set("v.relatedFieldApiName", "DNI__c");
            component.set("v.valueToFilter", record.DNI__c);
        }
    },

    handleRecordLoaded: function (component, event, helper) {
        console.log(component.get("v.recordLoadError"));
    }
});
