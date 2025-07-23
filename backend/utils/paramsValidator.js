/**
 * Validates that required parameters exist in an object.
 *
 * @param {Object} params - The input object (e.g., req.body, req.params).
 * @param {string[]} requiredFields - Array of required field names.
 * @throws {Error} Throws if params are missing or required fields are not present.
 */
 const paramsValidator = (params, requiredFields = []) => {
    if (!params || typeof params !== 'object') {
        throw new Error('Invalid or missing parameters object.');
    }

    if (!Array.isArray(requiredFields)) {
        throw new Error('Validation fields must be an array of strings.');
    }

    if (requiredFields.length === 0) {
        throw new Error('Validation array is empty. Provide at least one field to validate.');
    }

    const missingFields = requiredFields.filter(field => {
        return params[field] === undefined || params[field] === null;
    });

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
};

module.exports = { paramsValidator }