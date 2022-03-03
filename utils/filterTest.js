const routeRoles = ["teacher", "admin"];
const userRoles = ["teacher", 'family'];

const okRoles = userRoles.filter(userRole => routeRoles.includes(userRole))
const ok = okRoles.length > 0;
console.log(ok, `${okRoles}  in ${routeRoles}`);