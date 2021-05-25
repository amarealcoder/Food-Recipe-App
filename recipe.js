//global variables 
const vegetables = [
  'carrot', 'broccoli', 'asparagus', 'cauliflower', 'corn',
  'cucumber', 'green pepper', 'lettuce', 'mushrooms', 'onion', 'potato', 'pumpkin',
  'red pepper', 'tomato', 'beetroot', 'brussel sprouts', 'peas',
  'zucchini', 'radish', 'sweet potato', 'artichoke', 'leek', 'cabbage', 'celery',
];

const spicesRecipe = [
  'chili', 'garlic', 'basil', 'coriander', 'parsley', 'dill',
  'rosemary', 'oregano', 'cinnamon', 'saffron', 'curry',
];

const peasRecipe = ['green bean', 'bean', 'chickpea', 'lentil'];

const fruitsRecipe = [
  'apple', 'apricot', 'avocado', 'banana', 'blackberry',
  'blackcurrant', 'blueberry', 'boysenberry',
  'cherry', 'coconut', 'fig', 'grape', 'grapefruit', 'kiwifruit', 'lemon', 'lime',
  'lychee', 'mandarin', 'mango', 'melon',
  'nectarine', 'orange', 'papaya', 'passion fruit', 'peach', 'pear', 'pineapple',
  'plum', 'pomegranate', 'quince', 'raspberry', 'strawberry', 'watermelon',
];

const confectioneries = ['pudding', 'donuts', 'hamburger', 'pie', 'cake', 'chips', 'pizza', 'popcorn'];

const dessertRecipe = [
  'lasagna', 'poke', 'chocolate', 'croissant', 'arepas',
  'bunny chow', 'pierogi', 'rendang', 'ice cream',
];

const meals = [
  'bbq', 'sausage', 'tacos', 'kebab', 'poutine', 'fries', 'masala', 'paella',
  'som tam', 'toast', 'marzipan', 'tofu', 'ketchup', 'hummus', 'chili', 'maple syrup',
  'parma ham', 'fajitas', 'champ', 'salad', 'pasta',
];

const protein = [
  'sushi', 'pepperoni', 'duck', 'salami', 'beef', 'goat', 'lamb', 'bacon', 'chicken',
  'turkey', 'pork', 'fish', 'crab', 'ham', 'ribs', 'lobster', 'steak', 'seafood',
];

const recipeArray = [
  ...vegetables, ...spicesRecipe, ...confectioneries,
  ...protein, ...meals, ...dessertRecipe, ...peasRecipe, ...fruitsRecipe,
];

const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-results');
const ulDiv = document.querySelector('.results');
const recipeDiv = document.querySelector('.recipe');
const loaderDiv = document.querySelector('.loaderDiv')
const loaderDiv2 = document.querySelector('.loaderDiv2');
const pageDiv = document.querySelector('.pagination');

//selected ids for the random recipes
const recipeArr = ["49749", "36453", "1456", "224b14", "8cede5", "7a41bf", "10716", "7def59", "9822d9", "fd9bc4", "a6d6e1", "54364", "3b6458", "35128", "30697", "35499",  "54279",  "13637", "10716"];

//immediately invoked function to display the random recipes
(function (){
  const randomRecipeId = recipeArr[Math.floor(Math.random() * recipeArr.length)];
 
 //fetch the recipe ids
  const getRandomRecipe = async (randomRecipeId) => {
    const randomResponse = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${randomRecipeId}`);
    const randomData = await randomResponse.json();
    // console.log(randomData);
    return randomData;
  }
  
  //iterate through the ids object and add the styles to them
  getRandomRecipe(randomRecipeId).then(item => {
  for(const key in item) {
     const recipe = styleRandomRecipes(item[key]);
  }
  });
  
  //style for the dynamically generated html elements for the random recipes
  const styleRandomRecipes = (randomRecipeId) => {
    let randomTitle = document.createElement('h1');
    randomTitle.innerHTML = `Here is your random recipe for the moment, want to try it out? Just search!`;
    let figure = document.createElement('figure');
    figure.classList.add('recipe__fig');
    const figureImage = document.createElement('img');
    figureImage.classList.add('recipe__img');
    figureImage.setAttribute('alt', `${randomRecipeId.title}`);
    figureImage.src = `${randomRecipeId.image_url}`;
    const figureTitle = document.createElement('h1');
    figureTitle.classList.add('recipe__title');
    let figureSpan = document.createElement('span');
    figureSpan.textContent = `${randomRecipeId.title}`;
    figureTitle.append(figureSpan);
    figure.append(randomTitle);
    figure.append(figureImage);
    figure.append(figureTitle);
    recipeDiv.append(figure);
  } 
})();

 //get the search input value
const getInput = (e) => {
  e.preventDefault();
  const value = searchForm.querySelector("input").value;
  fetchData(value);

  const clearSearch = () =>{
    searchForm.querySelector("input").value = '';
  }
  clearSearch();
}


 //fetch the search input endpoint
const fetchData = async (search) => {
  //validate the search input
  if (!recipeArray.includes(search)){
    ulDiv.innerHTML = `
    <div class="alert-div">
      <div>
        <svg class="icon-alert-triangle">
          <use xlink:href="alert.svg#icon-alert-triangle"></use>
        /svg>
      </div>
      <h3>No recipes found for your search. Please try again!</h3>
  </div> 
    `;
    return;
  }
  const loader =`
      <svg class="loader-icon">
        <use href="sync-solid.svg#icon-loader"></use>
      </svg>
  `;
  loaderDiv.innerHTML = loader;
  const url = `https://forkify-api.herokuapp.com/api/search?q=${search}`;
  const res = await fetch(url)
  const data = await res.json();

  //hide the loader div when the uldivs are fetched
  if(ulDiv){
   loaderDiv.style.display = 'none';
  }
  
 displayData(data.recipes);
}

//add html element for the recipes fetch result
const displayData = data => {
  pageDiv.innerHTML = `
  <button class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use xlink:href="arrow-left.svg#icon-arrow-left"></use>
    </svg> 
    <span>Page 1</span>
  </button>
  <button class="btn--inline pagination__btn--next">
    <span>Page 3 </span>
    <svg class="search__icon">
      <use xlink:href="arrow-right.svg#icon-arrow-right"></use>
    </svg> 
  </button>
  `;

  ulDiv.innerHTML = '';
  
  let array = [];

  //loop through the fetch result to add elements
  data.map(result => {
        
        let item = document.createElement("li");
        item.classList.add("preview");
        item.innerHTML = `
        <li class="preview">
            <a class="preview__link preview__link--active" href="#">
              <figure class="preview__fig">
                <img src="${result.image_url}" alt="recipe-image" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">"${result.title}"</h4>
                  <p class="preview__publisher">"${result.publisher}"</p>
              </div>
            </a>
          </li>
        `;
        //listen for click on all the list element
        item.addEventListener("click", getExtraData.bind(this, result.recipe_id));

       //array for pagination
      array.push(item);
      console.log(array);
  });

 // local variables for the pagination
  const next = document.querySelector('.pagination__btn--next');
  const prev = document.querySelector('.pagination__btn--prev');

  let page = 1;
  let itemsPerpage = 10;
  let  numofpages = data.length/itemsPerpage;
  let roundedNum = Math.ceil(numofpages);
 
 
  for (let i = (page - 1) * itemsPerpage; i < (page * itemsPerpage) && i < data.length; i++) {
       ulDiv.appendChild(array[i]);
  }

  //listen for click on the next button
  next.addEventListener('click', () => {
    page == array.length - 10 ? (page = 0) : (page += itemsPerpage);

    ulDiv.innerHTML = "";
    for(let i = page; i < page + itemsPerpage; i++ ){
      ulDiv.appendChild(array[i]);
    }

    if (page === 1) {
      prev.style.visibility = "hidden";
    } else{
      prev.style.visibility = "visible";
    }
  });

  //listen for click on the prev button
  prev.addEventListener('click', () => {
    page === 0 ? (page = array.length - 10) : (page -= itemsPerpage);
    ulDiv.innerHTML = "";
    for(let i = page; i < page + itemsPerpage; i++ ){
      ulDiv.appendChild(array[i]);
    }
    if (page == roundedNum) {
      next.style.visibility = "hidden";
    } else {
      next.style.visibility = "visible";
    }
  
  });

  //when the page number is 1 hide prev button
  if (page === 1) {
    prev.style.visibility = "hidden";
  }else{
    prev.style.visibility = "visible";
  }

  //hide the next button if page is the last 
  if (page == roundedNum) {
    next.style.visibility = "hidden";
   }else{
    next.style.visibility = "visible";
  }
  
}


//fetch the ids for the main display on click
const getExtraData = async (id) => {
  console.log(id);
  const loader2 = `
    <svg class="spinner">
      <use href="sync.svg#icon-loader"></use>
    </svg>
  `;
  loaderDiv2.innerHTML = loader2;
  const recipeUrl = `https://forkify-api.herokuapp.com/api/get?rId=${id}`;
  const recipeRes = await fetch(recipeUrl)
  const recipeData = await recipeRes.json();
  console.log(recipeData);
  if(recipeDiv){
   loaderDiv2.style.display = 'none';
  }

  displayRecipeData(recipeData.recipe);
}


const displayRecipeData = (recipeData) => {
  
  console.log(recipeData);
   recipeDiv.innerHTML = '';
    
    let figure = document.createElement('figure');
    figure.classList.add('recipe__fig');
    figure.innerHTML = `
        <img src="${recipeData.image_url}" alt="${recipeData.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipeData.title}</span>
        </h1>
    `;

    recipeDiv.append(figure);

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('recipe__details');
    recipeDetails.innerHTML = `
    <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use xlinl:href="clock-regular.svg#icon-clock"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--minutes">45</span>
    <span class="recipe__info-text">minutes</span>
  </div>
  <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use xlink:href="users-solid.svg#icon-users"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--people">4</span>
    <span class="recipe__info-text">servings</span>

    <div class="recipe__info-buttons">
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use xlink:href="minus-circle.svg#icon-minus-circle"></use>
        </svg>
      </button>
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use xlink:href="plus-circle.svg#icon-plus-circle"></use>
        </svg>
      </button>
    </div>
  </div>

  <div class="recipe__user-generated">
    <svg>
      <use xlink:href="user-solid.svg#icon-user"></use>
    </svg>
  </div>
  <button class="btn--round">
    <svg class="">
      <use xlink:href="heart.svg#icon-bookmark"></use>
    </svg>
  </button>
    `;
    recipeDiv.append(recipeDetails);

    const ingredients = recipeData.ingredients;
    const ingrDiv = document.createElement('div');
    ingrDiv.classList.add('recipe__ingredients');
    const ingrH2 = document.createElement('h2');
    ingrH2.classList.add('heading--2');
    ingrH2.innerHTML = 'Recipe ingredients';
    ingrDiv.append(ingrH2);
    
    const ingrUl = document.createElement('ul');
    ingrUl.classList.add('recipe__ingredient-list');
    for(const ingr of ingredients){
      const list = document.createElement('li');
      list.classList.add('recipe__ingredient');
      list.innerHTML =`
      <svg class="recipe__icon">
          <use xlink:href="check-solid.svg#icon-check"></use>
      </svg>

      <div class="recipe__description">
      ${ingr}
      </div>
      `;
      ingrUl.appendChild(list);
    }
    ingrDiv.append(ingrUl);
     
    //      
    //         <li class="recipe__ingredient">
    //           <svg class="recipe__icon">
    //             <use xlink:href="check-solid.svg#icon-check"></use>
    //           </svg>
    //           <div class="recipe__quantity">1000</div>
    //           <div class="recipe__description">
    //             <span class="recipe__unit">g</span>
    //             pasta
    //           </div>
    //         </li>

    //         <li class="recipe__ingredient">
    //           <svg class="recipe__icon">
    //             <use xlink:href="check-solid.svg#icon-check"></use>
    //           </svg>
    //           <div class="recipe__quantity">0.5</div>
    //           <div class="recipe__description">
    //             <span class="recipe__unit">cup</span>
    //             ricotta cheese
    //           </div>
    //         </li>
   // </ul>
    recipeDiv.append(ingrDiv);

    const dirDiv = document.createElement('div');
    dirDiv.classList.add('recipe__directions');
    dirDiv.innerHTML = `
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${recipeData.publisher}</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${recipeData.publisher_url}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use xlink:href="arrow-right.svg#icon-arrow-right"></use>
      </svg>
    </a>
    `;
    recipeDiv.append(dirDiv); 

    
    // const favIds = [];


    // const favBtn = document.querySelector('.btn--round');  
    // favBtn.addEventListener('click', () => {
    //   console.log("clicked");
    //   localStorage.setItem('favorites', JSON.stringify(figure));
    //   // localStorage.setItem('favorites', figure);
    //  });

    //  const storedFavs = document.querySelector('.nav__btn--bookmarks');
    //  storedFavs.addEventListener('click', () => {
    //   console.log("clicked");
    //  });
}

// favIds.push(recipeData);
// console.log(favIds);


// listen for submit on the form search and get the input 
searchForm.addEventListener("submit", getInput);

