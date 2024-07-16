"use client";
import React, { createContext, useCallback, useEffect, useRef } from "react";
import { useIDBReducer } from "../hooks/useIDBReducer";

export const UIConfigContext = createContext<UIConfigInterface | null>(null);

interface UIConfigState {
  lsbWidth: number;
  rsbWidth: number;
  isLSBCollapsed: boolean;
  rsbView: "none" | "queue" | "nowPlaying";
}
interface UIConfigInterface extends UIConfigState {
  setLSBWidth: (width: number) => void;
  setRSBWidth: (width: number) => void;
  setLSBCollapsed: (collapsed: boolean) => void;
  setRSBView: (view: "none" | "queue" | "nowPlaying") => void;
}

function uiConfigReducer(
  state: UIConfigState,
  action: { type: string; payload: any },
) {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "setLSBWidth":
      return { ...state, lsbWidth: action.payload };
    case "setRSBWidth":
      return { ...state, rsbWidth: action.payload };
    case "setLSBCollapsed":
      return { ...state, isLSBCollapsed: action.payload };
    case "setRSBView":
      return { ...state, rsbView: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export default function UIConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState: UIConfigState = {
    lsbWidth: 280,
    rsbWidth: 280,
    isLSBCollapsed: false,
    rsbView: "queue",
  };
  const [state, dispatch] = useIDBReducer(
    "uiConfig",
    uiConfigReducer,
    initialState,
    useCallback(() => {}, []),
  );

  const lsbWidthRef = useRef(280);
  const mainWidthRef = useRef(400);
  useEffect(() => {
    mainWidthRef.current =
      window!.innerWidth -
      ((state.isLSBCollapsed ? 72 : state.lsbWidth) +
        (state.rsbView === "none" ? 0 : state.rsbWidth) +
        32);
    const mainSection = document.querySelector("body section") as HTMLElement;
    mainSection.style.width = `${mainWidthRef.current}px`;
  }, [state.isLSBCollapsed, state.lsbWidth, state.rsbView, state.rsbWidth]);

  const setLSBWidth = (width: number) => {
    if (width < 176) {
      setLSBCollapsed(true);
    } else {
      width = Math.max(280, width);
      if (
        mainWidthRef.current + state.lsbWidth - width > 400 ||
        width < state.lsbWidth
      ) {
        lsbWidthRef.current = width;
        dispatch({ type: "setLSBWidth", payload: width });
        if (state.isLSBCollapsed) setLSBCollapsed(false);
      } else {
        const newRSBWidth =
          state.rsbWidth + state.lsbWidth - width + mainWidthRef.current - 400;
        if (newRSBWidth >= 280) {
          dispatch({ type: "setLSBWidth", payload: width });
          dispatch({ type: "setRSBWidth", payload: newRSBWidth });
        } else {
          if (state.rsbView !== "none") setRSBView("none");
          if (mainWidthRef.current + state.lsbWidth - width > 400)
            dispatch({ type: "setLSBWidth", payload: width });
        }
      }
    }
  };

  const setRSBWidth = (width: number) => {
    width = Math.min(400, width);
    width = Math.max(280, width);
    if (
      mainWidthRef.current + state.rsbWidth - width >= 400 ||
      width < state.rsbWidth
    ) {
      dispatch({ type: "setRSBWidth", payload: width });
    } else {
      const lsbWidth = state.isLSBCollapsed ? 72 : state.lsbWidth;
      const newLSBWidth =
        lsbWidth + state.rsbWidth - width - 400 + mainWidthRef.current;
      if (newLSBWidth >= 280) {
        setLSBWidth(newLSBWidth);
        dispatch({ type: "setRSBWidth", payload: width });
      } else {
        if (!state.isLSBCollapsed) setLSBCollapsed(true);
        if (mainWidthRef.current + state.rsbWidth - width > 400)
          dispatch({ type: "setRSBWidth", payload: width });
      }
    }
  };

  const setLSBCollapsed = (collapsed: boolean) => {
    dispatch({ type: "setLSBCollapsed", payload: collapsed });
    dispatch({
      type: "setLSBWidth",
      payload: collapsed ? 72 : lsbWidthRef.current,
    });
    if (
      !collapsed &&
      mainWidthRef.current + state.lsbWidth - lsbWidthRef.current < 400
    ) {
      dispatch({ type: "setLSBWidth", payload: 280 });
      const newRSBWidth =
        state.rsbWidth + mainWidthRef.current - 400 + state.lsbWidth - 280;
      if (newRSBWidth >= 280) {
        setRSBWidth(newRSBWidth);
      } else {
        setRSBView("none");
      }
    }
  };

  const setRSBView = (view: "none" | "queue" | "nowPlaying") => {
    dispatch({ type: "setRSBView", payload: view });
    if (view !== "none" && mainWidthRef.current - state.rsbWidth < 400) {
      dispatch({ type: "setRSBWidth", payload: 280 });
      const newLSBWidth = state.lsbWidth + mainWidthRef.current - 400 - 280;
      if (newLSBWidth >= 280) {
        setLSBWidth(newLSBWidth);
      } else {
        setLSBCollapsed(true);
      }
    }
  };

  const value = {
    ...state,
    setLSBWidth,
    setRSBWidth,
    setLSBCollapsed,
    setRSBView,
  };
  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  );
}
