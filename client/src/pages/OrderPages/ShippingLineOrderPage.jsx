import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useEth} from '../../contexts/EthContext';
import {UNITS} from '../../utils/units';
import {STATES} from '../../utils/states';
import Topbar from '../../components/common/Topbar';
import {DataStore} from '@aws-amplify/datastore';
import {makeStorageClient} from "../../utils/web3storage";
import {faDownload, faUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RejectOrderShippingLine from "../../components/order-actions/buttons/RejectOrderShippingLine";
import RevertOrder from "../../components/order-actions/buttons/RevertOrder";
import ConfirmOrderShippingLineToSupplier
    from "../../components/order-actions/buttons/ConfirmOrderShippingLineToSupplier";
import UploadBL from "../../components/order-actions/buttons/UploadBL";
import GoodsShipped from "../../components/order-actions/buttons/GoodsShipped";
import AddShippingLineAmount from "../../components/order-actions/buttons/AddShippingLineAmount";
import Message from "../../components/common/Message";
import {RevertOrderShippingLine} from "../../components/order-actions/modals/RevertOrderShippingLine";
import {checkAmount} from "../../utils/checkAmount";
import {getCurrencyConversion} from "../../utils/getCurrencyConversion";
import {UploadBLModal} from "../../components/order-actions/modals/UploadBLModal";
import Modal from "../../components/common/Modal";
import InputElement from "../../components/common/InputElement";
import Button from "../../components/common/Button";
import {Users} from '../../models';
import {saveAs} from 'file-saver';

const ShippingLineOrderPage = () => {
    const {state} = useEth();
    const {hash} = useParams();
    const [orderState, setOrderState] = useState('');
    const [orderDetails, setOrderDetails] = useState({});
    const [documents, setDocuments] = useState([]);
    const [revertOrderShippingLineVisible, setRevertOrderShippingLineVisible] =
        useState(false);
    const [uploadBlVisible, setUploadBlVisible] = useState(false);
    const [addAmountVisible, setAddAmountVisible] = useState(false);
    const [messageKey, setMessageKey] = useState(0);
    const [error, setError] = useState(null);
    const [shippingLineDetails, setShippingLineDetails] = useState({});
    const [inputError, setInputError] = useState('');
    const [Bl, setBl] = useState();
    const [newOrderDetails, setNewOrderDetails] = useState();

    const onSubmitRevertShippingLine = async () => {
        console.log(shippingLineDetails);
        if (checkAmount(shippingLineDetails.amountToShippingLine)) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError(checkAmount(shippingLineDetails.amountToShippingLine));
        } else {
            const amountToShippingLine = String(
                Math.round(
                    (shippingLineDetails.amountToShippingLine /
                        Number(await getCurrencyConversion())) *
                    1000000000
                )
            );
            await state.contract?.methods
                .revertOrderShippingLine(hash, amountToShippingLine)
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', (error) => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    const onSubmitAddAmount = async () => {
        console.log(newOrderDetails);
        if (checkAmount(newOrderDetails.amountFromSupplier)) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError(checkAmount(newOrderDetails.amountFromSupplier));
        } else {
            const currencyConversion = await getCurrencyConversion();
            const amountFromSupplier = String(
                Math.round(
                    (newOrderDetails.amountFromSupplier / Number(currencyConversion)) *
                    1000000000
                )
            );
            await state?.contract?.methods
                .addAmountShippingLine(hash, amountFromSupplier)
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', () => {
                    setMessageKey((messageKey) => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    const onSubmitBL = async () => {
        console.log(Bl);
        if (!Bl) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError('Please add a BL');
        } else {
            const client = makeStorageClient();
            const cidBL = await client.put([Bl]);
            await state?.contract?.methods
                ?.uploadBL(hash, cidBL)
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', () => {
                    setMessageKey((messageKey) => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    useEffect(() => {
        if (state) {
            const getOrderState = async () => {
                const orderState = await state.contract?.methods
                    .getState(hash)
                    .call({from: state.accounts[0]});
                console.log('order state: ', orderState);
                setOrderState(orderState);
            };
            getOrderState();

            const getCommodityAndQuantity = async () => {
                if (state.contract) {
                    const {
                        0: commodity,
                        1: quantity,
                        2: finalQuantity,
                        3: unit,
                    } = await state?.contract?.methods
                        .getCommodityAndQuantity(hash)
                        .call({from: state.accounts[0]});
                    console.log('final quantity: ', finalQuantity, typeof finalQuantity);
                    console.log('condition: ', finalQuantity !== '0');

                    setOrderDetails((orderDetails) => ({
                        ...orderDetails,
                        commodity,
                        quantity: String(Number(quantity) / 100),
                        finalQuantity: String(Number(finalQuantity) / 100),
                        unit: UNITS[unit],
                    }));
                }
            };
            getCommodityAndQuantity();

            const getBuyer = async () => {
                const buyerAddress = await state.contract?.methods
                    .getBuyer(hash)
                    .call({from: state.accounts[0]});
                const buyerDetails = await DataStore.query(Users, (c) =>
                    c.address('eq', buyerAddress)
                );
                if (buyerDetails[0]) {
                    setOrderDetails((orderDetails) => ({
                        ...orderDetails,
                        buyer: buyerDetails[0].name,
                        buyerEmail: buyerDetails[0].email,
                    }));
                }
            };

            getBuyer();

            const getTrader = async () => {
                const traderAddress = await state?.contract?.methods
                    .getTrader(hash)
                    .call({from: state.accounts[0]});
                const traderDetails = await DataStore.query(Users, (c) =>
                    c.address('eq', traderAddress)
                );
                console.log('got trader: ', traderDetails);
                if (traderDetails[0]) {
                    setOrderDetails((orderDetails) => ({
                        ...orderDetails,
                        traderEmail: traderDetails[0].email,
                        traderName: traderDetails[0].name,
                    }));
                }
            };

            getTrader();

            const getAmountToShippingLine = async () => {
                const amountInGwei = await state.contract?.methods
                    .getAmountToShippingLine(hash)
                    .call({from: state.accounts[0]});
                const amountInDollars =
                    (amountInGwei / 1000000000) * Number(await getCurrencyConversion());
                // console.log(amountInDollars);
                setOrderDetails((orderDetails) => ({
                    ...orderDetails,
                    amountToShippingLine: amountInDollars,
                }));
            };

            getAmountToShippingLine();
        }
    }, [state, hash]);

    useEffect(() => {
        if (orderState) {
            setOrderDetails((orderDetails) => ({
                ...orderDetails,
                state: STATES[orderState]['shippingLine'],
            }));
        }
    }, [orderState]);

    useEffect(() => {
        if (orderState === '22') {
            const getDocuments = async () => {
                const {
                    0: PlCid,
                    1: BlCid,
                    2: invoiceCid,
                } = await state?.contract?.methods
                    .getDocumentsFromSupplier(hash)
                    .call({from: state.accounts[0]});
                const client = makeStorageClient();
                const Pl = await (await client.get(PlCid)).files();
                const invoice = await (await client.get(invoiceCid)).files();
                console.log(Pl, invoice);
                setDocuments([Pl[0], null, invoice[0]]);
            };

            getDocuments();
        }

        if (Number(orderState) >= 6) {
            const getSupplier = async () => {
                const supplierAddress = await state.contract?.methods
                    .getSupplier(hash)
                    .call({from: state.accounts[0]});
                const supplierDetails = await DataStore.query(Users, (c) =>
                    c.address('eq', supplierAddress)
                );
                console.log(supplierDetails);
                setOrderDetails((orderDetails) => ({
                    ...orderDetails,
                    supplierName: supplierDetails[0].name,
                    supplierEmail: supplierDetails[0].email,
                }));
            };

            getSupplier();
        }
    }, [orderState]);

    return (
        <div>
            <Topbar/>
            <h1 className='ml-9 text-5xl mt-3 font-bold flex-1'>
                Order {hash.substring(0, 10)}...
            </h1>
            <>
                <p className='ml-12 text-3xl mt-3'>
                    <span className='font-medium'>Buyer: </span>
                    {orderDetails.buyer}({orderDetails.buyerEmail})
                </p>
                {Number(orderState) >= 16 && (
                    <p className='ml-12 text-3xl mt-3'>
                        <span className='font-medium'>Supplier: </span>{' '}
                        {orderDetails?.supplierName}({orderDetails?.supplierEmail})
                    </p>
                )}
                {Number(orderState) >= 6 && (
                    <p className='ml-12 text-3xl mt-3'>
                        <span className='font-medium'>Trader: </span>{' '}
                        {orderDetails?.traderName}({orderDetails?.traderEmail})
                    </p>
                )}
                {Number(orderState) >= 17 && Number(orderState) !== 21 && (
                    <>
                        <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>
                Amount per unit from supplier :{' '}
              </span>{' '}
                            ${orderDetails?.amountToShippingLine?.toFixed(2)}
                        </p>
                    </>
                )}
                <p className='ml-12 text-3xl mt-3'>
                    <span className='font-medium'>Status: </span>{' '}
                    <span className=' bg-blue-200 p-2 rounded-2xl'>
            {orderDetails?.state}
          </span>
                </p>
                <p className='ml-12 text-3xl mt-3'>
                    <span className='font-medium'>Commodity: </span>{' '}
                    {orderDetails?.commodity}
                </p>
                <p className='ml-12 text-3xl mt-3'>
                    <span className='font-medium'>Quantity: </span>{' '}
                    {orderDetails?.quantity} {orderDetails?.unit}
                </p>
                {orderDetails?.finalQuantity !== '0' && (
                    <p className='ml-12 text-3xl mt-3'>
                        <span className='font-medium'>Final Quantity: </span>{' '}
                        {orderDetails?.finalQuantity} {orderDetails?.unit}
                    </p>
                )}
                {orderState === '22' && (
                    <>
                        <p className='ml-12 text-3xl mt-3 font-medium'>Documents:</p>
                        <p className='ml-14 text-2xl mt-3'>
                            <span>PL</span>
                            <button
                                onClick={() => {
                                    saveAs(URL.createObjectURL(documents[0]), 'PL.pdf');
                                }}
                            >
                                <FontAwesomeIcon icon={faDownload} className='ml-2 text-2xl'/>
                            </button>
                        </p>
                        {Number(orderState) >= 23 && (
                            <p className='ml-14 text-2xl mt-3'>
                                <span>BL</span>
                                <button
                                    onClick={() => {
                                        saveAs(URL.createObjectURL(documents[1]), 'BL.pdf');
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faDownload}
                                        className='ml-2 text-2xl'
                                    />
                                </button>
                            </p>
                        )}
                        <p className='ml-14 text-2xl mt-3'>
                            <span>Invoice</span>
                            <button
                                onClick={() => {
                                    saveAs(URL.createObjectURL(documents[2]), 'invoice.pdf');
                                }}
                            >
                                <FontAwesomeIcon icon={faDownload} className='ml-2 text-2xl'/>
                            </button>
                        </p>
                    </>
                )}
            </>
            <div className='absolute bottom-2 right-3 w-full flex-1'>
                <div className='flex flex-row-reverse w-full'>
                    {orderState === '18' && (
                        <>
                            <RejectOrderShippingLine setError={setError} setMessageKey={setMessageKey}/>
                            <RevertOrder
                                onClick={() => setRevertOrderShippingLineVisible(true)}
                            />
                            <ConfirmOrderShippingLineToSupplier/>
                        </>
                    )}
                    {orderState === '22' && (
                        <UploadBL onClick={() => setUploadBlVisible(true)}/>
                    )}
                    {orderState === '23' && <GoodsShipped setMessageKey={setMessageKey} setError={setError}/>}
                    {orderState === '16' && (
                        <AddShippingLineAmount onClick={() => setAddAmountVisible(true)}/>
                    )}
                </div>
            </div>
            {error && (
                <Message type='error' className='mx-5 p-4 text-2xl' key={messageKey}>
                    {error}
                </Message>
            )}
            <>
                {revertOrderShippingLineVisible && (
                    <RevertOrderShippingLine
                        setRevertOrderShippingLineVisible={
                            setRevertOrderShippingLineVisible
                        }
                        accountType={'shippingLine'}
                        setShippingLineDetails={setShippingLineDetails}
                        shippingLineDetails={shippingLineDetails}
                        error={inputError}
                        messageKey={messageKey}
                        onSubmitRevertShippingLine={onSubmitRevertShippingLine}
                    />
                )}
                {uploadBlVisible && (
                    <UploadBLModal
                        setUploadBlVisible={setUploadBlVisible}
                        setBl={setBl}
                        faUpload={faUpload}
                        Bl={Bl}
                        error={inputError}
                        messageKey={messageKey}
                        onSubmitBL={onSubmitBL}
                    />
                )}
                {addAmountVisible && (
                    <Modal closable={true} onClose={() => setAddAmountVisible(false)}>
                        <div className='flex items-center'>
                            <h1 className='mx-auto text-3xl'>Specify Amount</h1>
                        </div>
                        <InputElement
                            placeholder='Amount per unit from supplier'
                            type='text'
                            onChange={(e) =>
                                setNewOrderDetails((newOrderDetails) => ({
                                    ...newOrderDetails,
                                    amountFromSupplier: Number(e.target.value),
                                }))
                            }
                        />
                        {inputError && (
                            <Message type='error' key={messageKey}>
                                {inputError}
                            </Message>
                        )}
                        <div className='flex items-center'>
                            <Button
                                type='primary'
                                className='mx-auto mt-3'
                                onClick={onSubmitAddAmount}
                            >
                                Submit
                            </Button>
                        </div>
                    </Modal>
                )}
            </>
        </div>
    );
};

export default ShippingLineOrderPage;
