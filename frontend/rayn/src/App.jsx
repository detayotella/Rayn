import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import ChooseUsernamePage from './pages/ChooseUserName';
import Rewards from './pages/Rewards';
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";
import Receive from "./pages/Receive"
import CommunityGiveaway from "./pages/CommunityGiveaway";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/choose-username" element={<ChooseUsernamePage />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/send" element={<Send />} />
      <Route path='/receive' element={<Receive/>}/>
      <Route path="/giveaways" element={<CommunityGiveaway/>}/>
      <Route path="/transaction" element={<Transaction/>}/>
      <Route path="/profile" element={<Profile/>}/>
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