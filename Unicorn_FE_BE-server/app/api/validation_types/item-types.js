/* eslint-disable */

const unitList = ["mg", "g", "kg", "ml", "l", "mm", "cm", "dm", "m", 
            "kus", "ks"]
const stateList = ["active", "archived"]

const itemArrayCreateDtoInType = array(
    shape({
      shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
      title: string(3, 255).isRequired(),
      amount: integer(1,1000000000).isRequired(),
      unit: string().oneOf(unitList).isRequired(),
    })
  )
  
const itemCreateDtoInType = shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    title: string(3, 255).isRequired(),
    amount: integer(1,1000000000).isRequired(),
    unit: string().oneOf(unitList).isRequired(),
  });

const itemListDtoInType = shape({
  shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  state: string().oneOf(stateList),
  pageInfo: shape({
    pageIndex: integer(0, 1000000000),
    pageSize: integer(1, 1000000000),
  }),
});

const itemGetDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
  shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  state: string().oneOf(stateList),
});

const itemArrayGetDtoInType = array(
  shape({
    id: string(/^[0-9a-f]{24}$/).isRequired(),
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    state: string().oneOf(stateList),
}));

const itemArrayUpdateDtoInType = array(
  shape({
    id: string(/^[0-9a-f]{24}$/).isRequired(),
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    title: string(3, 255),
    amount: integer(1,1000000000),
    unit: string().oneOf(unitList),
    state: string().oneOf(stateList),
  })
 );

const itemUpdateDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
  shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  title: string(3, 255),
  amount: integer(1,1000000000),
  unit: string().oneOf(unitList),
  state: string().oneOf(stateList),
});

const itemDeleteDtoInType = shape({
  id: string(/^[0-9a-f]{24}$/).isRequired(),
  shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
});

const itemArrayDeleteDtoInType = array(
  shape({
    id: string(/^[0-9a-f]{24}$/).isRequired(),
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  })
);
