export const updateColorsHash = (colors = []) => {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join('-');
};
