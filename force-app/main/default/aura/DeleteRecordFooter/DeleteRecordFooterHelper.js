({
    launchToastAndClose: function (component, params) {
        this.toast(params.time, params.title, params.mode, params.message, params.type, params.icon);
        component.find("overlayLib").notifyClose();
    },
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
