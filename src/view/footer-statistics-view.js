export const createFooterStatisticsTemplate = (movies) => {
  const count = movies.length;

  return `<p>${count} movies inside</p>`;
};
