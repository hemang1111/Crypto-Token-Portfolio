import { useEffect } from 'react'

let listenerCallbacks = new WeakMap()

let observer

function handleIntersections(entries) {
  entries?.forEach((entry) => {
    if (listenerCallbacks?.has(entry.target)) {
      let cb = listenerCallbacks.get(entry.target)

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(entry.target)
        listenerCallbacks.delete(entry.target)
        cb()
      }
    }
  })
}

function getIntersectionObserver(url) {
  if (observer === undefined) {
    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: '0px',
      threshold: '0',
    })
  }
  return observer
}

export function useIntersection(elem, callback, url) {
  useEffect(() => {
    if (!elem.current) {
      console.warn('elem.current is null or undefined')
      return
    }
    let target = elem.current
    let observer = getIntersectionObserver(url)
    if (elem.current && typeof elem.current === 'object') {
      listenerCallbacks.set(target, callback)
    } else {
      console.error('Invalid target for WeakMap key')
    }

    observer.observe(target)
    return () => {
      listenerCallbacks.delete(target)
      observer.unobserve(target)
    }
  }, [])
}

export function clearIntersections(){
  listenerCallbacks = new WeakMap()
}
