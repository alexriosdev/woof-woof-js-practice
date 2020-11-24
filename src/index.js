const DOGS_URL = 'http://localhost:3000/pups';

document.addEventListener('DOMContentLoaded', () => {
  getDogsFetch();
  toggleButton();
});

const getDogsFetch = () => {
  const dogParent = document.querySelector('#dog-bar');
  clearAllChildNodes(dogParent);
  fetch(DOGS_URL)
    .then( (response) => response.json() )
    // .then( (dogs) => console.log(dogs) );
    .then( (dogs) => {      
      dogs.forEach(dog => renderDogSpan(dog))
    });
}

const renderDogSpan = (dog) => {
  const dogNode = document.createElement('span');
  dogNode.innerText = dog.name;

  dogNode.addEventListener('click', () =>{
    renderDogInfo(dog);
  })

  const dogParent = document.querySelector('#dog-bar')
  dogParent.appendChild(dogNode);
}

const renderDogInfo = (dog) => {
  const imgNode = document.createElement('img');
  imgNode.src = dog.image;
  
  const nameNode = document.createElement('h1');
  nameNode.innerText = dog.name;
  
  const statusNode = document.createElement('button');
  buttonStatus(statusNode, dog);

  statusNode.addEventListener('click', (event) => {
    buttonStatusClick(event, dog);
  })
  
  const infoParent = document.querySelector('#dog-info')
  clearAllChildNodes(infoParent);

  infoParent.appendChild(imgNode);
  infoParent.appendChild(nameNode);
  infoParent.appendChild(statusNode);
}

const clearAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

const buttonStatus = (button, dog) => {
  if (dog.isGoodDog) {
    button.innerText = 'Good Dog!';
  } else {
    button.innerText = 'Bad Dog!';
  }
}

const buttonStatusClick = (event, dog) => {
  dog.isGoodDog = !dog.isGoodDog;
  // console.log('Your dog has switched sides!')
  buttonStatus(event.target, dog);
  updateStatusFetch(dog);
}

const toggleButton = () => {
  const toggleBtn = document.querySelector('#good-dog-filter');
  toggleBtn.addEventListener('click', (event) => {
      toggleStatus(event);
  })
}

let clicked = false;
const toggleStatus = (event) => {
  clicked = !clicked;
  if (clicked) {
    toggleStatusFetch();
    event.target.innerText = 'Filter good dogs: ON';
  } else {
    getDogsFetch();
    event.target.innerText = 'Filter good dogs: OFF';
  }
}

// FILTER DURING THE FETCH!
const toggleStatusFetch = () => {
  const dogParent = document.querySelector('#dog-bar');
  clearAllChildNodes(dogParent);

  fetch(DOGS_URL)
    .then( (response) => response.json() )
    .then( (dogs) =>  goodDogsFilter(dogs) );
}

const goodDogsFilter = (dogs) => {
  const goodDogs = dogs.filter(dog => { return dog.isGoodDog === true });
  goodDogs.forEach(dog => renderDogSpan(dog));
}

// Update Good Boy Status
const updateStatusFetch = (dog) => {
  const data = { isGoodDog: dog.isGoodDog }
  // const data = { test: 'Your dog has switched sides!' }

  const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Accept' : 'application/json'
		},
		body: JSON.stringify(data)
	}

	fetch(`${DOGS_URL}/${dog.id}`, options)
		.then( (response) => response.json() )
		.then( (dog) => renderDogInfo(dog) );
}
