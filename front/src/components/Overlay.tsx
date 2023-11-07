import { useDispatch } from "react-redux"
import { changeFormMode, closeModal } from "../features/appSlice";

type OverlayProps = {
  children: React.ReactNode;
}

function Overlay({ children }: OverlayProps) {
  const dispatch = useDispatch();

  const onOverlayClick = () => {
    dispatch(changeFormMode("ADD"));
    dispatch(closeModal());
  }

  return (
    <div onClick={onOverlayClick} className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-modalBg'>
      {children}
    </div>
  )
}

export default Overlay