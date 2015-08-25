/* Shivving (IE8 is not supported, but at least it won't look as awful)
 /* ========================================================================== */

var today = new Date();
var dd = today.getDate();
var MM = today.getMonth()+1;
if(dd<10){dd='0'+dd}
if(MM<10){MM='0'+MM}
var yyyy = today.getFullYear();

(function (document) {
    var
        head = document.head = document.getElementsByTagName('head')[0] || document.documentElement,
        elements = 'article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output picture progress section summary time video x'.split(' '),
        elementsLength = elements.length,
        elementsIndex = 0,
        element;

    while (elementsIndex < elementsLength) {
        element = document.createElement(elements[++elementsIndex]);
    }

    element.innerHTML = 'x<style>' +
        'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
        'audio[controls],canvas,video{display:inline-block}' +
        '[hidden],audio{display:none}' +
        'mark{background:#FF0;color:#000}' +
        '</style>';

    return head.insertBefore(element.lastChild, head.firstChild);
})(document);

/* Prototyping
 /* ========================================================================== */

(function (window, ElementPrototype, ArrayPrototype, polyfill) {
    function NodeList() { [polyfill] }
    NodeList.prototype.length = ArrayPrototype.length;

    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        function matchesSelector(selector) {
            return ArrayPrototype.indexOf.call(this.parentNode.querySelectorAll(selector), this) > -1;
        };

    ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
        ElementPrototype.mozAncestorQuerySelectorAll ||
        ElementPrototype.msAncestorQuerySelectorAll ||
        ElementPrototype.oAncestorQuerySelectorAll ||
        ElementPrototype.webkitAncestorQuerySelectorAll ||
        function ancestorQuerySelectorAll(selector) {
            for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
                if (cite.matchesSelector(selector)) ArrayPrototype.push.call(newNodeList, cite);
            }

            return newNodeList;
        };

    ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
        ElementPrototype.mozAncestorQuerySelector ||
        ElementPrototype.msAncestorQuerySelector ||
        ElementPrototype.oAncestorQuerySelector ||
        ElementPrototype.webkitAncestorQuerySelector ||
        function ancestorQuerySelector(selector) {
            return this.ancestorQuerySelectorAll(selector)[0] || null;
        };
})(this, Element.prototype, Array.prototype);

/* Helper Functions
 /* ========================================================================== */

function generateTableRow() {
    var emptyColumn = document.createElement('tr');

    emptyColumn.innerHTML = '<td><a class="cut">-</a><span></span></td>' +
        '<td><span contenteditable></span></td>' +
        '<td><span contenteditable></span>szt.</td>' +
        '<td><span contenteditable></span></td>' +
        '<td><span contenteditable></span></td>' +
        '<td><span>' +
        '<select name="vat" id="vat">' +
        '<option value="23">23%</option>' +
        '<option value="22">22%</option>' +
        '<option value="8">8%</option>' +
        '<option value="5">5%</option>' +
        '<option value="0">0%</option>' +
        '<option value="0">NP</option>' +
        '</select>' +
        '</span></td>' +
        '<td><span></span></td>' +
        '<td><span></span></td>';

    return emptyColumn;
}

function parseFloatHTML(element) {
    return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}

function parsePrice(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
}

/* Update Number
 /* ========================================================================== */

function updateNumber(e) {
    var
        activeElement = document.activeElement,
        value = parseFloat(activeElement.innerHTML),
        wasPrice = activeElement.innerHTML == parsePrice(parseFloatHTML(activeElement));

    if (!isNaN(value) && (e.keyCode == 38 || e.keyCode == 40 || e.wheelDeltaY)) {
        e.preventDefault();

        value += e.keyCode == 38 ? 1 : e.keyCode == 40 ? -1 : Math.round(e.wheelDelta * 0.025);
        value = Math.max(value, 0);

        activeElement.innerHTML = wasPrice ? parsePrice(value) : value;
    }

    updateInvoice();
}

/* Update Invoice
 /* ========================================================================== */

function updateInvoice() {
    var total_nett = 0;
    var total_gross = 0;
    var cells, nett, vat, gross, days_to_pay, a, i;

    // update meta cells
    //

    for (var m = document.querySelectorAll('table.meta tbody'), i = 0; m[i]; ++i) {
        cells = m[i].querySelectorAll('span:last-child');
	var end_date = new Date();
        days_to_pay = parseInt(document.getElementById("days_to_pay").value);
        if(!days_to_pay) {
            days_to_pay = 0;
        }
        end_date.setDate(today.getDate()+days_to_pay);
	DAY = end_date.getDate();
	MONTH = end_date.getMonth()+1;
	YEAR = end_date.getFullYear();
	if(DAY<10){DAY='0'+DAY}
	if(MONTH<10){MONTH='0'+MONTH}
        cells[4].innerHTML = YEAR + '.' + MONTH + '.' + DAY;
    }


    // update inventory cells
    // ======================

    for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
        cells = a[i].querySelectorAll('span:last-child');

        cells[0].innerHTML = i+1;
        nett = parseFloatHTML(cells[3]) * parseFloatHTML(cells[4]);
        cells[6].innerHTML = nett;

        vat = parseInt(document.getElementsByTagName("select")[i].value);
        gross = nett + (nett * vat / 100);
        cells[7].innerHTML = gross;
        total_nett += nett;
        total_gross += gross;
    }

    // update balance cells
    // ====================

    // get balance cells
    cells = document.querySelectorAll('table.balance td:last-child span:last-child');

    // set total
    cells[0].innerHTML = total_nett;

    // set balance and meta balance
    cells[1].innerHTML = total_gross;

    // update prefix formatting
    // ========================

    cells[2].innerHTML = readNumbers(total_gross);

//    var prefix = document.querySelector('#prefix').innerHTML;
//    for (a = document.querySelectorAll('[data-prefix]'), i = 0; a[i]; ++i) a[i].innerHTML = prefix;

    // update price formatting
    // =======================

    for (a = document.querySelectorAll('span[data-prefix] + span'), i = 0; a[i]; ++i) if (document.activeElement != a[i]) a[i].innerHTML = parsePrice(parseFloatHTML(a[i]));
}

/* On Content Load
 /* ========================================================================== */

function onContentLoad() {
    updateInvoice();

    var
        input = document.querySelector('input'),
        image = document.querySelector('img');

    function onClick(e) {
        var element = e.target.querySelector('[contenteditable]'), row;

        element && e.target != document.documentElement && e.target != document.body && element.focus();

        if (e.target.matchesSelector('.add')) {
            document.querySelector('table.inventory tbody').appendChild(generateTableRow());
        }
        else if (e.target.className == 'cut') {
            row = e.target.ancestorQuerySelector('tr');

            row.parentNode.removeChild(row);
        }

        updateInvoice();
    }

    function onEnterCancel(e) {
        e.preventDefault();

        image.classList.add('hover');
    }

    function onLeaveCancel(e) {
        e.preventDefault();

        image.classList.remove('hover');
    }

    function onFileInput(e) {
        image.classList.remove('hover');

        var
            reader = new FileReader(),
            files = e.dataTransfer ? e.dataTransfer.files : e.target.files,
            i = 0;

        reader.onload = onFileLoad;

        while (files[i]) reader.readAsDataURL(files[i++]);
    }

    function onFileLoad(e) {
        var data = e.target.result;

        image.src = data;
    }

    if (window.addEventListener) {
        document.addEventListener('click', onClick);

        document.addEventListener('mousewheel', updateNumber);
        document.addEventListener('keydown', updateNumber);

        document.addEventListener('keydown', updateInvoice);
        document.addEventListener('keyup', updateInvoice);

        input.addEventListener('focus', onEnterCancel);
        input.addEventListener('mouseover', onEnterCancel);
        input.addEventListener('dragover', onEnterCancel);
        input.addEventListener('dragenter', onEnterCancel);

        input.addEventListener('blur', onLeaveCancel);
        input.addEventListener('dragleave', onLeaveCancel);
        input.addEventListener('mouseout', onLeaveCancel);

        input.addEventListener('drop', onFileInput);
        input.addEventListener('change', onFileInput);
    }
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);



// validate numbers only //

$(document).ready(function() {
    $("#txtboxToFilter").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});




// print button //

function myFunction() {
    window.print();
}