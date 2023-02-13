// import {MCS} from './mcs-ajax.js';
let reddata, bluedata = [];
let addressSelectorID = ["#RedDelSendersip", ];
let bwSelectorID = [];
let bwTypeSelectorID = [];
let sourceIpSelectorID = [];
let destIpSelectorID = [];
let inIntIdSelectorID = [];
let trackingIdSelectorID = [];

function copyandpaste(e) {
    console.log(e.for);
    console.log(e.value);

}

$(document).ready(function() {
    // $('.list-group, :button, btn, btn-outline-warning').on('click', function(){
    //     console.log($(this).val());
    // });

    $('#delRedSenders').hide();
    $('#addRedSenders').hide();
    $('#modRedBw').hide();
    $('#delBlueSenders').hide();
    $('#addBlueSenders').hide();
    $('#modBlueBw').hide();

    $("#BlueOptions").on('change', function() {
        var selectedVal = $(this).val();
        switch (selectedVal) {
        case 'delBlueSenders':
            $('#addBlueSenders').hide();
            $('#modBlueBw').hide();
            $('#delBlueSenders').show();
            break;
        case 'addBlueSenders':
            $('#delBlueSenders').hide();
            $('#modBlueBw').hide();
            $('#addBlueSenders').show();
            break;
        case 'modBlueBw':
            $('#delBlueenders').hide();
            $('#modBlueBw').show();
            $('#addBlueSenders').hide();
            break;
        case 'hideallBlue':
            $('#delBlueSenders').hide();
            $('#addBlueSenders').hide();
            $('#modBlueBw').hide();
            break;
        }
    });
    //Action View Management
    $("#RedOptions").on('change', function() {
        var selectedVal = $(this).val();
        switch (selectedVal) {
        case 'delRedSenders':
            $('#addRedSenders').hide();
            $('#modRedBw').hide();
            $('#delRedSenders').show();
            break;
        case 'addRedSenders':
            $('#delRedSenders').hide();
            $('#modRedBw').hide();
            $('#addRedSenders').show();
            break;
        case 'modRedBw':
            $('#delRedenders').hide();
            $('#modRedBw').show();
            $('#addRedSenders').hide();
            break;
        case 'hideallRed':
            $('#delRedSenders').hide();
            $('#addRedSenders').hide();
            $('#modRedBw').hide();
            break;
        }
    });
    //ON CLICK ADD IP TO ACTIONS IN FRONTEND AND GET ALL SENDERS VIA AJAX CALL
    $('#getRedSenders').on('click', function() {
        console.log("Click to Get Red Senders");
        if ($('#getRedSendersIP').val()) {
            let cvxIP = $('#getRedSendersIP').val();
            $('input[name="RedDelSendersip"]').val(cvxIP);
            $('input[name="RedAddSendersip"]').val(cvxIP);
            $('input[name="RedmodBwip"]').val(cvxIP);
            $.ajax({
                "url": `/mcs/get-senders?ip=${cvxIP}`,
                "method": "GET",
                "timeout": 0,
                "error": function(err) {
                    console.log(err);
                    console.log('Request Status: ' + err.status + ' Status Text: ' + err.statusText + ' ' + err.responseText);
                },
                "success": function(res) {
                    MCS.formatHtml(res, '#redSendersList', "Red");
                    reddata = res;
                }
            });
            
        }
    });
    //ON CLICK ADD IP TO ACTIONS IN FRONTEND AND GET ALL SENDERS VIA AJAX CALL
    $('#getBlueSenders').on('click', function() {
        console.log("Click to Get Blue Senders");
        if ($('#getBlueSendersIP').val()) {
            let cvxIP = $('#getBlueSendersIP').val();
            $('input[name="BlueDelSendersip"]').val(cvxIP);
            $('input[name="BlueAddSendersip"]').val(cvxIP);
            $('input[name="BluemodBwip"]').val(cvxIP);
            $.ajax({
                "url": `/mcs/get-senders?ip=${cvxIP}`,
                "method": "GET",
                "timeout": 0,
                "error": function(err) {
                    console.log(err);
                    console.log('Request Status: ' + err.status + ' Status Text: ' + err.statusText + ' ' + err.responseText);
                },
                "success": function(res) {
                    MCS.formatHtml(res, '#blueSendersList', "Blue");
                    bluedata = res;
                }
            });
        }
    });
    
});
