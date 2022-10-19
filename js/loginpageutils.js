var XMLDOM_ID = "MSXML2.DOMDocument.6.0", XMLHTTP_ID = "MSXML2.XMLHTTP.6.0";
var params = getUrlVars();
if (params['userName'] != null) {
    document.getElementById('userName').value = params['userName'];
}

function showError(code) {
    if (code == 'PLUGIN_NOT_INSTALLED') {
        window.location.href = "plugin_download.html?platform=" + detectPlatform();
    }
    var error = getErrorText(code);

    if (error != null) {
        capsLockEnabled = false;
        checkCapsWarning();
        if (code == 'EMPTY_FIELDS') {
            if (document.getElementById('userName').value.length == 0) {
                document.getElementById('userName').className = "input withErrors";
                document.getElementById('password').className = "input";
            } else {
                document.getElementById('password').className = "input withErrors";
                document.getElementById('userName').className = "input";
            }
        } else {
            document.getElementById('password').value = '';
        }
        document.getElementById('errorMessage').innerHTML = error;
        document.getElementById('errorFrame').style.display = 'flex';
        unlockScreen();
    } else {
        document.getElementById('password').className = "input";
        document.getElementById('userName').className = "input";
        document.getElementById('errorMessage').innerHTML = '';
        document.getElementById('errorFrame').style.display = 'none';
    }
}

showError(params['error']);

// window.onresize = function () {
//     resize();
// };
// resize();

unlockScreen();

/**
 * Текущее состояние CapsLock
 *  - null : неизвестно
 *  - true/false : CapsLock включен/выключен
 */
var capsLockEnabled = null;
//при уходе на другую вкладку состояние CapsLock опять неизвестно
window.addEventListener("blur", function () {
    capsLockEnabled = null;
});

function getChar(event) {
    if (event.which == null) {
        if (event.keyCode < 32) {
            return null;
        }
        return String.fromCharCode(event.keyCode); // IE
    }

    if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) {
            return null;
        }
        return String.fromCharCode(event.which);   // остальные
    }

    return null; // специальная клавиша
}

document.msCapsLockWarningOff = true; // отключение нативного предупреждения IE о нажатом CapsLock
document.onkeypress = function (e) {
    e = e || event;

    var chr = getChar(e);
    if (!chr) {
        return
    } // special key

    if (chr.toLowerCase() == chr.toUpperCase()) {
        // символ, не зависящий от регистра, например пробел
        // не может быть использован для определения CapsLock
        return;
    }

    capsLockEnabled = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
};

/**
 * Проверить CapsLock
 */
function checkCapsWarning(event) {
    // на мобильных платформах не показываем предупреждение
    if (['Android', 'iPod', 'iPad', 'iPhone'].some(function (item) {
            return navigator.userAgent.indexOf(item) >= 0;
        })
    ) {
        return;
    }
    if(capsLockEnabled){
        showError(null);
    }
    document.getElementById('capsIndicator').style.display = capsLockEnabled ? 'flex' : 'none';
}

function keyListener(event) {
    if (navigator.platform.substr(0, 3) != 'Mac') { // событие для CapsLock глючит под Mac
        event = event || event;
        capsLockEnabled = event.getModifierState("CapsLock");
        checkCapsWarning(event);
    }

    var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;
    if (keyCode == 13) {
        document.getElementById('submitButton').click();
        return false;
    } else if (keyCode == 8) {
        return backspaceEventHandler(event)
    } else {
        return true;
    }
}


function submit(onReturn) {
    var login = document.getElementById('userName');
    if (login.value.length == 0) {
        showError('EMPTY_FIELDS');
        login.focus();
        login.focus();
        return;
    }
    var password = document.getElementById('password');
    if (password.value.length == 0) {
        showError('EMPTY_FIELDS');
        password.focus();
        password.focus();
        return;
    }

    lockScreen();

    var callback = function (result) {
        loaderDisable();
        if (result.indexOf('OK;') == 0) {
            window.location = result.substr(3);
        }

        showError(result);
        if (onReturn) {
            onReturn(result)
        }
    };
    loaderEnable()
    doLogin(document.getElementById('userName').value, password.value, callback);
}

function loaderEnable(){
    document.querySelector('#loader').style.display = 'inherit';
    document.querySelector('#login-button-text').style.display = 'none';
}

function loaderDisable(){
    document.querySelector('#loader').style.display = 'none';
    document.querySelector('#login-button-text').style.display = 'inherit';
}

function lockScreen() {
    document.onkeydown = null;
    document.getElementById('userName').blur();
    document.getElementById('password').blur();
    document.getElementById('submitButton').blur();

    var modalMask = document.getElementById('modalMask');
    if (modalMask != null) {
        modalMask.style.display = 'block';
    }

    document.body.style.cursor = 'wait';
}

function unlockScreen() {
    var userField = document.getElementById('userName');
    if (userField.value.length == 0) {
        // у IE большие проблемы с передачей фокуса, одно из решений - пинать его дважды
        userField.focus();
        userField.focus();
    }
    else {
        var password = document.getElementById('password');
        if (password.style.display != "none") {
            password.focus();
            password.focus();
        }
    }

    document.onkeypress = keyListener;

    var modalMask = document.getElementById('modalMask');
    if (modalMask != null) {
        modalMask.style.display = 'none';
    }

    document.body.style.cursor = 'default';
}

function resize() {
    if (typeof window.innerWidth != 'undefined') {
        document.body.style.height = window.innerHeight + "px";
        document.body.style.width = window.innerWidth + "px";
    }
    else {
        // для старых версий IE
        document.body.style.height = document.documentElement.clientHeight + "px";
        document.body.style.width = document.documentElement.clientWidth + "px";
    }
}
