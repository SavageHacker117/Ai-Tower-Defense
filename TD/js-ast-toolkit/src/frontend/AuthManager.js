/**
 * AuthManager.js
 * Handles user authentication, session management, and communication with the backend API.
 */

const API_URL = 'http://127.0.0.1:5000/api'; // Your Flask server URL

export class AuthManager {
  constructor() {
    console.log("Calling method: constructor");
    this.currentUser = null;
    this.sessionToken = null;
    this.isLoggedIn = false;

    // Initialize from localStorage if available
    this.loadSession();
  }

  /**
   * Register a new user by sending a request to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Registration result
   */
  async register(username, password) {
    console.log("Calling method: register");
    try {
      // Validate input locally before sending to server
      if (!this.validateUsername(username)) {
        throw new Error('Invalid username. Must be 3-20 characters, alphanumeric only.');
      }
      if (!this.validatePassword(password)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number.');
      }
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed due to a server error.');
      }
      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Login user by sending credentials to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Login result
   */
  async login(username, password) {
    console.log("Calling method: login");
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Login failed due to a server error.');
      }
      if (!result.token) {
        throw new Error('Login successful, but no token was received from the server.');
      }

      // Set session from received token
      this.sessionToken = result.token;
      this.isLoggedIn = true;

      // In a real app, you would decode the JWT to get user details.
      // For now, we'll just store the username.
      this.currentUser = {
        username: username
      };
      this.saveSession();
      return {
        success: true,
        message: 'Login successful'
      };
    } catch (error) {
      console.error("Login error:", error);
      this.logout(); // Ensure clean state on login failure
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Logout current user.
   */
  logout() {
    console.log("Calling method: logout");
    this.currentUser = null;
    this.sessionToken = null;
    this.isLoggedIn = false;

    // Clear session from storage
    localStorage.removeItem('currentSession');
    localStorage.removeItem('sessionToken');
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  /**
   * Get current user data.
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    console.log("Calling method: getCurrentUser");
    return this.currentUser;
  }

  /**
   * Gets the current session token (JWT).
   * @returns {string|null} The session token.
   */
  getToken() {
    console.log("Calling method: getToken");
    return this.sessionToken;
  }

  /**
   * Save current session to localStorage.
   */
  saveSession() {
    console.log("Calling method: saveSession");
    if (this.isLoggedIn && this.currentUser) {
      localStorage.setItem('currentSession', JSON.stringify(this.currentUser));
      localStorage.setItem('sessionToken', this.sessionToken);
    }
  }

  /**
   * Load session from localStorage.
   */
  loadSession() {
    console.log("Calling method: loadSession");
    try {
      const sessionData = localStorage.getItem('currentSession');
      const token = localStorage.getItem('sessionToken');
      if (sessionData && token) {
        this.currentUser = JSON.parse(sessionData);
        this.sessionToken = token;
        this.isLoggedIn = true;
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.logout();
    }
  }

  // --- Local Validation Helpers ---
  validateUsername(username) {
    console.log("Calling method: validateUsername");
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
  }
  validateEmail(email) {
    console.log("Calling method: validateEmail");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validatePassword(password) {
    console.log("Calling method: validatePassword");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}