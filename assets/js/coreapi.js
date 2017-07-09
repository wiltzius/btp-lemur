// simple module wrapper around the coreapi and schema globals that django-rest-framework injects

const client = new window.coreapi.Client();

export default {
  'client': client,
  'coreapi': window.coreapi,
  'schema': window.schema
}
