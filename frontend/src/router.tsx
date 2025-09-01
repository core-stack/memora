import { BrowserRouter, Route, Routes } from "react-router";

import { Home } from "./pages/page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> } />
      </Routes>
    </BrowserRouter>
  )
}