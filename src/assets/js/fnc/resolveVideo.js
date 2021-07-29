import kitx from "kitx";
import axios from "axios";
const x2js = require("x2js");

let get_plublic = function(parm) {
  //获取上传凭证
  var params = parm;
  params.Version = "2017-03-21";
  params.AccessKeyId = "LTAI377NJcUbneCs";
  params.SignatureMethod = "HMAC-SHA1";
  params.SignatureVersion = "1.0";
  params.Timestamp = timestamp();
  params.SignatureNonce = kitx.makeNonce();
  var methods = "GET";
  var normalized = normalize(params);
  var canonicalized = canonicalize(normalized);
  var stringToSign = `${methods}&${encode("/")}&${encode(canonicalized)}`;
  const key = "lFhNLkYJZEPGODPrfwDuyrZRMDXV2c&";
  var signature = kitx.sha1(stringToSign, key, "base64");
  normalized.push(["Signature", encode(signature)]);
  var send_url =
    window.location.protocol +
    "//vod.cn-shanghai.aliyuncs.com/?" +
    canonicalize(normalized);
  return send_url;
};
let timestamp = function() {
  var date = new Date();
  var YYYY = date.getUTCFullYear();
  var MM = kitx.pad2(date.getUTCMonth() + 1);
  var DD = kitx.pad2(date.getUTCDate());
  var HH = kitx.pad2(date.getUTCHours());
  var mm = kitx.pad2(date.getUTCMinutes());
  var ss = kitx.pad2(date.getUTCSeconds());
  // 删除掉毫秒部分
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
};
let replaceRepeatList = function(target, key, repeat) {
  for (var i = 0; i < repeat.length; i++) {
    var item = repeat[i];
    if (item && typeof item === "object") {
      const keys = Object.keys(item);
      for (var j = 0; j < keys.length; j++) {
        target[`${key}.${i + 1}.${keys[j]}`] = item[keys[j]];
      }
    } else {
      target[`${key}.${i + 1}`] = item;
    }
  }
};
let flatParams = function(params) {
  var target = {};
  var keys = Object.keys(params);
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = params[key];
    if (Array.isArray(value)) {
      replaceRepeatList(target, key, value);
    } else {
      target[key] = value;
    }
  }
  return target;
};
let normalize = function(params) {
  var list = [];
  var flated = flatParams(params);
  var keys = Object.keys(flated).sort();
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = flated[key];
    list.push([encode(key), encode(value)]); //push []
  }
  return list;
};
let canonicalize = function(normalized) {
  var fields = [];
  for (var i = 0; i < normalized.length; i++) {
    var [key, value] = normalized[i];
    fields.push(key + "=" + value);
  }
  return fields.join("&");
};
let encode = function(str) {
  var result = encodeURIComponent(str);
  return result
    .replace(/\!/g, "%21")
    .replace(/\'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
};

export function resolveUrl(ID) {
  //获取播放视频详情
  return new Promise((resolve, reject) => {
    var $x2js = new x2js();
    var params = {};
    params.Action = "GetPlayInfo";
    params.VideoId = ID;
    params.Formats = "mp4";
    params.StreamType = "video";
    let send_url = get_plublic(params);
    axios
      .get(send_url, params)
      .then((res) => {
        var data = $x2js.xml2js(res.data).GetPlayInfoResponse;
        resolve(data);
      })
      .catch((rej) => {
        reject(rej);
      });
  });
}
