/* eslint-disable */

const userAddDtoInType = shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired(),
    userName: string(255).isRequired()
  });

  const userArrayAddDtoInType = array(
    shape({
      shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
      userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired(),
      userName: string(255).isRequired()
    })
  );

  const userRemoveDtoInType = shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired()
  });

  const userArrayRemoveDtoInType = array(
    shape({
      shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
      userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired()
    })
  );

  const userRemoveMyselfDtoInType = shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  });

  const userListDtoInType = shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    pageInfo: shape({
      pageIndex: integer(0, 1000000000),
      pageSize: integer(1, 1000000000),
    }),
  });