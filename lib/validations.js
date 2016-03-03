/**
 * Client-side validations for Heap API arguments.
 *
 * @module heap-api/validations
 * @private
 */

/**
 * Throws if the argument is not a valid Heap API application ID.
 *
 * @private
 * @param [string] appId the application ID to be checked
 * @returns [string] the normalized application ID, which will be passed to the
 *   Heap API
 * @throws [Error] if the application ID is not valid
 */
module.exports.normalizeAppId = function(appId) {
  if (typeof(appId) !== "string")
    throw TypeError("Invalid Heap application ID: " + appId);
  if (appId.length === 0)
    throw RangeError("Empty Heap application ID");
  return appId;
};

/**
 * Throws if the argument is not a valid Heap server-side API identity.
 *
 * @private
 * @param [string, number] identity the identity to be checked
 * @returns [string] the normalized identity, which will be passed to the Heap
 *   API
 * @throws [Error] if the identity is not valid
 */
module.exports.normalizeIdentity = function(identity) {
  if (typeof(identity) === "number")
    identity = identity.toString();
  if (typeof(identity) !== "string")
    throw TypeError("Invalid identity: " + identity);
  if (identity.length === 0)
    throw RangeError("Empty identity");
  if (identity.length > 255) {
    throw RangeError("Identity " + identity + " too long; " + identity.length +
        " is above the 255-character limit");
  }

  return identity;
};

/**
 * Throws if the argument is not a valid Heap server-side API event name.
 *
 * @private
 * @param [string] eventName the server-side event name to be checked
 * @returns [string] the normalized event name, which will be
 * @throws [Error] if the event name is not valid
 */
module.exports.normalizeEventName = function(eventName) {
  if (typeof(eventName) !== "string")
    throw TypeError("Invalid event name: " + eventName);
  if (eventName.length === 0)
    throw RangeError("Empty event name");
  if (eventName.length > 1024) {
    throw RangeError("Event name " + eventName + " too long; " +
        eventName.length + " is above the 1024-character limit");
  }

  return eventName;
};

/**
 * Throws if the argument is not a valid key-value dictionary for the Heap API.
 *
 * @private
 * @param [Object<string,string|number>>] properties the key-value dictionary
 *   to be checked
 * @returns [Object<string,string|number>>] the normalized key-value
 *   dictionary, which will be passed to the Heap API
 * @throws [Error] if the key-value dictionary is not valid
 */
module.exports.normalizeProperties = function(properties) {
  if (typeof(properties) !== "object" || properties === null)
    throw TypeError("Invalid properties: " + properties);

  for (var name in properties) {
    if (name.length > 1024) {
      throw RangeError("Property name " + name + " too long; " + name.length +
          " is above the 1024-character limit");
    }
    var value = properties[name];

    if (typeof(value) === "string") {
      if (value.length > 1024) {
        throw RangeError("Property " + name + " value " + value +
            " too long; " + value.length +
            " is above the 1024-character limit");
      }
    } else if (typeof(value) !== "number") {
      throw TypeError("Unsupported type for property " + name + " value: " +
          value);
    }

  }
  return properties;
};
