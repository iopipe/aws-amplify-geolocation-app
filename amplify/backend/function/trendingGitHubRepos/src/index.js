/*
  GitHub Trending Repos
*/
const geoip = require("geoip-lite")
const axios = require('axios')
var faker = require('faker');

const trendingReposUrl = "https://github-trending-api.now.sh/repositories?language=&since=daily"

exports.handler = async function(event, context) { 
  console.log(context);
  console.log(event);

  // Ignore doing IOpipe stuff if we're just using mock amplify
  var emptyEvent = true ? Object.keys(event).length == 0 : false
  if (emptyEvent || event.request.headers['origin'] !== 'http://localhost:3000') {
    var longitude, latitude
    // var ipAddress = event.request.headers['x-forwarded-for'].split(',')[0]
    var ipAddress = faker.internet.ip()
    console.log("IP addresss: " + ipAddress)
    // context.iopipe.label(ipAddress)
    
    var geo = geoip.lookup(ipAddress);
    [longitude, latitude] = geo.ll
    var city = geo.city
    var country = geo.country
    var region = geo.region

    context.iopipe.metric("IP", ipAddress);
    context.iopipe.metric("longitude", longitude);
    context.iopipe.metric("latitude", latitude);
    context.iopipe.metric("city", city);
    context.iopipe.metric("region", region);
    context.iopipe.metric("country", country);
    context.iopipe.label(country)
  }

  // const repos = [];
  try {    
    const response = await axios.get(trendingReposUrl);
    // Get first 10 posts only
    const repos = response.data.slice(0,10)
    console.log(repos)

    return repos
  } catch (err) {
    console.log(err);
  }


};