var _0x58a3 = [
  "encode",
  "byteLength",
  "00000000",
  "subtle",
  "length",
  "digest",
  "getUint32",
  "slice",
  "SHA-256",
  "exports",
];
(function (_0x598dd6, _0x58a32c) {
  var _0x4f36cc = function (_0x1bca52) {
    while (--_0x1bca52) {
      _0x598dd6["push"](_0x598dd6["shift"]());
    }
  };
  _0x4f36cc(++_0x58a32c);
})(_0x58a3, 0xef);
var _0x4f36 = function (_0x598dd6, _0x58a32c) {
  _0x598dd6 = _0x598dd6 - 0x0;
  var _0x4f36cc = _0x58a3[_0x598dd6];
  return _0x4f36cc;
};
var _0x56e528 = _0x4f36;
module[_0x56e528("0x0")] = function hash(_0x1bca52) {
  var _0x4bd415 = _0x56e528,
    _0xd9a5f =
      arguments[_0x4bd415("0x5")] > 0x1 && arguments[0x1] !== undefined
        ? arguments[0x1]
        : _0x4bd415("0x9");
  return new Promise(function (_0x20607e, _0x13d422) {
    var _0x18ce8e = _0x4bd415;
    try {
      var _0x1c603c = new TextEncoder()[_0x18ce8e("0x1")](_0x1bca52);
      crypto[_0x18ce8e("0x4")]
        [_0x18ce8e("0x6")](_0xd9a5f, _0x1c603c)
        ["then"](function (_0x50a001) {
          var _0x1b64b5 = _0x18ce8e;
          try {
            var _0x2e677b = "",
              _0x4cb496 = new DataView(_0x50a001);
            for (
              var _0x51224b = 0x0;
              _0x51224b < _0x50a001[_0x1b64b5("0x2")];
              _0x51224b += 0x4
            ) {
              _0x2e677b += (_0x1b64b5("0x3") +
                _0x4cb496[_0x1b64b5("0x7")](_0x51224b)["toString"](0x10))[
                _0x1b64b5("0x8")
              ](-0x8);
            }
            _0x20607e(_0x2e677b);
          } catch (_0x2edae2) {
            _0x13d422(_0x2edae2);
          }
        });
    } catch (_0x3b605d) {
      _0x13d422(_0x3b605d);
    }
  });
};
