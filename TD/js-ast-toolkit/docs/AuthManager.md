# Class `AuthManager`

## `constructor()`

## `register(username, password)`

*
   * Register a new user by sending a request to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Registration result

## `login(username, password)`

*
   * Login user by sending credentials to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Login result

## `logout()`

*
   * Logout current user.

## `getCurrentUser()`

*
   * Get current user data.
   * @returns {Object|null} Current user data

## `getToken()`

*
   * Gets the current session token (JWT).
   * @returns {string|null} The session token.

## `saveSession()`

*
   * Save current session to localStorage.

## `loadSession()`

*
   * Load session from localStorage.

## `validateUsername(username)`

--- Local Validation Helpers ---

## `validateEmail(email)`

## `validatePassword(password)`