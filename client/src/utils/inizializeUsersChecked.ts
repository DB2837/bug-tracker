//build and obj {userEmail:boolean,...} to set checkboxes for project members
export const inizializeUsersChecked = (
  users: any[],
  objProperty: string,
  members?: any[]
) => {
  const myObj = users.reduce((prevValue, currentValue) => {
    if (members?.find((email) => email === currentValue[objProperty])) {
      //find users which are members of the project and set emailUser:true for the next part, where will be checked true by default
      prevValue[currentValue[objProperty]] = true;
      return prevValue;
    }
    prevValue[currentValue[objProperty]] = false;

    return prevValue;
  }, {});

  return myObj;
};
