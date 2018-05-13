all_foods = [
// {Name, Distance, [genres]}
{name: "Dumpling House",              dist: 4.4, genres: ["chinese", "asian"]},
{name: "Chilly Mango",                dist: 1.0, genres: ["thai", "asian"]},
{name: "Shinsengumi",                 dist: 12., genres: ["ramen", "asian"]},
{name: "Chang's Garden",              dist: 4.9, genres: ["chinese", "asian"]},
{name: "Du Pars",                     dist: 0.9, genres: ["diner"]},
{name: "The Counter",                 dist: 0.9, genres: ["burger"]},
{name: "Teaspots",                    dist: 0.8, genres: ["asian"]},
{name: "Teaspots-adjacent Mongolian", dist: 0.8, genres: ["mongolian", "asian"]},
{name: "Flour + Tea",                 dist: 1.0, genres: ["poke", "asian"]},
{name: "Pie-ology",                   dist: 1.0, genres: ["pizza"]},
{name: "Souplantation",               dist: 0.9, genres: ["buffet"]},
{name: "Lemonade",                    dist: 1.0, genres: ["gluten free option"]},
{name: "Veggie Grill",                dist: 0.9, genres: [""]},
{name: "Chipotle",                    dist: 0.8, genres: ["burrito"]},
{name: "Which Wich",                  dist: 0.9, genres: ["sandwich"]},
{name: "Sugar Fish",                  dist: 1.0, genres: ["sushi", "asian"]},
{name: "Panda Express (roll again)",  dist: 0.9, genres: ["fake chinese"]},
{name: "California Pizza Kitchen",    dist: 1.8, genres: ["pizza"]},
{name: "Fish Dish",                   dist: 0.9, genres: ["fish"]},
{name: "Dog Haus",                    dist: 0.9, genres: ["hotdog", "burger"]},
{name: "Melt It",                     dist: 0.8, genres: ["sandwich"]},
{name: "Pie'n Burger",                dist: 0.5, genres: ["pie", "burger"]},
{name: "Tamashi",                     dist: 1.0, genres: ["ramen", "asian"]},
{name: "Delhi Palace",                dist: 1.0, genres: ["indian"]},
{name: "Bhanu's",                     dist: 3.4, genres: ["indian"]},
]

function intersect(arr1, arr2)
{
    return arr1.filter(function(n) {
        return arr2.indexOf(n) != -1;
    });
}

function get_genres()
{
    var genres = [];
    $(":checked").each(function(){genres.push(this.id)});
    return genres;
}

function set_food(food)
{
    $("#result").text(food);
}

function pick_food()
{
    var dist = $("#dist").val();
    var genres = get_genres();
    var foods = all_foods.filter(function(e){
        return (e.dist <= dist) && (intersect(e.genres, genres).length != 0);
    });
    var food = foods[Math.floor(Math.random()*foods.length)];
    if (!food)
        set_food("No place matches");
    else
        set_food(food.name);
}

