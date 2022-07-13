import React, { useEffect, useState, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [filteredIngredients, setFilteredIngredients] = useState("");
  const inputRef = useRef();

  const { onLoadIngredients } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredIngredients === inputRef.current.value) {
        const query =
          filteredIngredients.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${filteredIngredients}"`;
        fetch(
          "https://react-http-bb5e7-default-rtdb.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filteredIngredients, onLoadIngredients]);

  const filteredIngredientsHandler = (event) => {
    const ing = event.target.value;
    const ingCap = ing.charAt(0).toUpperCase() + ing.slice(1);
    setFilteredIngredients(ingCap);
  };

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filteredIngredients}
            onChange={filteredIngredientsHandler}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
