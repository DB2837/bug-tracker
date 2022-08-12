export const replaceItemInArray = (
  originalItemsArray: any[],
  idItemToReplace: string,
  itemUpdated: any
) => {
  const index = originalItemsArray.findIndex(
    (item) => item.id === idItemToReplace
  );
  originalItemsArray.splice(index, 1);
  originalItemsArray.splice(index, 0, itemUpdated);

  return originalItemsArray;
};
