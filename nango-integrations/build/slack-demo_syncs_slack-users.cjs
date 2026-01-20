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
  // Human-friendly metadata for the sync
  description: "Fetches Slack users",
  version: "1.0.1",
  endpoints: [{
    method: "GET",
    path: "/example/slack/users",
    group: "Users"
  }],
  // Keep the demo simple with a periodic full sync
  frequency: "every hour",
  syncType: "full",
  // No extra input required for this sync
  metadata: z.void(),
  models: {
    SlackUser: SlackUserSchema
  },
  exec: async (nango) => {
    const response = await nango.get({
      endpoint: "/users.list"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2xhY2stZGVtby9zeW5jcy9zbGFjay11c2Vycy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3JlYXRlU3luYyB9IGZyb20gJ25hbmdvJztcbmltcG9ydCAqIGFzIHogZnJvbSAnem9kJztcblxuLy8gU2NoZW1hIGZvciBlYWNoIFNsYWNrIHVzZXIgcmVjb3JkIHNhdmVkIGJ5IHRoZSBzeW5jXG5jb25zdCBTbGFja1VzZXJTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICBuYW1lOiB6LnN0cmluZygpLFxuICByZWFsX25hbWU6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgaW1hZ2VfNzI6IHouc3RyaW5nKCkub3B0aW9uYWwoKVxufSk7XG5leHBvcnQgY29uc3Qgc3luYyA9IHtcbiAgdHlwZTogXCJzeW5jXCIsXG4gIC8vIEh1bWFuLWZyaWVuZGx5IG1ldGFkYXRhIGZvciB0aGUgc3luY1xuICBkZXNjcmlwdGlvbjogJ0ZldGNoZXMgU2xhY2sgdXNlcnMnLFxuICB2ZXJzaW9uOiAnMS4wLjEnLFxuICBlbmRwb2ludHM6IFt7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBwYXRoOiAnL2V4YW1wbGUvc2xhY2svdXNlcnMnLFxuICAgIGdyb3VwOiAnVXNlcnMnXG4gIH1dLFxuICAvLyBLZWVwIHRoZSBkZW1vIHNpbXBsZSB3aXRoIGEgcGVyaW9kaWMgZnVsbCBzeW5jXG4gIGZyZXF1ZW5jeTogJ2V2ZXJ5IGhvdXInLFxuICBzeW5jVHlwZTogJ2Z1bGwnLFxuICAvLyBObyBleHRyYSBpbnB1dCByZXF1aXJlZCBmb3IgdGhpcyBzeW5jXG4gIG1ldGFkYXRhOiB6LnZvaWQoKSxcbiAgbW9kZWxzOiB7XG4gICAgU2xhY2tVc2VyOiBTbGFja1VzZXJTY2hlbWFcbiAgfSxcbiAgZXhlYzogYXN5bmMgbmFuZ28gPT4ge1xuICAgIC8vIEZldGNoIGFsbCBtZW1iZXJzIGZyb20gU2xhY2sgKFdlYiBBUEkgZW5kcG9pbnQpXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBuYW5nby5nZXQoe1xuICAgICAgZW5kcG9pbnQ6ICcvdXNlcnMubGlzdCdcbiAgICB9KTtcbiAgICBjb25zdCBtZW1iZXJzID0gcmVzcG9uc2UuZGF0YT8ubWVtYmVycyB8fCBbXTtcblxuICAgIC8vIENvbnZlcnQgU2xhY2sgcGF5bG9hZHMgaW50byB0aGUgc2NoZW1hIHNoYXBlXG4gICAgY29uc3QgcmVjb3JkcyA9IG1lbWJlcnMubWFwKCh1OiBhbnkpID0+ICh7XG4gICAgICBpZDogdS5pZCxcbiAgICAgIG5hbWU6IHUubmFtZSxcbiAgICAgIHJlYWxfbmFtZTogdS5yZWFsX25hbWUsXG4gICAgICBpbWFnZV83MjogdS5wcm9maWxlPy5pbWFnZV83MlxuICAgIH0pKTtcblxuICAgIC8vIFBlcnNpc3QgdGhlIHJlY29yZHMgdG8gTmFuZ28ncyBkYXRhIHN0b3JlXG4gICAgYXdhaXQgbmFuZ28uYmF0Y2hTYXZlKHJlY29yZHMsICdTbGFja1VzZXInKTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IHN5bmM7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsUUFBbUI7QUFHbkIsSUFBTSxrQkFBb0IsU0FBTztBQUFBLEVBQy9CLElBQU0sU0FBTztBQUFBLEVBQ2IsTUFBUSxTQUFPO0FBQUEsRUFDZixXQUFhLFNBQU8sRUFBRSxTQUFTO0FBQUEsRUFDL0IsVUFBWSxTQUFPLEVBQUUsU0FBUztBQUNoQyxDQUFDO0FBQ00sSUFBTSxPQUFPO0FBQUEsRUFDbEIsTUFBTTtBQUFBO0FBQUEsRUFFTixhQUFhO0FBQUEsRUFDYixTQUFTO0FBQUEsRUFDVCxXQUFXLENBQUM7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNULENBQUM7QUFBQTtBQUFBLEVBRUQsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBO0FBQUEsRUFFVixVQUFZLE9BQUs7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsTUFBTSxPQUFNLFVBQVM7QUFFbkIsVUFBTSxXQUFXLE1BQU0sTUFBTSxJQUFJO0FBQUEsTUFDL0IsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUNELFVBQU0sVUFBVSxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRzNDLFVBQU0sVUFBVSxRQUFRLElBQUksQ0FBQyxPQUFZO0FBQUEsTUFDdkMsSUFBSSxFQUFFO0FBQUEsTUFDTixNQUFNLEVBQUU7QUFBQSxNQUNSLFdBQVcsRUFBRTtBQUFBLE1BQ2IsVUFBVSxFQUFFLFNBQVM7QUFBQSxJQUN2QixFQUFFO0FBR0YsVUFBTSxNQUFNLFVBQVUsU0FBUyxXQUFXO0FBQUEsRUFDNUM7QUFDRjtBQUNBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
