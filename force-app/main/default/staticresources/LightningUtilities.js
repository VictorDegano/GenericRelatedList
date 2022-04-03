window.LightningUtilities = (
    function() {
        return {
            showToast: function(title, mode, message, type, icon) {
                $A.get("e.force:showToast")
                    .setParams({
                        mode: mode, //si queda estatico o cierra solo
                        title: title,
                        key: icon,
                        type: type, //El tipo de error
                        message: message
                    })
                    .fire();
            },
            callApex: function(component, actionName, params, background) {
                return new Promise(
                    $A.getCallback((resolve, reject) =>
                        this.callApexCallback(component, actionName, params, resolve, reject, background)
                    )
                );
            },
            callApexCallback: function(component, actionName, params, resolve, reject, background) {
                const runBackground = background ? background : false;
                let self = this;

                let action = component.get(`c.${actionName}`);
                action.setParams(params);

                action.setCallback(self, callbackResult =>
                    self.callApexResultCallback(callbackResult, resolve, reject)
                );

                if (runBackground) {
                    action.setBackground();
                }
                $A.enqueueAction(action);
            },
            callApexResultCallback: function(callbackResult, resolve, reject) {
                if (callbackResult.getState() === "SUCCESS") {
                    resolve(callbackResult.getReturnValue());
                }
                if (callbackResult.getState() === "ERROR") {
                    console.log("ERROR", callbackResult.getError());
                    reject(callbackResult.getError());
                }
            },
            setState: function(component, attributeName, newState) {
                for (const [key, value] of Object.entries(newState)) {
                    component.set(`${attributeName}.${key}`, value);
                }
            },
            castComponent: function(component, componentsToRender, functionSuccess, functionError){
                $A.createComponents(
                    componentsToRender,
                    (components, status, errorMessage) => {
                        if (status === "SUCCESS") {
                            functionSuccess(component, components, status, errorMessage);
                        } else if (status === "ERROR") {
                            functionError(component, components, status, errorMessage);
                        }
                    }
                );
            },
            fireEvent: function(component, type, name, parameters){
                const eventGetter = {
                    "component": (name, component) => { return component.getEvent(name); },
                    "application": name => { return $A.get(name); }
                }
                let event = eventGetter[type.toLowerCase()](name, component);

                event.setParams(parameters);
                event.fire();
            }
        };
    }
)();