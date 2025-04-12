import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducers/AppReducers";
import { LuPanelLeft } from "react-icons/lu";

export default function Menu() {
  const {
    state: { displayNavigation },
    dispatch,
  } = useAppContext();
  return (
    <Button
      icon={LuPanelLeft}
      className={`fixed top-2 left-2 z-index-1000 z-120 ${displayNavigation ? "hidden" : ""}`}
      variant="outline"
      onClick={() => {
        dispatch({
          type: ActionType.UPDATE,
          field: "displayNavigation",
          value: true,
        });
      }}
    ></Button>
  );
}
