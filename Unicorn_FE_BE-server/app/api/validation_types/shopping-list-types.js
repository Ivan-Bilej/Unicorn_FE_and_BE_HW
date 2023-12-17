/* eslint-disable */

const shoppingListCreateDtoInType = shape({
    name: string(3, 255).isRequired(),
    text: string(3, 4000).isRequired()
  });