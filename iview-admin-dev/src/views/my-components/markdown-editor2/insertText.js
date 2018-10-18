function insertText (dom, string) {
    if (document.execCommand('insertText', false, string)) {
        return;
    } else {
        let start = dom.selectionStart;
        let end = dom.selectionEnd;
        dom.value = dom.value.substring(0, start) + string + dom.value.substring(end, dom.value.length);
        dom.selectionStart = start + string.length;
        dom.selectionEnd = start + string.length;
        dom.focus();
    }
}
export default insertText;
