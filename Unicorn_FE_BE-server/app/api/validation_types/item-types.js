/* eslint-disable */

const unitList = ["mg", "g", "kg", "ml", "l", "mm", "cm", "dm", "m", 
            "kus", "ks"]


const itemCreateDtoInType = shape({
  shoppingListId: mongoId().isRequired(),
  title: string(3, 255).isRequired(),
  amount: integer(1,1000000000).isRequired(),
  unit: string(50).oneOf(unitList).isRequired(),
});

const itemListDtoInType = shape({
  shoppingListId: mongoId().isRequired(),
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
  }),
});

const itemGetDtoInType = shape({
  _id: mongoId().isRequired,
  shoppingListId: mongoId().isRequired(),
});

const itemUpdateDtoInType = shape({
  _id: mongoId().isRequired(),
  shoppingListId: mongoId().isRequired(),
  title: string(3, 255).isRequired(),
  amount: integer(1,1000000000).isRequired(),
  unit: string(50).oneOf(unitList).isRequired(),
});

const itemDeleteDtoInType = shape({
  _id: mongoId().isRequired(),
  shoppingListId: mongoId().isRequired(),
});
