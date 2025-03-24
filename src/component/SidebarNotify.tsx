import { useDispatch } from 'react-redux'
import { setNotification } from '../functions/profileReducerFunction'

export function useNotifyDispatcher() {
  const dispatch = useDispatch()

  return (notification: string) => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, 3000)
  }
}
