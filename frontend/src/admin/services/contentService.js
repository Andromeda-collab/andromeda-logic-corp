import adminApi from "./adminApi.js";

// Generic CRUD against a module's apiPath. Modules flagged adminScoped
// (missions, careers) have public list/get endpoints that filter out
// drafts/closed items, so admin reads go through /admin/all + /admin/{id}
// instead to see everything.
export function listRecords(module) {
  const path = module.adminScoped ? `${module.apiPath}/admin/all` : `${module.apiPath}/`;
  return adminApi.get(path).then((res) => res.data);
}

export function getRecord(module, id) {
  if (module.singleton) {
    return adminApi.get(`${module.apiPath}/`).then((res) => res.data);
  }
  const path = module.adminScoped ? `${module.apiPath}/admin/${id}` : `${module.apiPath}/${id}`;
  return adminApi.get(path).then((res) => res.data);
}

export function createRecord(module, payload) {
  return adminApi.post(`${module.apiPath}/`, payload).then((res) => res.data);
}

export function updateRecord(module, id, payload) {
  if (module.singleton) {
    return adminApi.put(`${module.apiPath}/`, payload).then((res) => res.data);
  }
  return adminApi.put(`${module.apiPath}/${id}`, payload).then((res) => res.data);
}

export function deleteRecord(module, id) {
  return adminApi.delete(`${module.apiPath}/${id}`);
}
