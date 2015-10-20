var _ = require('underscore');

var helpers = {}

/**
 * Returns an unique array from a source array and an existing array of mongoDB objects with a nested ID.
 * @param {Array} newItems
 * @param {Array} existingItems
 * @param {String} prop - Lookup key within existingItems (existingItems[prop])
 * @returns {void}
 */
helpers.uniqueItems = function(newItems, existingItems, prop) {
    if (!Array.isArray(newItems) ||
        !Array.isArray(existingItems) ||
        typeof prop != "string") throw new Error("One or more of the arguments 'newItems', 'existingItems', 'prop' are not valid.");

    existingItems = existingItems.map(function(item){
        return item[prop].toString();
    });
    newItems = newItems.map(function(item){
        return item.toString();
    });
    return _.difference(newItems, existingItems);
};


module.exports = helpers;