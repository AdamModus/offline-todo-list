'use strict';

class NetworkConnectivityService {

  /**
   * Returns true in case of online, false otherwise.
   *
   * @returns {string}
   */
  getCurrentConnectivity() {
    let currentConnectivity = '';
    if (navigator.onLine === true){
      currentConnectivity = 'online';
    } else {
      currentConnectivity = 'offline';
    }
    return currentConnectivity;
  }

  /**
   * Function to register a callback when the connectivity state of the browser changes.
   *
   * @param callback
   */
  onConnectivityChange(callback) {
    if (typeof callback === 'function'){
      window.ononline = function(event) {
        callback('online', event);
      };
      window.onoffline = function(event) {
        callback('offline', event);
      };
    }
  }
}
