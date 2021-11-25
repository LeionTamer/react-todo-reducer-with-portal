import { createPortal } from "react-dom"

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,0.7)'
}

const MODAL_STYLES = {
  position: 'fixed',
  right: '50%',
  transform: 'translate(50%, 50%)',
  backgroundColor: 'white',
  padding: '50px'
}

export function withModal(Component) {
  return function withModalComponent({ open, close, ...props }) {
    if (!open) return null

    const WrappedComponent = () => {

      return (
        <>
          <div style={OVERLAY_STYLES} onClick={close} />
          <div style={MODAL_STYLES}>
            <Component close={close} {...props} />
          </div>
        </>
      )
    }

    return createPortal(
      <WrappedComponent />
      ,
      document.getElementById('modal-portal')
    )
  }
}