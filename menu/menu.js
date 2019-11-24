'use strict';

module.exports = function (electronApp, menuState) {

    let errorName = "NO ERR";

    try {
        const {BrowserWindow} = require('electron');
        let focusedWindow = BrowserWindow.getFocusedWindow();
        focusedWindow.setTitle("Fraunhofer Modeler");
    }
    catch(error) {
        errorName = "HAS ERROR";
    }
    return [{
        label: "Open BPMN Reference",
        accelerator: 'CommandOrControl+[',
        enabled: function () {

            // only enabled for BPMN diagrams
            return menuState.bpmn;
        },
        action: function () {
            const shell = require('electron').shell;
            shell.openExternal('https://camunda.org/bpmn/reference/');
        }
    }, {
        label: 'Create BPMN Diagram',
        accelerator: 'CommandOrControl+]',
        enabled: function () {
            return true;
        },
        action: function () {
            electronApp.emit('menu:action', 'create-bpmn-diagram');
        }
    },
        {
            label: 'Restart Camunda Modeler',
            accelerator: "CommandOrControl+}",
            enabled: true,
            action: function () {
                console.log("This is pid " + process.pid);
                process.on("exit", function () {
                    require("child_process").spawn(process.argv.shift(), process.argv, {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: "inherit"
                    });
                });
                process.exit();
            }
        },

        {
            label: 'Apply some color',
            accelerator: 'CommandOrControl+-',
            enabled: function () {
                return menuState.elementsSelected;
            },
            action: function () {
                electronApp.emit('menu:action', 'setColor', {fill: '#fff', stroke: '#52b415'});
            }
        }, {
            label: 'Close Modeler',
            accelerator: 'CommandOrControl+!',
            enabled: function () {
                return true;
            },
            action: function () {
                process.exit(7);
            }
        }];
};
