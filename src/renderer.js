const { ipcRenderer } = require('electron');

function Fetch(country) {
  fetch(`https://restcountries.com/v3.1/all`)
  .then((response) => response.json())
  .then((data) => {
    let output;
    let output2;
    let cname;
    let label;
    let lang;
    for (let i = 0; i < data.length; i++) {
      const cdata = data[i].name;
      const cdata2 = data[i];

      if (cdata2.name.common === country) {
        label = `
        <img src="${cdata2.flags.svg}" alt="${cdata2.flags.alt}" class="flag">
        <div class="country-name">${cdata.common}</div>
        <img src="${cdata2.coatOfArms.svg}" alt="Coat of Arms" class="coat-of-arms">
        `;
        comma = numberWithCommas(cdata2.area)
        output = `
        <div class="data">
          <p class="label">Area:</p>
          <p class="value">${comma} &#13218;</p>
        </div>
        <div class="data">
          <p class="label">Continents:</p>
          <p class="value">${cdata2.continents}</p>
        </div>
        <div class="data">
          <p class="label">Capital City:</p>
          <p class="value">${cdata2.capital}</p>
        </div>
        <div class="data">
          <p class="label">Region:</p>
          <p class="value">${cdata2.region}</p>
        </div>
        <div class="data">
          <p class="label">Subregion:</p>
          <p class="value">${cdata2.subregion}</p>
        </div>
        <div class="data">
          <p class="label">Languages:</p>
        `;
        output2 = '<p><b>Nearby Country:</b></p>'
        
        lang = Object.values(cdata2.languages)
        for (let l = 0; l < lang.length; l++) {
          output += `
          <p class="value">${lang[l]}</p>`;
        }

        comma = numberWithCommas(cdata2.population)

        map = `
        <div class="data">
          <p class="label">Google Maps:</p>
          <a href="${cdata2.maps.googleMaps}" class="value">Click Here</a>
        </div>
        <div class="data">
          <p class="label">Location:</p>
          <p class="value">Latitude: ${cdata2.latlng[0]}</p>
          <p class="value">Longitude: ${cdata2.latlng[1]}</p>
        </div>
        <div class="data">
          <p class="label">Population:</p>
          <p class="value">${comma}</p>
        </div>
        <div class="data">
          <p class="label">Timezones:</p>
        `;

        zone = Object.values(cdata2.timezones)
        for (let t = 0; t < zone.length; t++) {
          map += `
          <p class="value">${zone[t]}</p>`;
        }



        for (let b = 0; b < cdata2.borders.length; b++) {
          const cborder = cdata2.borders[b]
          for (let d = 0; d < data.length; d++) {
            const bcountry = data[d];
            if (cborder === bcountry.cca3) {
              output2 += `
              <div class="data2">
                <img src="${bcountry.flags.svg}" alt="${bcountry.flags.alt}" class="otherflag">
                <p class="flagname">${bcountry.name.common}</p>
              </div>
              `;
            } 
          }
        }
        cname = cdata.common;
      }
    }
    if (country !== cname) {
      output = `<p>No results for ${country}</p>`;
    }
    output += '</div>';
    map += '</div>';
    document.getElementById("title").innerHTML = label;
    document.getElementById("countryDetail").innerHTML = output;
    document.getElementById("map").innerHTML = map;
    document.getElementById("nearCountry").innerHTML = output2;
  })
}

function buttonClicked() {
  var country = document.getElementById("country").value;
  const words = country.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  country = words.join(" ");
  Fetch(country)
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const base = Fetch("Malaysia")

// Responds to "Enter" key
var input = document.getElementById("country");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});

// Create itinarery card
function toggleCard() {
  const card = document.getElementById("card");
  const overlay = document.getElementById("overlay");
  card.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeCard() {
  const card = document.getElementById("card");
  const overlay = document.getElementById("overlay");
  card.classList.remove("active");
  overlay.classList.remove("active");
}

document.addEventListener('DOMContentLoaded', () => {
  const commentInput = document.getElementById('commentInput');
  const addCommentButton = document.getElementById('addCommentButton');
  const commentsSection = document.getElementById('commentsSection');

  // Load and display comments
  async function loadComments() {
    const comments = await ipcRenderer.invoke('load-comments');
    displayComments(comments);
  }

  // Display comments in the DOM
  function displayComments(comments) {
    commentsSection.innerHTML = ''; // Clear current comments
    comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');

      const commentText = document.createElement('span');
      commentText.classList.add('comment-text');
      commentText.textContent = comment.text;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteComment(comment.id);

      commentDiv.appendChild(commentText);
      commentDiv.appendChild(deleteButton);
      commentsSection.appendChild(commentDiv);
    });
  }

  // Add a new comment
  addCommentButton.onclick = async () => {
    const commentText = commentInput.value;
    if (commentText.trim()) {
      const comments = await ipcRenderer.invoke('add-comment', commentText);
      displayComments(comments);
      commentInput.value = ''; // Clear input field
    }
  };

  // Delete a comment
  async function deleteComment(commentId) {
    const comments = await ipcRenderer.invoke('delete-comment', commentId);
    displayComments(comments);
  }

  // Initial load
  loadComments();
});