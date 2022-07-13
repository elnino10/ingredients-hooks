import React, { useEffect, useCallback, useReducer } from "react";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const ingredientsReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredient;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter((item) => item.id !== action.id);
    default:
      throw new Error("Error!");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { isLoading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, isLoading: false };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Something went wrong!");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const addIngredientsHandler = (ingredient) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      "https://react-http-bb5e7-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        dispatchHttp({ type: "RESPONSE" });
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  };

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const loadedIngredientsHandler = useCallback((ingredients) => {
    // setUserIngredients(ingredients);
    dispatch({ type: "SET", ingredient: ingredients });
  }, []);

  const removeItemHandler = (ingredientsId) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-http-bb5e7-default-rtdb.firebaseio.com/ingredients/${ingredientsId}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      dispatchHttp({ type: "RESPONSE" });
      // setUserIngredients((prevIngredients) =>
      //   prevIngredients.filter((t) => t.id !== ingredientsId)
      // );
      dispatch({ type: "DELETE", id: ingredientsId });
    });
  };

  const closeModalHandler = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={closeModalHandler}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onIsLoading={httpState.isLoading}
        onAddIngredients={addIngredientsHandler}
      />

      <section>
        <Search onLoadIngredients={loadedIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeItemHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
