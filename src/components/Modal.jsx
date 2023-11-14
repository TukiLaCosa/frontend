export const handleButton = (handleClick, value, setContentModal, setButtons, setHandleButtons) => {
  setContentModal('')
  setButtons([])
  setHandleButtons(null)
  handleClick(value)
}

/**
 * @buttons must be like this
 * [
 *  {
 *    'text': 'text button 1',
 *    'value': true
 *  },
 *  {
 *    'text': 'text button 2',
 *    'value': false
 *  }
 * ]
 *
 * @handleButtons must be like
 * (value) => {
 *  TODO
 * }
 */
const Modal = ({ contentModal, setContentModal, buttons, setButtons, handleButtons, setHandleButtons }) => {
  if (contentModal !== '' && contentModal !== undefined) {
    return (
      <div className='modal is-active'>
        <div className='modal-background' />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Opciones</p>
            {
              buttons && buttons.length > 0 &&
                <button className='delete' aria-label='close' onClick={() => { setContentModal('') }} />
            }
          </header>
          <section className='modal-card-body'>
            {contentModal}
          </section>
          <footer className='modal-card-foot'>
            {
              buttons && buttons?.map((but, i) => {
                return (
                  <button key={i} className='button' onClick={() => { handleButton(handleButtons, but.value, setContentModal, setButtons, setHandleButtons) }}>{but.text}</button>
                )
              })
            }
          </footer>
        </div>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}

export default Modal
