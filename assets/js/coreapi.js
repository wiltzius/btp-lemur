// simple module wrapper around the coreapi and schema globals that django-rest-framework injects

const client = new window.coreapi.Client();
const boundAction = client.action.bind(client, window.schema);

export default {
  'client': client,
  'coreapi': window.coreapi,
  'schema': window.schema,
  'boundAction': boundAction
}
