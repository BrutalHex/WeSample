// This is just a simple sample code to show you the usage of the api
// Feel free to rewrite and improve or delete and start from scratch

(function () {
  let globalFilter = "All";
  let storiesList = [];
  let top = 0;

  function setFilter(filters) {
    globalFilter = filters;
    // times up!!
  }

  let loadMore = function () {
    storiesList.map((item, indi) => {
      if (indi >= top && indi < top + 10) renderStory(item);
    });
    top += 10;
  };
  document.getElementById("more").onclick = function () {
    loadMore();
  };

  function Init() {
    var parentItem = document.querySelector(".cards");

    parentItem.innerHTML = "";
    getStoriesListRequest.addEventListener("load", processList);
    getStoriesListRequest.open(
      "GET",
      "https://hacker-news.firebaseio.com/v0/topstories.json",
    );
    getStoriesListRequest.send();
  }

  function processStory(event) {
    let story = JSON.parse(event.currentTarget.response);

    let list = document.querySelector(".cards");

    let storyItem = generateElement(story);

    list.appendChild(storyItem);
  }

  function generateElement(info) {
    let elem = createElementWithChldren(
      "div",
      null,
      "card  col-12 col-sm-3 col-md-3 col-lg-3 m-sm-2 my-2",
      info,
      [
        {
          elemName: "div",
          text: info.type,
          cssClass: "card-header row text-white bg-danger",
          data: info,
          children: null,
        },
        {
          elemName: "div",
          text: null,
          cssClass: "card-body row",
          data: info,
          children: [
            {
              elemName: "p",
              text: info.title,
              cssClass: "card-text w-100",
              data: info,
              children: null,
            },
            {
              elemName: "a",
              text: "Open",
              cssClass: "btn btn-danger open-link",
              data: info,

              children: null,
            },
          ],
        },
        {
          elemName: "div",
          text: null,
          cssClass: "card-footer row",
          data: info,
          children: [
            {
              elemName: "div",
              text: `by : ${info.by} `,
              cssClass: "text-muted col-12 text-left col-sm-6",
              data: info,
              children: null,
            },
            {
              elemName: "div",
              text: `Date: ${convertUnixTime(info.time)}`,
              cssClass: "text-muted text-right col-12 col-sm-6 text-end",
              data: info,
              children: null,
            },
          ],
        },
      ],
    );

    return elem;
  }

  function createElementWithChldren(elemName, text, cssClass, data, children) {
    let item = document.createElement(elemName);
    item.setAttribute("class", cssClass);
    if (text != null) {
      item.innerText = text;
    }

    addExtraAttr(item, elemName, data);

    item.setAttribute("data-info", data);
    if (children != null) {
      children.map((chl) => {
        item.appendChild(
          createElementWithChldren(
            chl.elemName,
            chl.text,
            chl.cssClass,
            chl.data,
            chl.children,
          ),
        );
      });
    }

    return item;
  }

  function renderStory(storyId) {
    let getStory = new XMLHttpRequest();
    getStory.addEventListener("load", processStory);
    getStory.open(
      "GET",
      "https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json",
    );
    getStory.send();
  }

  function processList(event) {
    storiesList = JSON.parse(event.currentTarget.response);
    loadMore();
  }

  let getStoriesListRequest = new XMLHttpRequest();
  Init();
})();

function convertUnixTime(stamp) {
  dateObj = new Date(stamp * 1000);

  return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDay()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
}

function addExtraAttr(item, elemName, data) {
  //I can done it with OOP too but I need to make it in 4 hour
  switch (elemName) {
    case "a":
      configATag(item, elemName, data);
      break;

    default:
      return item;
  }
}

function configATag(item, elemName, data) {
  item.setAttribute("href", data.url);
}
