import { useEffect, useState } from 'react'

let listener: ((msg: string | null) => void) | null = null
let timer: ReturnType<typeof setTimeout> | undefined

export function toast(message: string) {
  clearTimeout(timer)
  listener?.(message)
  timer = setTimeout(() => listener?.(null), 2200)
}

export function Toast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    listener = setMessage
    return () => {
      listener = null
    }
  }, [])

  if (!message) return null
  return <div className="toast">{message}</div>
}
