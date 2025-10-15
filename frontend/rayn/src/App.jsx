import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import Home from './pages/Home';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
    </Route>
  )
);

const App = () => {
  return (
    <div className="contain mx-auto font-dmsans text-[16px] text-dark w-[100%]">
      <RouterProvider router={router} />

    </div>
  )
}
export default App