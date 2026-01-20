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

// slack-demo/syncs/slack-users.ts
var slack_users_exports = {};
__export(slack_users_exports, {
  default: () => slack_users_default,
  sync: () => sync
});
module.exports = __toCommonJS(slack_users_exports);
var z = __toESM(require("zod"), 1);
var SlackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  real_name: z.string().optional(),
  image_72: z.string().optional()
});
var sync = {
  type: "sync",
  description: "Fetches Slack users",
  version: "1.0.0",
  endpoints: [{
    method: "GET",
    path: "/example/slack/users",
    group: "Users"
  }],
  frequency: "every hour",
  syncType: "full",
  metadata: z.void(),
  models: {
    SlackUser: SlackUserSchema
  },
  exec: async (nango) => {
    const response = await nango.get({
      endpoint: "/api/users.list"
    });
    const members = response.data?.members || [];
    const records = members.map((u) => ({
      id: u.id,
      name: u.name,
      real_name: u.real_name,
      image_72: u.profile?.image_72
    }));
    await nango.batchSave(records, "SlackUser");
  }
};
var slack_users_default = sync;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sync
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2xhY2stZGVtby9zeW5jcy9zbGFjay11c2Vycy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3JlYXRlU3luYyB9IGZyb20gJ25hbmdvJztcbmltcG9ydCAqIGFzIHogZnJvbSAnem9kJztcbmNvbnN0IFNsYWNrVXNlclNjaGVtYSA9IHoub2JqZWN0KHtcbiAgaWQ6IHouc3RyaW5nKCksXG4gIG5hbWU6IHouc3RyaW5nKCksXG4gIHJlYWxfbmFtZTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBpbWFnZV83Mjogei5zdHJpbmcoKS5vcHRpb25hbCgpXG59KTtcbmV4cG9ydCBjb25zdCBzeW5jID0ge1xuICB0eXBlOiBcInN5bmNcIixcbiAgZGVzY3JpcHRpb246ICdGZXRjaGVzIFNsYWNrIHVzZXJzJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgZW5kcG9pbnRzOiBbe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgcGF0aDogJy9leGFtcGxlL3NsYWNrL3VzZXJzJyxcbiAgICBncm91cDogJ1VzZXJzJ1xuICB9XSxcbiAgZnJlcXVlbmN5OiAnZXZlcnkgaG91cicsXG4gIHN5bmNUeXBlOiAnZnVsbCcsXG4gIG1ldGFkYXRhOiB6LnZvaWQoKSxcbiAgbW9kZWxzOiB7XG4gICAgU2xhY2tVc2VyOiBTbGFja1VzZXJTY2hlbWFcbiAgfSxcbiAgZXhlYzogYXN5bmMgbmFuZ28gPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbmFuZ28uZ2V0KHtcbiAgICAgIGVuZHBvaW50OiAnL2FwaS91c2Vycy5saXN0J1xuICAgIH0pO1xuICAgIGNvbnN0IG1lbWJlcnMgPSByZXNwb25zZS5kYXRhPy5tZW1iZXJzIHx8IFtdO1xuICAgIGNvbnN0IHJlY29yZHMgPSBtZW1iZXJzLm1hcCgodTogYW55KSA9PiAoe1xuICAgICAgaWQ6IHUuaWQsXG4gICAgICBuYW1lOiB1Lm5hbWUsXG4gICAgICByZWFsX25hbWU6IHUucmVhbF9uYW1lLFxuICAgICAgaW1hZ2VfNzI6IHUucHJvZmlsZT8uaW1hZ2VfNzJcbiAgICB9KSk7XG4gICAgYXdhaXQgbmFuZ28uYmF0Y2hTYXZlKHJlY29yZHMsICdTbGFja1VzZXInKTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IHN5bmM7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsUUFBbUI7QUFDbkIsSUFBTSxrQkFBb0IsU0FBTztBQUFBLEVBQy9CLElBQU0sU0FBTztBQUFBLEVBQ2IsTUFBUSxTQUFPO0FBQUEsRUFDZixXQUFhLFNBQU8sRUFBRSxTQUFTO0FBQUEsRUFDL0IsVUFBWSxTQUFPLEVBQUUsU0FBUztBQUNoQyxDQUFDO0FBQ00sSUFBTSxPQUFPO0FBQUEsRUFDbEIsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1QsV0FBVyxDQUFDO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVCxDQUFDO0FBQUEsRUFDRCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQUEsRUFDVixVQUFZLE9BQUs7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsTUFBTSxPQUFNLFVBQVM7QUFDbkIsVUFBTSxXQUFXLE1BQU0sTUFBTSxJQUFJO0FBQUEsTUFDL0IsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUNELFVBQU0sVUFBVSxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBQzNDLFVBQU0sVUFBVSxRQUFRLElBQUksQ0FBQyxPQUFZO0FBQUEsTUFDdkMsSUFBSSxFQUFFO0FBQUEsTUFDTixNQUFNLEVBQUU7QUFBQSxNQUNSLFdBQVcsRUFBRTtBQUFBLE1BQ2IsVUFBVSxFQUFFLFNBQVM7QUFBQSxJQUN2QixFQUFFO0FBQ0YsVUFBTSxNQUFNLFVBQVUsU0FBUyxXQUFXO0FBQUEsRUFDNUM7QUFDRjtBQUNBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
