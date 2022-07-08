const request = require('request-promise-native');



const fetchMyIP = function () {
  return	request("https://api.ipify.org?format=json");
};





const fetchCoordsByIP = function(body) {
  let coordsLink = "http://ipwho.is/" + JSON.parse(body).ip;
	return request(coordsLink) 
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const link = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(link) 
};



const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };