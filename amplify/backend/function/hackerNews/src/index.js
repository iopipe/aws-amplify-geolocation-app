/*
Hacker News
*/
const geoip = require("geoip-lite")
const axios = require('axios')

const storyUrl = "https://hacker-news.firebaseio.com/v0/item/";
const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";

exports.handler = async function(event, context) {
  console.log(context);
  console.log(event);

  // Ignore doing IOpipe stuff if we're just using mock amplify
  var emptyEvent = true ? Object.keys(event).length == 0 : false
  if (emptyEvent || event.request.headers['origin'] !== 'http://localhost:3000') {
    var longitude, latitude
    var ipAddress = event.request.headers['x-forwarded-for'].split(',')[0]
    context.iopipe.label(ipAddress);
    console.log("IP addresss: " + ipAddress)

    var geo = geoip.lookup(ipAddress);
    [longitude, latitude] = geo.ll
    var city = geo.city
    var country = geo.country
    var region = geo.region

    // Must have IOpipe installed on these functions for this part to work
    // https://github.com/iopipe/iopipe-cli
    context.iopipe.metric("IP", ipAddress);
    context.iopipe.metric("longitude", longitude);
    context.iopipe.metric("latitude", latitude);
    context.iopipe.metric("city", city);
    context.iopipe.metric("region", region);
    context.iopipe.metric("country", country);
    context.iopipe.label(country)
  }

  const posts = [];
  console.log("GETTING DATA")
  try {
    const response = await axios.get(topStoriesUrl);
    // Get first 10 posts only
    const postIds = response.data.slice(0,10)
    console.log("POST_IDS: " + postIds)

    for (const [idx, postId] of postIds.entries()) {
      var post = await axios.get(storyUrl + postId + '.json');
      var postInfo = {
        id: post.data.id,
        title: post.data.title,
        url: post.data.url,
        by: post.data.by,
      }
      posts.push(postInfo)
      console.log(postInfo);
    }
    return posts
  } catch (err) {
    console.log(err);
  }

};
