import store from '@/store';

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    const user = store.state.authentication.user;

    if (!user) {
      el.parentNode && el.parentNode.removeChild(el)
    }

    const roles = user.roles.map(role => role.name);

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}