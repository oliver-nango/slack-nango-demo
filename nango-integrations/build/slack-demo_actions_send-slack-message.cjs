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
  // Metadata used by Nango UI + docs
  description: "Send a message to a Slack channel",
  version: "1.0.0",
  // This endpoint is exposed by Nango when the action is deployed
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2xhY2stZGVtby9hY3Rpb25zL3NlbmQtc2xhY2stbWVzc2FnZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3JlYXRlQWN0aW9uIH0gZnJvbSAnbmFuZ28nO1xuaW1wb3J0ICogYXMgeiBmcm9tICd6b2QnO1xuXG4vLyBJbnB1dCB2YWxpZGF0aW9uIHNjaGVtYSBmb3IgdGhlIGFjdGlvbiBwYXlsb2FkXG5jb25zdCBTZW5kU2xhY2tNZXNzYWdlSW5wdXQgPSB6Lm9iamVjdCh7XG4gIGNoYW5uZWw6IHouc3RyaW5nKCksXG4gIHRleHQ6IHouc3RyaW5nKClcbn0pO1xuXG4vLyBPdXRwdXQgdmFsaWRhdGlvbiBzY2hlbWEgdG8ga2VlcCBhY3Rpb24gcmVzcG9uc2VzIGNvbnNpc3RlbnRcbmNvbnN0IFNlbmRTbGFja01lc3NhZ2VPdXRwdXQgPSB6Lm9iamVjdCh7XG4gIG9rOiB6LmJvb2xlYW4oKSxcbiAgY2hhbm5lbDogei5zdHJpbmcoKSxcbiAgdHM6IHouc3RyaW5nKClcbn0pO1xuZXhwb3J0IGNvbnN0IGFjdGlvbiA9IHtcbiAgdHlwZTogXCJhY3Rpb25cIixcbiAgLy8gTWV0YWRhdGEgdXNlZCBieSBOYW5nbyBVSSArIGRvY3NcbiAgZGVzY3JpcHRpb246ICdTZW5kIGEgbWVzc2FnZSB0byBhIFNsYWNrIGNoYW5uZWwnLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAvLyBUaGlzIGVuZHBvaW50IGlzIGV4cG9zZWQgYnkgTmFuZ28gd2hlbiB0aGUgYWN0aW9uIGlzIGRlcGxveWVkXG4gIGVuZHBvaW50OiB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgcGF0aDogJy9leGFtcGxlL3NsYWNrL21lc3NhZ2UnLFxuICAgIGdyb3VwOiAnTWVzc2FnZXMnXG4gIH0sXG4gIGlucHV0OiBTZW5kU2xhY2tNZXNzYWdlSW5wdXQsXG4gIG91dHB1dDogU2VuZFNsYWNrTWVzc2FnZU91dHB1dCxcbiAgZXhlYzogYXN5bmMgKG5hbmdvLCBpbnB1dCkgPT4ge1xuICAgIC8vIEV4dHJhY3QgdmFsaWRhdGVkIGlucHV0c1xuICAgIGNvbnN0IHtcbiAgICAgIGNoYW5uZWwsXG4gICAgICB0ZXh0XG4gICAgfSA9IGlucHV0O1xuXG4gICAgLy8gQ2FsbCBTbGFjaydzIGNoYXQucG9zdE1lc3NhZ2UgQVBJIHZpYSB0aGUgTmFuZ28gcHJveHlcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG5hbmdvLnBvc3Qoe1xuICAgICAgZW5kcG9pbnQ6ICcvY2hhdC5wb3N0TWVzc2FnZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGNoYW5uZWwsXG4gICAgICAgIHRleHRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJldHVybiByYXcgU2xhY2sgcmVzcG9uc2UgKGZpbHRlcmVkIGJ5IG91dHB1dCBzY2hlbWEpXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cbn07XG5leHBvcnQgZGVmYXVsdCBhY3Rpb247Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsUUFBbUI7QUFHbkIsSUFBTSx3QkFBMEIsU0FBTztBQUFBLEVBQ3JDLFNBQVcsU0FBTztBQUFBLEVBQ2xCLE1BQVEsU0FBTztBQUNqQixDQUFDO0FBR0QsSUFBTSx5QkFBMkIsU0FBTztBQUFBLEVBQ3RDLElBQU0sVUFBUTtBQUFBLEVBQ2QsU0FBVyxTQUFPO0FBQUEsRUFDbEIsSUFBTSxTQUFPO0FBQ2YsQ0FBQztBQUNNLElBQU0sU0FBUztBQUFBLEVBQ3BCLE1BQU07QUFBQTtBQUFBLEVBRU4sYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBO0FBQUEsRUFFVCxVQUFVO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLEVBQ1IsTUFBTSxPQUFPLE9BQU8sVUFBVTtBQUU1QixVQUFNO0FBQUEsTUFDSjtBQUFBLE1BQ0E7QUFBQSxJQUNGLElBQUk7QUFHSixVQUFNLFdBQVcsTUFBTSxNQUFNLEtBQUs7QUFBQSxNQUNoQyxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBR0QsV0FBTyxTQUFTO0FBQUEsRUFDbEI7QUFDRjtBQUNBLElBQU8sNkJBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
