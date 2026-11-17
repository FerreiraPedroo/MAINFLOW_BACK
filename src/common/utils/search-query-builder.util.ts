export function searchQueryBuild(query:any) {
  let where;
  let orderBy;
  if (query.filter) {
    where = { ...query.filter };
  }

  return { where, orderBy };
}
