import React, {useState, useEffect} from 'react';
import Topbar from '../../components/common/Topbar';
import RejectOrderSupplier from '../../components/order-actions/buttons/RejectOrderSupplier';
import RevertOrder from '../../components/order-actions/buttons/RevertOrder';
import ConfirmOrderSupplierToTrader from '../../components/order-actions/buttons/ConfirmOrderSupplierToTrader';
import RejectOrderShippingLine from '../../components/order-actions/buttons/RejectOrderShippingLine';
import ProductionComplete from '../../components/order-actions/buttons/ProductionComplete';
import AddShippingLine from '../../components/order-actions/buttons/AddShippingLine';
import RevertOrderSupplierModal from '../../components/order-actions/modals/RevertOrderSupplierModal';
import Option from '../../components/order-actions/other/Option';
import SingleValue from '../../components/order-actions/other/SingleValue';
import UpdateStateModal from '../../components/order-actions/modals/UpdateStateModal';
import CompleteProductionModal from '../../components/order-actions/modals/CompleteProductionModal';
import {faDownload, faTimes} from '@fortawesome/free-solid-svg-icons';
import {AddShippingLineModal} from '../../components/order-actions/modals/AddShippingLineModal';
import {RevertOrderShippingLine} from '../../components/order-actions/modals/RevertOrderShippingLine';
import {useEth} from '../../contexts/EthContext';
import {useParams} from 'react-router-dom';
import {checkAmount} from '../../utils/checkAmount';
import {STATES} from '../../utils/states.js';
import {checkPercent} from '../../utils/checkPercent';
import {getCurrencyConversion} from '../../utils/getCurrencyConversion';
import {UNITS} from '../../utils/units.js';
import {DataStore} from '@aws-amplify/datastore';
import {Users} from '../../models';
import {makeStorageClient} from '../../utils/web3storage';
import UpdateStateBySupplier from '../../components/order-actions/buttons/UpdateStateBySupplier';
import AcceptOrderShippingLine from '../../components/order-actions/buttons/AcceptOrderShippingLine';
import Message from '../../components/common/Message';

const SupplierOrderPage = () => {
    const {state} = useEth();
    const {hash} = useParams();
    const [orderState, setOrderState] = useState('');
    const [orderDetails, setOrderDetails] = useState({});
    const [newOrderDetails, setNewOrderDetails] = useState({});
    const [shippingLineSelectOptions, setShippingLineSelectOptions] = useState([
        {},
    ]);
    const [supplierDocuments, setSupplierDocuments] = useState([]);
    const [stateOptions, setStateOptions] = useState([{}]);
    const [suppliersState, setSuppliersState] = useState();
    const [revertOrderSupplierVisible, setRevertOrderSupplierVisible] =
        useState(false);
    const [updateStateBySupplierVisible, setUpdateStateBySupplierVisible] =
        useState(false);
    const [completeProductionVisible, setCompleteProductionVisible] =
        useState(false);
    const [revertOrderShippingLineVisible, setRevertOrderShippingLineVisible] =
        useState(false);
    const [addShippingLineVisible, setAddShippingLineVisible] = useState(false);
    const [error, setError] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [inputError, setInputError] = useState('');
    const [finalQuantity, setFinalQuantity] = useState();
    const [shippingLineDetails, setShippingLineDetails] = useState({});

    const onSubmitRevertSupplier = async () => {
        if (checkAmount(newOrderDetails.amountToSupplier)) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError(checkAmount(newOrderDetails.amountToSupplier));
        } else if (checkPercent(newOrderDetails.percentAdvanceForSupplier)) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError(checkPercent(newOrderDetails.percentAdvanceForSupplier));
        } else {
            const amountToSupplier = String(
                Math.round(
                    (newOrderDetails.amountToSupplier /
                        Number(await getCurrencyConversion())) *
                    1000000000
                )
            );
            await state.contract?.methods
                .revertOrderSupplierOrTrader(
                    hash,
                    amountToSupplier,
                    newOrderDetails.percentAdvanceForSupplier
                )
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', (error) => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    const onSubmitState = async () => {
        if (!suppliersState) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError('Please enter a new state');
        } else {
            await state?.contract?.methods
                .updateStateBySupplier(hash, suppliersState)
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', error => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    const onSubmitSupplierFiles = async () => {
        console.log(supplierDocuments);
        if (supplierDocuments.length !== 2) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError('Please add both PL and Invoice(no extra documents)');
        } else if (
            checkPercent(Number(finalQuantity), true, Number(orderDetails?.quantity))
        ) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError(
                checkPercent(
                    Number(finalQuantity),
                    true,
                    Number(orderDetails?.quantity)
                )
            );
        } else {
            const client = makeStorageClient();
            console.log(client);
            console.log(supplierDocuments[0], supplierDocuments[1]);
            const cidPL = await client.put([supplierDocuments[0]]);
            const cidInvoice = await client.put([supplierDocuments[1]]);
            await state?.contract?.methods
                ?.onProductionComplete(
                    cidPL,
                    cidInvoice,
                    String(Number(finalQuantity) * 100),
                    hash
                )
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', error => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    const onSubmitAddShippingLine = async () => {
        console.log(shippingLineDetails);
        if (!shippingLineDetails.shippingLine) {
            setMessageKey((messageKey) => messageKey + 1);
            setInputError('Please select a shipping line');
        } else {
            await state?.contract?.methods
                .addShippingLineToOrder(
                    shippingLineDetails.shippingLine.value.address,
                    hash
                )
                .send({from: state.accounts[0]}).on('receipt', () => {
                    window.location.reload();
                }).on('error', error => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

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
                }).on('error', () => {
                    setMessageKey(messageKey => messageKey + 1);
                    setError(error.message);
                })
        }
    };

    useEffect(() => {
        const getOrderState = async () => {
            console.log(state);
            console.log(hash);
            const orderState = await state.contract?.methods
                .getState(hash)
                .call({from: state.accounts[0]});
            console.log('order state: ', orderState);
            if (orderState) setOrderState(orderState);
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

        const getAmountToSupplier = async () => {
            const amountInGwei = await state.contract?.methods
                .getAmountToSupplier(hash)
                .call({from: state.accounts[0]});
            console.log("amountinGwei: " + amountInGwei);
            const amountInDollars =
                (amountInGwei / 1000000000) * Number(await getCurrencyConversion());
            console.log("amountInDollars: " + amountInDollars);
            setOrderDetails((orderDetails) => ({
                ...orderDetails,
                amountToSupplier: amountInDollars,
            }));
        };

        getAmountToSupplier();

        const getPercentAdvanceForSupplier = async () => {
            const percentAdvanceForSupplier = await state.contract?.methods
                .getAdvancePercentForSupplier(hash)
                .call({from: state.accounts[0]});
            setOrderDetails((orderDetails) => ({
                ...orderDetails,
                percentAdvanceForSupplier:
                    percentAdvanceForSupplier === '0'
                        ? 'No advance payment'
                        : `${percentAdvanceForSupplier}%`,
            }));
        };

        getPercentAdvanceForSupplier();

        const getAmountToShippingLine = async () => {
            const amountInGwei = await state.contract?.methods
                .getAmountToShippingLine(hash)
                .call({from: state.accounts[0]});
            const amountInDollars =
                (amountInGwei / 1000000000) * Number(await getCurrencyConversion());
            if (amountInDollars) {
                setOrderDetails((orderDetails) => ({
                    ...orderDetails,
                    amountToShippingLine: amountInDollars,
                }));
            }
        };

        getAmountToShippingLine();
    }, [state, hash]);

    useEffect(() => {
        if (orderState && orderState !== '') {
            if (orderState === '11') {
                setStateOptions([
                    {
                        label: 'Material has been sourced',
                        value: state.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'MaterialSourced',
                        }),
                    },
                ]);
            } else if (orderState === '12') {
                setStateOptions([
                    {
                        label: 'Goods are in factory',
                        value: state.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'InFactory',
                        }),
                    },
                ]);
            } else if (orderState === '13') {
                setStateOptions([
                    {
                        label: 'Material should be sourced again',
                        value: state.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'MaterialSourced',
                        }),
                    },
                    {
                        label: 'Goods are undergoing quality control',
                        value: state.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'QualityControl',
                        }),
                    },
                ]);
            } else if (orderState === '14') {
                setStateOptions([
                    {
                        label: 'Material should be sourced again',
                        value: state.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'MaterialSourced',
                        }),
                    },
                ]);
            }

            if (orderState === '15' || orderState === '21') {
                const getShippingLines = async () => {
                    console.log('getting shipping lines');
                    const {...shippingLines} = await DataStore.query(Users, (s) =>
                        s.type('eq', 'SHIPPING_LINE')
                    );
                    console.log(shippingLines);
                    Object.entries(shippingLines).map((entry) => {
                        const [key, shippingLine] = entry;
                        console.log('shipping line: ', shippingLine);

                        if (
                            !shippingLineSelectOptions.includes({
                                value: shippingLine,
                                label: shippingLine,
                            })
                        ) {
                            setShippingLineSelectOptions((shippingLineSelectOptions) => [
                                ...shippingLineSelectOptions,
                                {
                                    value: shippingLine,
                                    label: shippingLine,
                                },
                            ]);
                        }
                    });
                };
                getShippingLines();
            }

            if (Number(orderState) >= 16 && orderState !== '21') {
                const getShippingLine = async () => {
                    const shippingLineAddress = await state?.contract?.methods
                        .getShippingLine(hash)
                        .call({from: state.accounts[0]});
                    console.log('shipping line address: ', shippingLineAddress);
                    const shippingLineDetails = await DataStore.query(Users, (c) =>
                        c.address('eq', shippingLineAddress)
                    );
                    if (shippingLineDetails[0]) {
                        setOrderDetails((orderDetails) => ({
                            ...orderDetails,
                            shippingLineName: shippingLineDetails[0].name,
                            shippingLineEmail: shippingLineDetails[0].email,
                        }));
                    }
                };

                getShippingLine();
            }
        }
    }, [orderState]);

    useEffect(() => {
        if (orderState !== '' && orderState) {
            setOrderDetails((orderDetails) => ({
                ...orderDetails,
                state: STATES[orderState]['supplier'],
            }));
        }
    }, [orderState]);

    useEffect(() => {
        console.log(orderDetails)
    }, [orderDetails]);

    return (
        <div>
            <Topbar/>
            <h1 className='ml-9 text-5xl mt-3 font-bold flex-1'>
                Order {hash.substring(0, 10)}...
            </h1>
            <>
                {Number(orderState) >= 6 && (
                    <>
                        <p className='ml-12 text-3xl mt-3'>
                            <span className='font-medium'>Trader: </span>{' '}
                            {orderDetails?.traderName}({orderDetails?.traderEmail})
                        </p>
                        <p className='ml-12 text-3xl mt-3'>
                            <span className='font-medium'>Amount per unit from trader: </span>{' '}
                            ${orderDetails?.amountToSupplier?.toFixed(2)}
                        </p>
                        <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>
                Percent of advance payment from trader:{' '}
              </span>
                            {orderDetails?.percentAdvanceForSupplier}
                        </p>
                    </>
                )}
                {Number(orderState) >= 16 && orderState !== '21' && (
                    <>
                        <p className='ml-12 text-3xl mt-3'>
                            <span className='font-medium'>Shipping line: </span>{' '}
                            {orderDetails?.shippingLineName}({orderDetails?.shippingLineEmail}
                            )
                        </p>
                    </>
                )}
                {Number(orderState) >= 17 && Number(orderState) !== 21 && (
                    <>
                        <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>
                Amount per unit to shipping line :{' '}
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
            </>
            <div className='absolute bottom-2 right-3 w-full flex-1'>
                <div className='flex flex-row-reverse w-full'>
                    {(orderState === '6' || orderState === '8') && (
                        <>
                            <RejectOrderSupplier setError={setError} setMessageKey={setMessageKey}/>
                            <RevertOrder
                                onClick={() => setRevertOrderSupplierVisible(true)}
                            />
                            <ConfirmOrderSupplierToTrader setMessageKey={setMessageKey} setError={setError}/>
                        </>
                    )}
                    {(orderState === '17' || orderState === '19') && (
                        <>
                            <RejectOrderShippingLine setMessageKey={setMessageKey} setError={setError}/>
                            <RevertOrder
                                onClick={() => setRevertOrderShippingLineVisible(true)}
                            />
                        </>
                    )}
                    {Number(orderState) >= 11 && Number(orderState) <= 14 && (
                        <UpdateStateBySupplier
                            onClick={() => setUpdateStateBySupplierVisible(true)}
                        />
                    )}
                    {orderState === '14' && (
                        <ProductionComplete
                            onClick={() => setCompleteProductionVisible(true)}
                        />
                    )}
                    {(orderState === '15' || orderState === '21') && (
                        <AddShippingLine onClick={() => setAddShippingLineVisible(true)}/>
                    )}
                    {(orderState === '17' ||
                        orderState === '19' ||
                        orderState === '20') && (
                        <AcceptOrderShippingLine
                            setMessageKey={setMessageKey}
                            setError={setError}
                        />
                    )}
                </div>
            </div>
            {error && (
                <Message type='error' className='mx-5 p-4 text-2xl' key={messageKey}>
                    {error}
                </Message>
            )}
            <>
                {revertOrderSupplierVisible && (
                    <>
                        <RevertOrderSupplierModal
                            setRevertOrderSupplierVisible={setRevertOrderSupplierVisible}
                            accountType={'supplier'}
                            onChangeAmountToSupplier={(e) =>
                                setNewOrderDetails((newOrderDetails) => ({
                                    ...newOrderDetails,
                                    amountToSupplier: Number(e.target.value),
                                }))
                            }
                            onChangePercentForSupplier={(e) =>
                                setNewOrderDetails((newOrderDetails) => ({
                                    ...newOrderDetails,
                                    percentAdvanceForSupplier: Number(e.target.value),
                                }))
                            }
                            error={inputError}
                            messageKey={messageKey}
                            onSubmitRevertSupplier={onSubmitRevertSupplier}
                        />
                    </>
                )}
                {updateStateBySupplierVisible && (
                    <>
                        <UpdateStateModal
                            setUpdateStateBySupplierVisible={setUpdateStateBySupplierVisible}
                            stateOptions={stateOptions}
                            setSuppliersState={setSuppliersState}
                            SingleValue={SingleValue}
                            error={inputError}
                            messageKey={messageKey}
                            onSubmitState={onSubmitState}
                        />
                    </>
                )}
                {completeProductionVisible && (
                    <CompleteProductionModal
                        setCompleteProductionVisible={setCompleteProductionVisible}
                        setSupplierDocuments={setSupplierDocuments}
                        supplierDocuments={supplierDocuments}
                        faDownload={faDownload}
                        faTimes={faTimes}
                        error={inputError}
                        messageKey={messageKey}
                        onSubmitSupplierFiles={onSubmitSupplierFiles}
                        setFinalQuantity={setFinalQuantity}
                    />
                )}
                {addShippingLineVisible && (
                    <AddShippingLineModal
                        setAddShippingLineVisible={setAddShippingLineVisible}
                        shippingLineSelectOptions={shippingLineSelectOptions}
                        Option={Option}
                        SingleValue={SingleValue}
                        setShippingLineDetails={setShippingLineDetails}
                        shippingLineDetails={shippingLineDetails}
                        error={inputError}
                        messageKey={messageKey}
                        onSubmitAddShippingLine={onSubmitAddShippingLine}
                    />
                )}
                {revertOrderShippingLineVisible && (
                    <RevertOrderShippingLine
                        setRevertOrderShippingLineVisible={
                            setRevertOrderShippingLineVisible
                        }
                        accountType={'supplier'}
                        setShippingLineDetails={setShippingLineDetails}
                        shippingLineDetails={shippingLineDetails}
                        error={inputError}
                        messageKey={messageKey}
                        onSubmitRevertShippingLine={onSubmitRevertShippingLine}
                    />
                )}
            </>
        </div>
    );
};

export default SupplierOrderPage;
