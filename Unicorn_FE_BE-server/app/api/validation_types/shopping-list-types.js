/* eslint-disable */

const shoppingListCreateDtoInType = shape({
    _id: string(1, 255).isRequired,
    name: string(3, 255).isRequired(),
    text: string(3, 4000).isRequired()
  });

const shoppingListListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
    }),
  });

  const shoppingListGetDtoInType = shape({
    _id: string(1, 255).isRequired,
  });

  const shoppingListUpdateDtoInType = shape({
    _id: string(1, 255).isRequired,
    name: string(3, 255).isRequired(),
    text: string(3, 4000).isRequired()
  });

  const shoppingListDeleteDtoInType = shape({
    _id: string(1, 255).isRequired,
  });


