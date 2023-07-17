import { Meal } from '../models/meal';
import { MealsSummary } from '../models/meals-summary';

export function getMealsSummaryFromMealsList(meals: Meal[]): MealsSummary{
    const totalMeals = meals.length ?? 0;
    const totalDietMeals = meals.filter(meal => !!meal.isDiet)?.length ?? 0;
    const totalNonDietMeals = totalMeals - totalDietMeals;
    let largestSequence: number = 0;
    let sequence: number = 0;
    meals.forEach((meal) => {
        if(meal.isDiet){
            sequence++;
        }
        else{
            largestSequence = largestSequence < sequence ? sequence : largestSequence;
            sequence = 0;
        }
    });
    largestSequence = largestSequence < sequence ? sequence : largestSequence;
    return {
        totalMeals,
        totalDietMeals,
        totalNonDietMeals,
        bestSequenceOfDietMeals: largestSequence
    };
}