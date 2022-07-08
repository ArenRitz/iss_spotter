const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });


// fetchCoordsByIP((error, location) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('Location, Location, Location:' , location);
// });
// const exampleCoords = { latitude: 43.653226, longitude: -79.3831843 };

// fetchISSFlyOverTimes(exampleCoords, (error, timeStamps) => {

//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('Timestamps: ' , timeStamps);

// })

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  printPassTimes(passTimes);



  
});