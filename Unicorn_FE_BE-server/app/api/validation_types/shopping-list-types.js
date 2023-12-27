/* eslint-disable */

const unitList = ["mg", "g", "kg", "ml", "l", "mm", "cm", "dm", "m", 
            "kus", "ks"]

            
const shoppingListCreateDtoInType = shape({
  title: string(3, 255).isRequired(),
  description: string(1, 4000).isRequired(),
  imageUrl: string(3, 4000).isRequired(),
  items: array(
    shape({
      title: string(3, 255),
      amount: integer(1,1000000000),
      unit: string().oneOf(unitList),
    })
  ).isRequired(),
  allowedUsers: array(
    shape({
      userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/),
    })
  ).isRequired(),
});

const shoppingListListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
  }),
});

const shoppingListGetDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
});

const shoppingListUpdateDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
  title: string(1, 255),
  description: string(1, 4000),
  imageUrl: string(3, 4000),
  items: array(),
  allowedUsers: array(),
});

const shoppingListDeleteDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
});
