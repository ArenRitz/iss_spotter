const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = function (callback) {

	request("https://api.ipify.org?format=json", function (error, response, body) {
		if (error) {
			callback(error, null);
			return;
		}
		// if non-200 status, assume server error
		if (response.statusCode !== 200) {
			const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
			callback(Error(msg), null);
			return;
		}
		let ip = JSON.parse(body).ip;
		
		callback(error, ip);
    

	});
};

let location = {};

const fetchCoordsByIP = function(ip, callback) {
  let coordsLink = "http://ipwho.is/";
  coordsLink += ip;


	request(coordsLink, function (error, response, body) {
		let data = JSON.parse(body);

    
		if (error) {
			callback(error, null);
			return;
		}
		// if non-200 status, assume server error
		if (response.statusCode !== 200) {
			const msg = `Status Code ${response.statusCode} when fetching location. Response: ${body}`;
			callback(Error(msg), null);
			return;
		}

		if (!data.success) {
			const msg = `IP: ${data["ip"]} is Invalid`;
			callback(Error(msg), null);
			return;
		} 
    
    const { latitude, longitude } = data;
    callback(null, {latitude, longitude});
		// location["latitude"] = data.latitude;
		// location["longitude"] = data.longitude;

		// callback(error, location);


	});
};


/**
  https://iss-pass.herokuapp.com/json/?lat=YOUR_LAT_INPUT_HERE&lon=YOUR_LON_INPUT_HERE

* Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
 const fetchISSFlyOverTimes = function(coords, callback) {
  const link = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  // const link = `https://iss-pass.herokuapp.com/json/?lat=$asd}&lon=${coords.longitude}`;
  request(link, function (error, response, body) {

		let data = JSON.parse(body);

		if (error) {
			callback(error, null);
			return;
		}
		// if non-200 status, assume server error
		if (response.statusCode !== 200) {
			const msg = `Status Code ${response.statusCode} when fetching location. Response: ${body}`;
			callback(Error(msg), null);
			return;
		}

    const events = data.response;
    callback(error, events)




	});


};




/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(location, (error, events) => {
        if (error) {
          return callback(error, null);
        }

        callback(error, events);

      });
    });
  });
  
}



module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };