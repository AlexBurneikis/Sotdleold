let Islands = [];

let answer;
let guessno;

function injectImage() {
  const elem = document.getElementById('imageframe');
  const image = new Image();
  image.src = answer.Image;
  elem.appendChild(image);
}

function setup() {
  answer = Islands[Math.floor(Math.random() * Islands.length)];
  guessno = 1;
  injectImage();
}

function loadIslands() {
  fetch('./islands.json').then((res) => {
    res.json().then((data) => {
      Islands = data;
      setup();
    });
  });
}

loadIslands();

function print(text, id) {
  document.getElementById(id).innerHTML = text;
}

function getIsland(x) {
  return Islands.find((i) => i.Name === x);
}

function isWin(x) {
  if (answer.Name === x) {
    return true;
  }
  return false;
}

function isSameRegion(x) {
  return answer.Region === x.Region;
}

function isSameX(x) {
  return answer.LocationX === x.LocationX;
}

function isNearMe(x) {
  return Math.abs((answer.LocationX.charCodeAt(0)) - (x.LocationX.charCodeAt(0))) <= 5;
}

function isSameY(x) {
  return answer.LocationY === x.LocationY;
}

function isNearY(x) {
  return Math.abs(answer.LocationY - x.LocationY) <= 5;
}

function direction(x) {
  let direction;

  if (answer.LocationY - x.LocationY < 0) {
    direction = 'N';

    if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) > 0) {
      direction += 'E';
    } else if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) < 0) {
      direction += 'W';
    }
  } else if (answer.LocationY - x.LocationY > 0) {
    direction = 'S';

    if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) > 0) {
      direction += 'E';
    } else if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) < 0) {
      direction += 'W';
    }
  }
  if (answer.LocationY === x.LocationY) {
    if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) > 0) {
      direction = 'E';
    } else if (answer.LocationX.charCodeAt(0) - x.LocationX.charCodeAt(0) < 0) {
      direction = 'W';
    }
  }

  return direction;
}

function main() {
  if (guessno <= 6) {
    const elem = document.getElementById('UserInput');
    const guessText = elem.value;
    elem.remove(elem.selectedIndex);

    let text = guessText;
    if (isWin(guessText)) {
      print(`${guessText} is Correct! It took you ${guessno} attempt(s).`, 'win');
      guessno += 6;
      return;
    }
    const guessIsland = getIsland(guessText);

    if (isSameRegion(guessIsland)) {
      text += ` - <span class='green'>${guessIsland.Region}</span>`;
    } else {
      text += ` - ${guessIsland.Region}`;
    }

    if (isSameX(guessIsland)) {
      text += ` - <span class='green'>${guessIsland.LocationX}</span>`;
    } else if (isNearMe(guessIsland)) {
      text += ` - <span class='yellow'>${guessIsland.LocationX}</span>`;
    } else {
      text += ` - ${guessIsland.LocationX}`;
    }

    if (isSameY(guessIsland)) {
      text += `<span class='green'>${guessIsland.LocationY}</span>`;
    } else if (isNearY(guessIsland)) {
      text += `<span class='yellow'>${guessIsland.LocationY}</span>`;
    } else {
      text += guessIsland.LocationY;
    }

    text += ` - ${direction(guessno)}`;

    print(text, `guess${guessno}`);

    guessno += 1;
  }
}
