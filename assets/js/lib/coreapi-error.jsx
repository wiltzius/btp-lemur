import * as _ from 'lodash';

function isCoreAPIError(err) {
  // no easy way to tell whether this is a CoreAPI schema error or a random other HTTP failure, so do it heuristically
  return err.name === "ErrorObject" && _.isObject(err.content);
}

function coreAPIErrorToList(err, labelMap) {
  if(isCoreAPIError(err)) {
    return _.map(err.content, (message, key) => {
      return `${labelMap[key]}: ${message}`
    });
  } else {
    // TODO need to handle validation error messages that don't come from the Django REST framework
    // right now they're returned as 500s with no useful content (only debug html) so this probably needs to change on
    // the DRF side
    return ['An error has occurred'];
  }
}

export function coreAPIErrorToUniqueList(err, labelMap) {
  return _.uniq(coreAPIErrorToList(err, labelMap));
}
