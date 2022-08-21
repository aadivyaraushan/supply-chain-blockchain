import Modal from '../../common/Modal';
import InputElement from '../../common/InputElement';
import Button from '../../common/Button';
import Message from '../../common/Message';

function RevertOrderTraderModal(props) {
  return (
    <Modal closable={true} onClose={props.onClose}>
      <div className='flex items-center'>
        <h1 className=' mx-auto text-3xl'>New Details</h1>
      </div>
      <InputElement
        type='text'
        placeholder={
          props.accountType === 'trader'
            ? 'Amount per unit from buyer'
            : 'Amount per unit to trader'
        }
        required={true}
        onChange={props.onChangeAmount}
      />
      <InputElement
        type='text'
        placeholder={
          props.accountType === 'trader'
            ? 'Percent of advance payment from buyer'
            : 'Percent of advance payment to trader'
        }
        required={true}
        onChange={props.onChangePercent}
      />
      {props.error && <Message type='error'>{props.error}</Message>}
      <div className='flex items-center'>
        <Button
          type='primary'
          className='mx-auto mt-3'
          onClick={props.onSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default RevertOrderTraderModal;
