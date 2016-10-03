﻿/**
 * IoTApp.CellularActions module that is used in the device information secion of the solution 
 */
IoTApp.createModule("IoTApp.CellularActions", function () {
    "use strict";
    /*
     * Module variable initialization
     */
    var self = this;
    self.ActionRequestEndpoint = "/Device/CellularActionRequest";
    self.deviceId = null;
    self.initialCellActionSettings = null;
    self.actionTypes = {
        reconnectDevice: "ReconnectDevice",
        sendSms: "SendSms",
        updateStatus: "UpdateStatus",
        updateSubscriptionPackage: "UpdateSubscriptionPackage"
    }
    self.htmlElementIds = {
        reconnectDevice: "#reconnectDevice",
        sendSms: "#sendSms",
        sendSmsTextBox: "#sendSmsTextBox",
        loadingElement: "#loadingElement",
        cellularActionsResults: "#cellularActionsResults"
    }
    $.ajaxSetup({ cache: false });

    /*
     * API
     */

    /**
     * Post to the cellular actions request endpoint
     * @param {object} data A CellularActionRequestModel
     * @returns {Promise} A Promise that resolves/rejects on the api request
     */
    var postActionRequest = function (data) {
        return $.post(self.ActionRequestEndpoint, data);
    }

    /*
     * Utility functions
     */

    /**
     * Generate an CellularActionRequestModel from an action type string.
     * @param {string} type : string representing the action type
     * @param {any} value : string representing the value to pass with the action if any.
     * @returns {object} The CellularActionRequestModel
     */
    var generateActionUpdateRequestFromType = function (type, value) {
        var cellularCellularActionRequestModel = {
            deviceId: self.deviceId,
            cellularActions: []
        };
        switch (type) {
            case self.actionTypes.reconnectDevice:
                {
                    cellularCellularActionRequestModel.cellularActions.push({
                        type: self.actionTypes.reconnectDevice,
                        value: value ? value : null
                    });
                    break;
                }
            case self.actionTypes.sendSms:
                {
                    cellularCellularActionRequestModel.cellularActions.push({
                        type: self.actionTypes.sendSms,
                        value: value ? value : null
                    });
                    break;
                }
            default:
                {
                    break;
                }
        }
        return cellularCellularActionRequestModel;
    }

    var toggleLoadingElement = function (visible) {
        if (visible) {
            $(self.htmlElementIds.loadingElement).show();
        } else {
            $(self.htmlElementIds.loadingElement).hide();
        }
    }

    /**
     * Generic function for post action request success. Will reload the cellular information details.
     * @param {any} response the data returned by the api
     * @returns {void}
     */
    var onActionRequestSuccess = function (response) {
        IoTApp.DeviceDetails.onCellularDetailsDone(response);
        $(self.htmlElementIds.cellularActionsResults).show();
    }

    /**
     * Generic function for post action request error
     * @param {any} error The error returned from the api
     * @returns {void} 
     */
    var onActionRequestError = function (error) {
        toggleLoadingElement(false);
        $(self.htmlElementIds.cellularActionsResults).show();
        console.error(error);
    }

    /*
     * Event Handlers and event handler registration
     */

    /**
     * Callback for the reconnect device button
     *  @returns {Promise} The promise returned from posting to the api
     */
    var reconnectDeviceOnClick = function () {
        toggleLoadingElement(true);
        var requestModel = generateActionUpdateRequestFromType(self.actionTypes.reconnectDevice);
        return postActionRequest(requestModel)
            .then(onActionRequestSuccess, onActionRequestError);
    }

    /**
     * Callback for the send sms button
     *  @returns {Promise} The promise returned from posting to the api
     */
    var sendSmsOnClick = function () {
        toggleLoadingElement(true);
        var smsText = $(self.htmlElementIds.sendSmsTextBox).val();
        var requestModel = generateActionUpdateRequestFromType(self.actionTypes.sendSms, smsText);
        return postActionRequest(requestModel).then(onActionRequestSuccess, onActionRequestError);
    }

    var attachEventHandlers = function () {
        $(self.htmlElementIds.sendSms).click(sendSmsOnClick);
        $(self.htmlElementIds.reconnectDevice).click(reconnectDeviceOnClick);
    }

    /*
    * Initialization
    */
    var initActionForm = function () {
        if (!self.deviceId) throw new Error("You must call IoTApp.CellularActions.init(deviceId) with a valid device ID first.");
        attachEventHandlers();
        $(self.htmlElementIds.cellularActionsResults).hide();
    }
    var init = function () {
        var deviceId = IoTApp.Helpers.DeviceIdState.getDeviceIdFromCookie();
        if (deviceId) {
            self.deviceId = IoTApp.Helpers.DeviceIdState.getDeviceIdFromCookie();
        }
    }
    return {
        init: init,
        initActionForm: initActionForm,
        actionTypes: self.actionTypes,
        postActionRequest: postActionRequest
    }
}, [jQuery, resources]);
