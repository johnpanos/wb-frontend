export const PermissionService = {
  hasRole(user, roles) {
    var show = false;

    console.log(user);

    const userRoles = user.roles.map(role => role.name);
    for (const role of roles) {
      if (userRoles.includes(role)) {
        show = true;
      }
    }

    return show;
    //return false;
  }
}