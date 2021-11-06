({
    setState: function (component, attributeName, newState) {
        for (const [key, value] of Object.entries(newState)) {
            component.set(`${attributeName}.${key}`, value);
        }
    }
});
