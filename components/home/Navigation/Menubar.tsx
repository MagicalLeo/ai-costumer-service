import { useAppContext } from "@/components/AppContext";
import Button from "@/components/common/Button";
import { ActionType } from "@/reducers/AppReducers";
import { HiPlus } from "react-icons/hi";
import { LuPanelLeft } from "react-icons/lu";
export default function Menubar() {
  const { dispatch } = useAppContext();

  return (
    <div className="flex space-x-3">
      <Button
        icon={HiPlus}
        variant="outline"
        className="flex-1"
        onClick={() => {
          dispatch({
            type: ActionType.UPDATE,
            field: "selectedChat",
            value: null,
          });
        }}
      >
        New Chat
      </Button>
      <Button
        icon={LuPanelLeft}
        variant="outline"
        onClick={() => {
          dispatch({
            type: ActionType.UPDATE,
            field: "displayNavigation",
            value: false,
          });
        }}
      ></Button>
    </div>
  );
}
