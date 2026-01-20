"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// slack-demo/actions/send-slack-message.ts
var send_slack_message_exports = {};
__export(send_slack_message_exports, {
  action: () => action,
  default: () => send_slack_message_default
});
module.exports = __toCommonJS(send_slack_message_exports);
var z = __toESM(require("zod"), 1);
var SendSlackMessageInput = z.object({
  channel: z.string(),
  text: z.string()
});
var SendSlackMessageOutput = z.object({
  ok: z.boolean(),
  channel: z.string(),
  ts: z.string()
});
var action = {
  type: "action",
  description: "Send a message to a Slack channel",
  version: "1.0.0",
  endpoint: {
    method: "POST",
    path: "/example/slack/message",
    group: "Messages"
  },
  input: SendSlackMessageInput,
  output: SendSlackMessageOutput,
  exec: async (nango, input) => {
    const {
      channel,
      text
    } = input;
    const response = await nango.post({
      endpoint: "/chat.postMessage",
      data: {
        channel,
        text
      }
    });
    return response.data;
  }
};
var send_slack_message_default = action;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  action
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2xhY2stZGVtby9hY3Rpb25zL3NlbmQtc2xhY2stbWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3JlYXRlQWN0aW9uIH0gZnJvbSAnbmFuZ28nO1xuaW1wb3J0ICogYXMgeiBmcm9tICd6b2QnO1xuY29uc3QgU2VuZFNsYWNrTWVzc2FnZUlucHV0ID0gei5vYmplY3Qoe1xuICBjaGFubmVsOiB6LnN0cmluZygpLFxuICB0ZXh0OiB6LnN0cmluZygpXG59KTtcbmNvbnN0IFNlbmRTbGFja01lc3NhZ2VPdXRwdXQgPSB6Lm9iamVjdCh7XG4gIG9rOiB6LmJvb2xlYW4oKSxcbiAgY2hhbm5lbDogei5zdHJpbmcoKSxcbiAgdHM6IHouc3RyaW5nKClcbn0pO1xuZXhwb3J0IGNvbnN0IGFjdGlvbiA9IHtcbiAgdHlwZTogXCJhY3Rpb25cIixcbiAgZGVzY3JpcHRpb246ICdTZW5kIGEgbWVzc2FnZSB0byBhIFNsYWNrIGNoYW5uZWwnLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICBlbmRwb2ludDoge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHBhdGg6ICcvZXhhbXBsZS9zbGFjay9tZXNzYWdlJyxcbiAgICBncm91cDogJ01lc3NhZ2VzJ1xuICB9LFxuICBpbnB1dDogU2VuZFNsYWNrTWVzc2FnZUlucHV0LFxuICBvdXRwdXQ6IFNlbmRTbGFja01lc3NhZ2VPdXRwdXQsXG4gIGV4ZWM6IGFzeW5jIChuYW5nbywgaW5wdXQpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjaGFubmVsLFxuICAgICAgdGV4dFxuICAgIH0gPSBpbnB1dDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG5hbmdvLnBvc3Qoe1xuICAgICAgZW5kcG9pbnQ6ICcvY2hhdC5wb3N0TWVzc2FnZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYW5uZWwsXG4gICAgICAgIHRleHRcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGFjdGlvbjsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSxRQUFtQjtBQUNuQixJQUFNLHdCQUEwQixTQUFPO0FBQUEsRUFDckMsU0FBVyxTQUFPO0FBQUEsRUFDbEIsTUFBUSxTQUFPO0FBQ2pCLENBQUM7QUFDRCxJQUFNLHlCQUEyQixTQUFPO0FBQUEsRUFDdEMsSUFBTSxVQUFRO0FBQUEsRUFDZCxTQUFXLFNBQU87QUFBQSxFQUNsQixJQUFNLFNBQU87QUFDZixDQUFDO0FBQ00sSUFBTSxTQUFTO0FBQUEsRUFDcEIsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1QsVUFBVTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFBQSxFQUNSLE1BQU0sT0FBTyxPQUFPLFVBQVU7QUFDNUIsVUFBTTtBQUFBLE1BQ0o7QUFBQSxNQUNBO0FBQUEsSUFDRixJQUFJO0FBQ0osVUFBTSxXQUFXLE1BQU0sTUFBTSxLQUFLO0FBQUEsTUFDaEMsVUFBVTtBQUFBLE1BQ1YsTUFBTTtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUNELFdBQU8sU0FBUztBQUFBLEVBQ2xCO0FBQ0Y7QUFDQSxJQUFPLDZCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
