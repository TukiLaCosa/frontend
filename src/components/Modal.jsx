export const handleButton = (handleClick, value, setContentModal, setButtons, setHandleButtons) => {
  handleClick(value)
  setContentModal('')
  setButtons([])
  setHandleButtons(null)
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
      <div class='modal is-active'>
        <div class='modal-background' />
        <div class='modal-card'>
          <header class='modal-card-head'>
            <p class='modal-card-title'>Opciones</p>
            <button class='delete' aria-label='close' onClick={() => { setContentModal('') }} />
          </header>
          <section class='modal-card-body'>
            {contentModal}
          </section>
          <footer class='modal-card-foot'>
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
