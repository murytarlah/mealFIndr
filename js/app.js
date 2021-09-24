const searcher = document.querySelector('.search')
const pSearch = document.querySelector('.s-meal')
const random = document.querySelector('.random_meal')
const mealsEl = document.querySelector('.meals')
const resultHeading = document.querySelector('.s-result');
const randomMeal = document.querySelector('.randomGeneratedMeal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal & random meal
  randomMeal.innerHTML = '';

  // Get search term
  const term = pSearch.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
          mealsEl.innerHTML = ''
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
              <div class="col-md-4 col-sm-6>
                <div class="card meal" style="width: 18rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" style="max-height:200px; object-fit: cover" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <p class="card-text overlay instructions">${meal.strInstructions}</p>
                        <ul class="list-group">
                          ${getIngredients(meal).map((ing,index) => index <= 2 ? `<li class="list-group-item" style="color: white; background:none;">${ing}</li>`: '').join('')}
                        </ul>
                        <p class="btn meal_detail" data-mealID="${meal.idMeal}">read more</p>
                    </div>
                </div>
              </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    pSearch.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}
//  Generate ingredients
const getIngredients = (meal)=>{
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  return ingredients
}
// Add meal to DOM
function addMealToDOM(meal) {
  const g_ings =  getIngredients(meal)
  randomMeal.innerHTML = `
    <div class="row single-meal p-4">
      <div class="col-md-4">
        <img width='100%' style="border-radius: 10px" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      </div>
      <div class="col-md-8">
        <h1>${meal.strMeal}</h1>
        <div class="single-meal-info">
          ${meal.strCategory ? `<h5>${meal.strCategory}</h5>` : ''}
          ${meal.strArea ? `<h5>${meal.strArea}</h5>` : ''}
        </div>
        <div class="main">
          <h2 style='color:var(--yellow)'>Instructions</h2>
          <p>${meal.strInstructions}</p>
          <h2 style='color:var(--yellow)'>Ingredients</h2>
          <ul class="list-group">
            ${g_ings.map(ing => `<li class="list-group-item" style="color: white; background:none;">${ing}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Event listeners
searcher.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal_detail');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});


// module.exports = {addMealToDOM}