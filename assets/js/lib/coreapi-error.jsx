import * as _ from 'lodash';

export function coreAPIErrorToList(err, labelMap) {
  return _.map(err.content, (message, key) => {
    return `${labelMap[key]}: ${message}`
  })
}