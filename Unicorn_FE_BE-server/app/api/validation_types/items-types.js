/* eslint-disable */

const shoppingListCreateDtoInType = shape({
  title: string(3, 255).isRequired(),
  imageUrl: string(3, 4000).isRequired(),
});

const shoppingListListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
  }),
});

const shoppingListGetDtoInType = shape({
  _id: string(24, 24).matches(/^[0-9a-fA-F]{24}$/).isRequired,
});

const shoppingListUpdateDtoInType = shape({
  _id: string(24, 24).matches(/^[0-9a-fA-F]{24}$/).isRequired,
});

const shoppingListDeleteDtoInType = shape({
  _id: string(24, 24).matches(/^[0-9a-fA-F]{24}$/).isRequired,
});
