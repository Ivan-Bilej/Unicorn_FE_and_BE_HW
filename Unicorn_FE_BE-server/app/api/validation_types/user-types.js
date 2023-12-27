/* eslint-disable */

const UserAddDtoInType =
  shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    allowedUsers: array(
        shape({
            userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired()
        })
    )
  });

  const UserRemoveDtoInType =
  shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
    allowedUsers: array(
        shape({
            userId: string(/^[0-9]{1,4}\-[0-9]{1,4}(\-[0-9]{1,4}(\-[0-9]{1,4})?)?$/).isRequired()
        })
    )
  });

  const UserRemoveMyselfDtoInType =
  shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  });

  const UserListDtoInType =
  shape({
    shoppingListId: string(/^[0-9a-f]{24}$/).isRequired(),
  });