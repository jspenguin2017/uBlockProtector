//Set up
activateEvalFilter(/hi/i);
activateSetIntervalFilter(/hi/i);
setReadOnly("test", "hi");

//Tests
eval("alert('Hi');"); //Should be blocked
eval("alert('Hello');"); //Should pass

setInterval(function (hi) {
    alert(hi);
}, 3000, "hello"); //Should be blocked
setInterval(function (msg, ignored) {
    alert(msg);
}, 3000, "hello", "hi~"); //Should be blocked
setInterval(function (msg, msg2) {
    alert(msg2);
}, 3000, "hello!", "hello~"); //Should pass

test = "hello"; //Should fail
