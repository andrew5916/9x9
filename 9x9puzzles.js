function checkLoginStatus() {
  const username = localStorage.getItem('username');

  if (username) {
    console.log("Logged in.");
  } else {
    console.log("Not logged in.");
    // window.location.href = "login.html"; 
  }
}

function signOut() {
  localStorage.removeItem('username');
  localStorage.removeItem('animal');
  localStorage.removeItem('animal_image');
  window.location.href = 'index';
}

// Define a function to fetch and inject the navbar
function loadNavbar() {
  return new Promise((resolve, reject) => {
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        resolve(); // Resolve the promise once the navbar content is set
      })
      .catch(error => {
        reject(error); // Reject the promise if there's an error
      });
  });
}

function loadFooter() {
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });
}

// Global variable of tag descriptions
let tagDescriptions = "";


const hardcodedDescriptions = {
  sudoku: "<b>Standard sudoku</b> rules apply: The digits 1 through 9 appear in every row, column, and box.",
  thermo: "<b>Thermometer</b> constraint: Thermometers are strictly increasing from bulb to tip.",
  sandwich: "<b>Sandwich sum</b> constraint: Numbers outside the grid indicate the sum of the digits between 1 and 9 in that row or column.",
  arrow: "<b>Arrow</b> constraint: Digits along an arrow must sum to the number indicated in the circle from which the arrow emerges.",
  kropki_ratio: "<b>Kropki ratio</b> constraint: Cells separated by a black dot are in a 2:1 ratio.",
  kropki_diff: "<b>Kropki difference</b> constraint: Digits separated by a white dot differ by the amount shown in the dot. If no value is given in the dot, the digits differ by 1 (they are consecutive).",
  antiking: "<b>Anti-king</b> constraint: Cells that are a chess king's move apart cannot contain the same digit.",
  antiknight: "<b>Anti-knight</b> constraint: Cells that are a chess knight’s move apart cannot contain the same digit.",
  disjoint: "<b>Disjoint Group</b> constraint: Each position in the 3x3 boxes contains a full set of the digits 1 to 9. In other words, no digit can show up in the same position in two different 3x3 boxes.",
  killer_cage: "<b>Killer Cage</b> constraint: Digits add to the total in the top left corner of the cage, if the sum is given. Digits cannot repeat in cages.",
  little_killer: "<b>Little Killer</b> constraint: The numbered arrows outside the grid indicate the sum of the digits in the corresponding direction. Digits can repeat in the direction of the arrow.",
  V5: "<b>V</b> constraint: Cells connected by a V must sum to five.",
  X10: "<b>X</b> constraint: Cells connected by a X must sum to ten.",
  Xsum: "<b>X-Sums</b> constraint: Each number outside the grid is the sum of the first X numbers placed in the corresponding direction, where X is equal to the first number placed in that direction.",
  renban: "<b>Renban line</b> constraint: Usually shown as purple lines, digits along a Renban line must form a set of non-repeating consecutive digits in any order.",
  german_whisper: "<b>German Whispers</b> constraint: Usually shown as green lines, adjacent digits along a German Whispers line must differ by at least five.",
  quadruple: "<b>Quadruple</b> constraint: The digits in the large circles must appear in the four surrounding cells.",
  palindrome: "<b>Palindrome</b> constraint: Usually shown as gray lines, digits along a Palindrome line read the same forwards as backward along the line.",
  lockout: "<b>Lockout lines</b> constraint: Digits in the diamonds at the ends of a Lockout line must differ by at least 4. Digits on the line may repeat but cannot be equal to or between the digits in the diamonds.",
  modular: "<b>Modular lines</b> constraint: No three digits along the line are from the same residue class modulo 3, i.e., all from {1,4,7} or all from {2,5,8} or all from {3,6,9}.",
  unimodular: "<b>Unimodular lines</b> constraint: Every digit along the line is from the same residue class modulo 3, i.e., all from {1,4,7} or all from {2,5,8} or all from {3,6,9}.",
  fortress: "<b>Fortress cells</b>: Shaded cells are fortress cells and must be larger than any orthogonally adjacent unshaded cell.",
  skyscraper: "<b>Skyscraper</b> constraint: Consider cells to be ‘skyscrapers’ whose height is the digit in that cell. Taller skyscrapers obscure the view of smaller ones. Clues outside the grid tell how many skyscrapers are visible looking across the row or column from the direction of the clue.",
  fog: "<b>Fog</b>: Part of the grid is covered with fog. As correct digits are placed, the fog will clear from cells surrounding the correct digit, revealing additional clues. There is always enough information in the revealed portion of the grid to place another correct digit. Digits can be placed within the fog.",
  entropic: "<b>Entropic line</b> constraint: Along an Entropic line, any set of three sequential cells must contain a low digit (123), a middle digit (456), and a high digit (789).",
  isotropic: "<b>Isotropic line</b> constraint: Along an Isotropic line, all cells are from the same entropic rank: low (123), middle (456), or high (789).",
  min_max: "<b>Minimum/maximum cell</b> constraint: Digits placed in blue cells with arrows pointing in must be smaller than all orthogonally adjacent cells. Digits placed in yellow cells with arrows pointing out must be larger than all orthogonally adjacent cells.",
  barbie: "This puzzle was set pseudonymously as part of BremSter's BarbieSudoku Series which you can view here: https://www.youtube.com/playlist?list=PLalMex23KlAP1VSl_lgjO62R5dNxx61E_",
  hamilton: "This puzzle was set pseudonymously as part of BremSter's Hamilton Sudoku Series which you can view here: https://www.youtube.com/playlist?list=PLalMex23KlAPne56PpyBxLBtcx-AkDRyu",
};

// Asynchronous function to fetch JSON data from puzzles.json
async function fetchPuzzlesData() {
  try {
    // Ensure fetchTagDescriptions is called and completed before continuing
    // This loads the set of rule constraints which are used in GeneratePuzzleDiv
    tagDescriptions = await fetchTagDescriptions();

    const response = await fetch('php/fetch_puzzles.php');
    if (!response.ok) {
      throw new Error('Error accessing fetch_puzzles.php');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

// Asynchronous function to fetch JSON data from puzzles.json
async function fetchDucklingPuzzlesData() {
  try {
    // Ensure fetchTagDescriptions is called and completed before continuing
    // This loads the set of rule constraints which are used in GeneratePuzzleDiv
    tagDescriptions = await fetchTagDescriptions();

    const response = await fetch('php/fetch_duckling_puzzles.php');
    if (!response.ok) {
      throw new Error('Error accessing fetch_duckling_puzzles.php');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}


// Asynchronous function to fetch JSON data from puzzles.json
async function fetchCompletePuzzlesData() {
  try {
    // Ensure fetchTagDescriptions is called and completed before continuing
    // This loads the set of rule constraints which are used in GeneratePuzzleDiv
    tagDescriptions = await fetchTagDescriptions();

    const response = await fetch('php/fetch_complete_puzzles.php');
    if (!response.ok) {
      throw new Error('Error accessing fetch_complete_puzzles.php');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

// Function to check if a tag is present in the space-delimited string
function containsTag(tagString, targetTag) {
  // Split the tagString into an array of individual tags
  var tagsArray = tagString.split(' ');

  // Check if the targetTag is in the array
  return tagsArray.includes(targetTag);
}


// Function to fetch puzzle contraints from the database
async function fetchTagDescriptions() {
  //console.log('entering fetchTagDescriptions()');
  try {
    const response = await fetch('php/fetch_tag_descriptions.php');
    if (!response.ok) {
      // If the response is not okay, reject the promise with an error
      throw new Error('Error accessing fetch_tag_descriptions.php');
    }
    //console.log('using fetched tag descriptions');
    return await response.json();
  } catch (error) {
    // If there's an error during fetch, log it and resolve the promise with hardcodedDescriptions
    console.error('Error fetching tag descriptions:', error);
    console.log('using hardcoded tag descriptions');
    return hardcodedDescriptions;
  }
}

function generatePuzzleImageColumn(data) {
  var htmlStr = '<div class="col-lg-5 col-md-6 col-sm-12 text-center">';
  htmlStr += '<a href="' + data.url + '" target="_blank" rel="noopener noreferrer">';
  htmlStr += '<img src="' + data.image + '" alt="' + data.title + '" width="350" height="350">';
  htmlStr += '</a>';
  htmlStr += '</div>';
  return htmlStr;
}

function generatePuzzleTitleAndDescriptionColumnForPacks(data, completedPuzzles) {
  const isCompleted = completedPuzzles.includes(data.id);
  const completedText = isCompleted ? '<span style="color: green;">Completed</span>' : '<span style="color: red;">Incomplete</span>';

  var htmlStr = '<div class="col-lg-7 col-md-6 col-sm-12">';
  htmlStr += `<h3>${data.title}</h3>`;
  htmlStr += '<br>';

  htmlStr += `<button id="puzzle-button-${data.id}" onclick="UpdateUserPuzzleStatus(${data.id})" style="border-radius: 6px;">${isCompleted ? 'Mark as incomplete' : 'Mark as complete'}</button>`;
  htmlStr += `<h4 id="puzzle-status-${data.id}">${completedText}</h4>`;

  htmlStr += '<i>' + data.classification + '</i>';
  htmlStr += '<br>';
  htmlStr += '<p>' + data.description + '</p>';
  htmlStr += '<p><em>Rules</em></p>';
  htmlStr += '<p>' + data.rules + '</p>';

  // Use fetched tagDescriptions to dynamically add tag descriptions
  // make sure the sudoku tag is listed first if it is present
  const tagsArray = data.tags.split(' ');
  const sudokuIndex = tagsArray.indexOf('sudoku');
  //console.log ("tags: " + tagsArray + " index: " + sudokuIndex)
  if (sudokuIndex !== -1) {
    const sudokuDesc = tagDescriptions['sudoku'];
    if (sudokuDesc) {
      htmlStr += '<p>' + sudokuDesc + '</p>';
    }
    // Remove 'sudoku' from the array to avoid adding it again
    tagsArray.splice(sudokuIndex, 1);
  }

  tagsArray.forEach(tag => {
    const tagDesc = tagDescriptions[tag];
    if (tagDesc) {
      htmlStr += '<p>' + tagDesc + '</p>';
    }
  });

  htmlStr += '</div>';  // end column

  return htmlStr;
}


function generatePuzzleTitleAndDescriptionColumn(data) {
  var htmlStr = '<div class="col-lg-7 col-md-6 col-sm-12">';
  htmlStr += `<h3>${data.title}</h3>`;
  htmlStr += '<i>' + data.classification + '</i>';
  htmlStr += '<br>';
  htmlStr += '<p>' + data.description + '</p>';
  htmlStr += '<p><em>Rules</em></p>';
  htmlStr += '<p>' + data.rules + '</p>';

  // Use fetched tagDescriptions to dynamically add tag descriptions
  // make sure the sudoku tag is listed first if it is present
  const tagsArray = data.tags.split(' ');
  const sudokuIndex = tagsArray.indexOf('sudoku');
  //console.log ("tags: " + tagsArray + " index: " + sudokuIndex)
  if (sudokuIndex !== -1) {
    const sudokuDesc = tagDescriptions['sudoku'];
    if (sudokuDesc) {
      htmlStr += '<p>' + sudokuDesc + '</p>';
    }
    // Remove 'sudoku' from the array to avoid adding it again
    tagsArray.splice(sudokuIndex, 1);
  }

  tagsArray.forEach(tag => {
    const tagDesc = tagDescriptions[tag];
    if (tagDesc) {
      htmlStr += '<p>' + tagDesc + '</p>';
    }
  });

  htmlStr += '</div>';  // end column

  return htmlStr;
}

// Extracts a YouTube video ID from YouTube link
function getVideoIdFromLink(ytLink) {
  const url = new URL(ytLink);

  // Check for the shortened 'youtu.be' format
  if (url.hostname === 'youtu.be') {
    const pathParts = url.pathname.split('/');
    const potentialVideoId = pathParts.pop();
    if (potentialVideoId && /^[a-zA-Z0-9_-]{11}$/.test(potentialVideoId)) {
      return potentialVideoId;
    }
  }

  // Check for common query parameter names used by YouTube
  const potentialParams = ['v', 'video_id', 'vi', 'vID', 'wvideo'];
  for (const param of potentialParams) {
    if (url.searchParams.has(param)) {
      return url.searchParams.get(param);
    }
  }

  // If all else fails, return null
  return null;
}

// generate a single row of HTML to display a puzzle
// Depends on the global variable tagDescriptions 
function generatePuzzleDiv(data) {
  var htmlStr = '<div class="row">';
  htmlStr += generatePuzzleImageColumn(data);
  htmlStr += generatePuzzleTitleAndDescriptionColumn(data);
  htmlStr += '</div>';  // end row
  return htmlStr;
}

function generatePuzzleDivAlternating(data, index) {
  var htmlStr = '<div class="row">';
  if (index % 2 === 0) {
    htmlStr += generatePuzzleImageColumn(data);
    htmlStr += generatePuzzleTitleAndDescriptionColumn(data);
  }
  else {
    // reverse the order and put the image on the right
    htmlStr += generatePuzzleTitleAndDescriptionColumn(data);
    htmlStr += generatePuzzleImageColumn(data);
  }
  htmlStr += '</div>';  // end row
  return htmlStr;
}

function generatePuzzleDivAlternatingForPacks(data, index, completedPuzzles) {
  var htmlStr = '<div class="row puzzle" data-puzzle-id="' + data.id + '">';

  if (index % 2 === 0) {
    htmlStr += generatePuzzleImageColumn(data);
    htmlStr += generatePuzzleTitleAndDescriptionColumnForPacks(data, completedPuzzles);
  }
  else {
    // reverse the order and put the image on the right
    htmlStr += generatePuzzleTitleAndDescriptionColumnForPacks(data, completedPuzzles);
    htmlStr += generatePuzzleImageColumn(data);
  }
  htmlStr += '</div>';  // end row
  return htmlStr;
}


// return a list of youtube videoIds one for each video feature
function getVideoIdsFromPuzzleData(data) {
  return data.map(puzzle => getVideoIdFromLink(puzzle.yt_link));
}

// Function to fetch thumbnails for a batch of video IDs
function fetchThumbnailsBatch(videoIds) {
  return new Promise((resolve, reject) => {
    fetch(`php/youtube_thumbnails.php?videoIds=${videoIds.join(',')}`)
      .then(response => response.json())
      .then(data => {
        //console.log('data.thumbnails==', data.thumbnails);
        resolve(data.thumbnails);
      })
      .catch(error => {
        console.error('Error fetching thumbnails:', error);
        reject(error);
      });
  });
}

// Function to fetch view counts for a batch of video IDs
function fetchViewCountsBatch(videoIds) {
  return new Promise((resolve, reject) => {
    fetch(`php/youtube_viewcounts.php?videoIds=${videoIds.join(',')}`)
      .then(response => response.json())
      .then(data => {
        resolve(data.viewCounts);
      })
      .catch(error => {
        console.error('Error fetching view counts:', error);
        reject(error);
      });
  });
}
