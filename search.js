// Playlist contians the search result for further operations
// Playlist contians video in form of Video class implemented below
// Playlist contians every function required for desired operations

class Playlist{

  constructor(){
    this.videos = [];
    this.resultTag = document.getElementById('resultBody');
  }

  addVideo(videoDetails) {

    var snippet = videoDetails.snippet;
    var new_video = new Video(videoDetails.id.videoId,snippet.title,snippet.channelTitle,snippet.publishedAt,snippet.description,snippet.thumbnails.high);
    this.videos.push(new_video);

  }

  // sorts based on param
  sortBy(list,sort){

    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list.length-i-1; j++) {
        var res;
        switch (sort) {
          case 'name':
            res = list[j].title > list[j+1].title;
            break;
          case 'namedesc':
            res = list[j].title < list[j+1].title;
            break;
          case 'date':
            res = new Date(list[j].published) < new Date(list[j+1].published);
            break;
          case 'datedesc':
            res = new Date(list[j].published) > new Date(list[j+1].published);
            break;
        }
        if (res) {
          var temp = list[j+1];
          list[j+1] = list[j];
          list[j] = temp;
        }
      }
    }
    return list;

  }

  // sends the data to search.html, fills up the div#resultBody
  display(sort = '',desc){
    this.resultTag.innerHTML = '';
    var nodes = [];
    var list;
    if (sort != '') {
        if(desc){
          sort += "desc";
        }
        list = this.sortBy(this.videos,sort);
    } else{
      list = this.videos;
    }

    // creation of node for each video
    for(var node = 0; node < list.length; node++){
      var video = list[node];
      var videoEle = document.createElement('div');
      videoEle.setAttribute('id',video.id);
      videoEle.setAttribute('class','videoBox');
      var videoThum = document.createElement('img');
      videoThum.setAttribute('src',video.thumbnails.url);
      videoEle.appendChild(videoThum);
      var videoDescBox = document.createElement('div');
      videoDescBox.setAttribute('class','videoDescBox');
      var videoTitle = document.createElement('div');
      videoTitle.setAttribute('class','videoTitle');
      videoTitle.innerHTML = video.title
      var videoDesc = document.createElement('div');
      videoDesc.setAttribute('class','videoDesc');
      videoDesc.innerHTML = video.channel.slice(0,20);;
      var videoDate = document.createElement('div');
      videoDate.setAttribute('class','videoDate');
      var tempDate = new Date(new Date() - new Date(video.published));
      videoDate.innerHTML = (tempDate.toISOString().slice(0, 4) - 1970) + "Years " + (tempDate.getMonth()+1) + "Months " + tempDate.getDate() + "Days";
      videoDescBox.appendChild(videoTitle);
      videoDescBox.appendChild(videoDesc);
      videoDescBox.appendChild(videoDate);
      videoEle.appendChild(videoDescBox);
      this.resultTag.appendChild(videoEle);
    }
  }

}


// Video class: sample of each video element present in above class i.e. Playlist
// video class contians saves only desired attributes, attributes can be scaled as required
class Video {

  constructor(id,title,channel,published,description,thumbnails,) {
    this.id = id;
    this.title = title;
    this.channel = channel;
    this.published = published;
    this.description = description;
    this.thumbnails = thumbnails;
  }

}

var currentList;

function search(pageToken=null) {

  currentList = new Playlist();
  var maxResults = document.getElementById('maxResults'); // no of results desired on page
  var searchTag = document.getElementById('searchTag'); // keyword of search
  var request = gapi.client.youtube.search.list({
    q: searchTag.value,
    part: 'snippet',
    maxResults: maxResults.value,
    pageToken: pageToken
  });

  // saves search result into a Playlist:object
  request.execute(function(response) {
    document.getElementById('nextBtn').setAttribute('data-id',response.nextPageToken);
    if(response.prevPageToken){
      document.getElementById('prevBtn').setAttribute('data-id',response.prevPageToken);
    }
    (response.result.items).forEach(function(videoDetails){
      currentList.addVideo(videoDetails);
    });
    currentList.display();
    response = null;
  });
}

function sort(){
  var sort = document.getElementById('sortBy'); // type of sort i.e by name or publish date
  var desc = document.getElementById('desc').checked; // desc/asc sort || true in case of desc
  currentList.display(sort.value,desc);
}
