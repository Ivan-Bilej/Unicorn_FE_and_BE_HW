/* eslint-disable */


const shoppingListCreateDtoInType = shape({
  title: string(3, 255).isRequired(),
  description: string(1, 4000),
  imageUrl: string(3, 4000).isRequired(),
  items: array(),
  allowedUsers: array(),
});

const shoppingListListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
  }),
});

const shoppingListGetDtoInType = shape({
  _id: mongoId().isRequired,
});

const shoppingListUpdateDtoInType = shape({
  _id: mongoId().isRequired,
  title: string(1, 255).isRequired(),
  description: string(1, 4000),
  image: string().isRequired(),
  items: array(),
  allowedUsers: array(),
});

const shoppingListDeleteDtoInType = shape({
  _id: mongoId().isRequired(),
});
