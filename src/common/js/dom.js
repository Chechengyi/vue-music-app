export function addClass(el, clsName) {
  let newClass = el.className.split(' ')
  if ( newClass.indexOf(clsName) > -1 ) {
    return
  }
  newClass.push(clsName)
  el.className = newClass.join(' ')
}

// 判断是否具有class
export function hasClass(el, clsName) {
  let reg = new RegExp('(^|\\s)' + clsName + '(\\s|$)')
  return reg.test(el.className)
}


export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}
