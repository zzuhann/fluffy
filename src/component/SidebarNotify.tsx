import React from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../functions/profileReducerFunction";

export const useNotifyDispatcher = () => {
  const dispatch = useDispatch();

  return (notification: string) => {
    dispatch(setNotification(notification));
    setTimeout(() => {
      dispatch(setNotification(""));
    }, 3000);
  };
};
