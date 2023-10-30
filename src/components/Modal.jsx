export const handleButton = (handleClick, value, setContentModal) => {
  handleClick(value)
  setContentModal('')
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
const Modal = ({ contentModal, setContentModal, buttons, handleButtons }) => {
  console.log('El modal es: ', contentModal)
  console.log('Los botones son: ', buttons)
  console.log('La funcion es: ', handleButtons)
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
              buttons?.map((but, i) => {
                return (
                  <button key={i} className='button' onClick={() => { handleButton(handleButtons, but.value, setContentModal) }}>{but.text}</button>
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
