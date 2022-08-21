const SupplyChain = artifacts.require('SupplyChain');
const truffleAssert = require('truffle-assertions');

contract('SupplyChain', (accounts) => {
  let _contract;

  before(async () => {
    _contract = await SupplyChain.deployed();
    buyer = accounts[0];
    trader = accounts[1];
    supplier = accounts[2];
    shippingLine = accounts[3];
  });
  describe('signUpBuyer', () => {
    it('should allow any account to sign up as a buyer', async () => {
      await _contract.signUpBuyer({ from: buyer });
      const buyersAtBuyer = await _contract.buyers(buyer);
      assert.deepStrictEqual(
        buyersAtBuyer,
        true,
        'Buyer was not added to mapping'
      );
    });
  });

  describe('signUpTrader', () => {
    it('should allow any account to sign up as a trader', async () => {
      await _contract.signUpTrader({ from: trader });
      const traderAtTraders = await _contract.traders(trader);
      assert.deepStrictEqual(
        traderAtTraders,
        true,
        'Trader was not added to mapping'
      );
    });
  });

  describe('signUpSupplier', () => {
    it('should allow any account to sign up as a supplier', async () => {
      await _contract.signUpSupplier({ from: supplier });
      const supplierAtSuppliers = await _contract.suppliers(supplier);
      assert.deepStrictEqual(
        supplierAtSuppliers,
        true,
        'Supplier was not added to mapping'
      );
    });
  });

  describe('signUpShippingLine', () => {
    it('should allow any account to sign up as a shipping line', async () => {
      await _contract.signUpShippingLine({ from: shippingLine });
      const shippingLineAtShippingLines = await _contract.shippingLines(
        shippingLine
      );
      assert.deepStrictEqual(
        shippingLineAtShippingLines,
        true,
        'Shipping line was not added to mapping'
      );
    });
  });

  describe('signUpBuyer', () => {
    it('should not allow already created accounts to sign up as buyer', async () => {
      await truffleAssert.reverts(_contract.signUpBuyer({ from: buyer }));
      await truffleAssert.reverts(_contract.signUpBuyer({ from: supplier }));
      await truffleAssert.reverts(
        _contract.signUpBuyer({ from: shippingLine })
      );
      await truffleAssert.reverts(_contract.signUpBuyer({ from: trader }));
    });
  });

  describe('signUpBuyer', () => {
    it('should not allow already created accounts to sign up as buyer', async () => {
      await truffleAssert.reverts(_contract.signUpBuyer({ from: buyer }));
      await truffleAssert.reverts(_contract.signUpBuyer({ from: supplier }));
      await truffleAssert.reverts(
        _contract.signUpBuyer({ from: shippingLine })
      );
      await truffleAssert.reverts(_contract.signUpBuyer({ from: trader }));
    });
  });

  describe('signUpTrader', () => {
    it('should not allow already created accounts to sign up as trader', async () => {
      await truffleAssert.reverts(_contract.signUpTrader({ from: buyer }));
      await truffleAssert.reverts(_contract.signUpTrader({ from: supplier }));
      await truffleAssert.reverts(
        _contract.signUpTrader({ from: shippingLine })
      );
      await truffleAssert.reverts(_contract.signUpTrader({ from: trader }));
    });
  });

  describe('signUpSupplier', () => {
    it('should not allow already created accounts to sign up as supplier', async () => {
      await truffleAssert.reverts(_contract.signUpSupplier({ from: buyer }));
      await truffleAssert.reverts(_contract.signUpSupplier({ from: supplier }));
      await truffleAssert.reverts(
        _contract.signUpSupplier({ from: shippingLine })
      );
      await truffleAssert.reverts(_contract.signUpSupplier({ from: trader }));
    });
  });

  describe('signUpShippingLine', () => {
    it('should not allow already created accounts to sign up as buyer', async () => {
      await truffleAssert.reverts(
        _contract.signUpShippingLine({ from: buyer })
      );
      await truffleAssert.reverts(
        _contract.signUpShippingLine({ from: supplier })
      );
      await truffleAssert.reverts(
        _contract.signUpShippingLine({ from: shippingLine })
      );
      await truffleAssert.reverts(
        _contract.signUpShippingLine({ from: trader })
      );
    });
  });

  describe('createOrder', () => {
    it('should not allow a trader to create an order', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '36b8f84d-df4e-4d49-b662-bcde71a8764f',
      });
      await truffleAssert.reverts(
        _contract.createOrder(hash, 1000000000, trader, 0, 'yarn', 5000, 0, {
          from: trader,
        })
      );
    });

    it('should not allow a supplier to create an order', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '36b8f84d-df3e-4d49-b562-bcde71a8764f',
      });
      await truffleAssert.reverts(
        _contract.createOrder(hash, 1000000000, trader, 0, 'yarn', 5000, 0, {
          from: supplier,
        })
      );
    });

    it('should not allow a shipping line to create an order', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '36b8f84d-df3e-4d39-b562-bcde71a8764f',
      });
      await truffleAssert.reverts(
        _contract.createOrder(hash, 1000000000, trader, 0, 'yarn', 5000, 0, {
          from: shippingLine,
        })
      );
    });

    it('should allow buyer to create order', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '24a8f84d-df3e-4d39-b562-bcde71a8764f',
      });

      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );
      const hashes = await _contract.getHashesForBuyer({ from: buyer });
      assert.deepStrictEqual(
        hashes,
        [hash],
        "Order was not added to buyer's array of orders"
      );
      console.log(hash);
      const amountToTrader = await _contract.getAmountToTrader(hash, {
        from: buyer,
      });
      assert.deepStrictEqual(
        amountToTrader.toNumber(),
        1000000000,
        'Amount to trader is not expected value'
      );

      const traderAfterTx = await _contract.getTrader(hash, { from: buyer });
      assert.deepStrictEqual(
        traderAfterTx,
        trader,
        'Trader does not match expected value'
      );

      const percentAdvanceForTrader =
        await _contract.getAdvancePercentForTrader(hash, { from: buyer });
      assert.deepStrictEqual(
        percentAdvanceForTrader.toNumber(),
        10,
        'Percent advance for trader does not match.'
      );

      const {
        0: commodity,
        1: quantity,
        2: finalQuantity,
        3: unit,
      } = await _contract.getCommodityAndQuantity(hash, { from: buyer });
      assert.deepStrictEqual(commodity, 'yarn', 'Commodity does not match');
      assert.deepStrictEqual(
        quantity.toNumber(),
        10000,
        'Quantity does not match'
      );
      assert.deepStrictEqual(unit.toNumber(), 0, "Unit doesn't match");
    });
  });

  describe('revertOrderBuyerOrTrader', () => {
    const hash = web3.utils.soliditySha3({
      type: 'string',
      value: '24a8f84d-df3e-4d39-b562-bcde71a8764f',
    });

    it('should not allow calling this function by supplier', async () => {
      await truffleAssert.reverts(
        _contract.revertOrderBuyerOrTrader(hash, 201501, 0, { from: supplier })
      );
    });

    it('should not allow calling this function by shipping line', async () => {
      await truffleAssert.reverts(
        _contract.revertOrderBuyerOrTrader(hash, 201501, 0, {
          from: shippingLine,
        })
      );
    });

    it('should allow trader to revert order to buyer when state is Created', async () => {
      const stateBeforeTransaction = await _contract.getState(hash, {
        from: trader,
      });
      console.log(stateBeforeTransaction.toNumber());
      await _contract.revertOrderBuyerOrTrader(hash, 10000000000, 20, {
        from: trader,
      });
      const amountToTrader = await _contract.getAmountToTrader(hash, {
        from: trader,
      });
      const percentAdvanceForTrader =
        await _contract.getAdvancePercentForTrader(hash, { from: trader });
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(
        amountToTrader.toNumber(),
        10000000000,
        'Amount to trader does not match expected value'
      );
      assert.deepStrictEqual(
        percentAdvanceForTrader.toNumber(),
        20,
        'Percent advance for trader does not match expected value'
      );
      assert.deepStrictEqual(
        state.toNumber(),
        2,
        'State does not match expected state'
      );
    });

    it('should allow buyer to revert order to trader', async () => {
      await _contract.revertOrderBuyerOrTrader(hash, 5000000000, 15, {
        from: buyer,
      });
      const amountToTrader = await _contract.getAmountToTrader(hash, {
        from: buyer,
      });
      const percentAdvanceForTrader =
        await _contract.getAdvancePercentForTrader(hash, {
          from: buyer,
        });
      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(
        amountToTrader.toNumber(),
        5000000000,
        'Amount to trader does not match expected value'
      );
      assert.deepStrictEqual(
        percentAdvanceForTrader.toNumber(),
        15,
        'Percent advance for trader does not match expected value'
      );
      assert.deepStrictEqual(
        state.toNumber(),
        3,
        'State does not match expected state'
      );
    });

    it('should allow trader to revert order to buyer when state is RevertedBuyerToTrader', async () => {
      const stateBeforeTransaction = await _contract.getState(hash, {
        from: trader,
      });
      console.log(stateBeforeTransaction.toNumber());
      await _contract.revertOrderBuyerOrTrader(hash, 10000000000, 20, {
        from: trader,
      });
      const amountToTrader = await _contract.getAmountToTrader(hash, {
        from: trader,
      });
      const percentAdvanceForTrader =
        await _contract.getAdvancePercentForTrader(hash, { from: trader });
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(
        amountToTrader.toNumber(),
        10000000000,
        'Amount to trader does not match expected value'
      );
      assert.deepStrictEqual(
        percentAdvanceForTrader.toNumber(),
        20,
        'Percent advance for trader does not match expected value'
      );
      assert.deepStrictEqual(
        state.toNumber(),
        2,
        'State does not match expected state'
      );
    });
  });

  describe('confirmOrderTraderToBuyer', () => {
    const hash = web3.utils.soliditySha3({
      type: 'string',
      value: '24a8f84d-df3e-4d39-b562-bcde71a8764f',
    });

    before(async () => {
      await _contract.revertOrderBuyerOrTrader(hash, 10000000000, 20, {
        from: buyer,
      });
    });

    it('should not allow confirmation of order by supplier', async () => {
      truffleAssert.reverts(
        _contract.confirmOrderTraderToBuyer(hash, { from: supplier })
      );
    });

    it('should not allow confirmation of order by shipping line', async () => {
      truffleAssert.reverts(
        _contract.confirmOrderTraderToBuyer(hash, { from: shippingLine })
      );
    });

    it('should not allow confirmation of order by buyer', async () => {
      truffleAssert.reverts(
        _contract.confirmOrderTraderToBuyer(hash, { from: buyer })
      );
    });

    it('should allow confirmation of order by trader', async () => {
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      const amountToTrader = await _contract.getAmountToTrader(hash, {
        from: trader,
      });
      const percentAdvanceForTrader =
        await _contract.getAdvancePercentForTrader(hash, { from: trader });
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(
        amountToTrader.toNumber(),
        10000000000,
        'Amount to trader does not match expected value'
      );
      assert.deepStrictEqual(
        percentAdvanceForTrader.toNumber(),
        20,
        'Percent advance for trader does not match expected value'
      );
      assert.deepStrictEqual(
        state.toNumber(),
        4,
        'State does not match expected state'
      );
    });
  });

  describe('revertOrderBuyerOrTrader', () => {
    const hash = web3.utils.soliditySha3({
      type: 'string',
      value: '24a8f84d-df3e-4d39-b562-bcde71a8764f',
    });
    it('should not allow this function after order has been confirmed', async () => {
      await truffleAssert.reverts(
        _contract.revertOrderBuyerOrTrader(hash, 1010102, 0, { from: buyer })
      );
    });
  });

  describe('rejectOrderBuyerOrTrader', () => {
    const hash = web3.utils.soliditySha3({
      type: 'string',
      value: '13a7e84d-df3e-4d39-b562-bcde71a8764f',
    });

    before(async () => {
      await _contract.createOrder(
        hash,
        5000000000,
        trader,
        10,
        'wool',
        5000,
        0,
        {
          from: buyer,
        }
      );
      console.log(hash);
    });
    it('should not allow calling this function by supplier', async () => {
      await truffleAssert.reverts(
        _contract.rejectOrderBuyerOrTrader(hash, buyer, trader, {
          from: supplier,
        })
      );
    });

    it('should not allow calling this function by shipping line', async () => {
      await truffleAssert.reverts(
        _contract.rejectOrderBuyerOrTrader(hash, buyer, trader, {
          from: shippingLine,
        })
      );
    });

    it('should allow rejection of an order by trader', async () => {
      // const buyerHashesBeforeTx = await _contract.getHashesForBuyer({
      //   from: buyer,
      // });
      // console.log('buyer hashes before tx', buyerHashesBeforeTx);
      // const traderHashesBeforeTx = await _contract.getHashesForTrader({
      //   from: trader,
      // });
      // console.log('trader hashes before tx: ', traderHashesBeforeTx);
      // console.log('hash: ', hash);
      await _contract.rejectOrderBuyerOrTrader(hash, buyer, trader, {
        from: trader,
      });

      const buyerHashes = await _contract.getHashesForBuyer({ from: buyer });
      // console.log('buyer hashes after tx: ', buyerHashes);
      assert.deepStrictEqual(
        buyerHashes,
        [
          '0x84e1b65c608ee8d59c0732d2dfa3f453b1cbe30cec08013bfd2383c8a8ece8ff',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
        'Buyer hash was not removed'
      );

      const traderHashes = await _contract.getHashesForTrader({
        from: trader,
      });
      // console.log('trader hashes after tx: ', traderHashes);
      assert.deepStrictEqual(
        traderHashes,
        [
          '0x84e1b65c608ee8d59c0732d2dfa3f453b1cbe30cec08013bfd2383c8a8ece8ff',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
        'Trader hash was not removed'
      );

      const { 0: commodity, 1: quantity } = _contract.getCommodityAndQuantity(
        hash,
        { from: trader }
      );
      assert.deepStrictEqual(commodity, undefined, 'order was not removed');
    });

    it('should allow rejection of an order by buyer', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '13b2e84d-df3e-4d39-b562-bcde71a8764f',
      });
      await _contract.createOrder(
        hash,
        5000000000,
        trader,
        10,
        'cotton',
        1000,
        0
      );
      await _contract.revertOrderBuyerOrTrader(hash, 1000000000000000000n, 20, {
        from: trader,
      });

      // const buyerHashesBeforeTx = await _contract.getHashesForBuyer({
      //   from: buyer,
      // });
      // console.log('buyer hashes before tx', buyerHashesBeforeTx);
      // const traderHashesBeforeTx = await _contract.getHashesForTrader({
      //   from: trader,
      // });
      // console.log('trader hashes before tx: ', traderHashesBeforeTx);
      // console.log('hash: ', hash);

      await _contract.rejectOrderBuyerOrTrader(hash, buyer, trader, {
        from: buyer,
      });

      const buyerHashes = await _contract.getHashesForBuyer({ from: buyer });
      // console.log('buyer hashes after tx:', buyerHashes);
      assert.deepStrictEqual(
        buyerHashes,
        [
          '0x84e1b65c608ee8d59c0732d2dfa3f453b1cbe30cec08013bfd2383c8a8ece8ff',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
        'Buyer hash was not removed'
      );

      const traderHashes = await _contract.getHashesForTrader({
        from: trader,
      });
      // console.log('trader hashes after tx: ', traderHashes);
      assert.deepStrictEqual(
        traderHashes,
        [
          '0x84e1b65c608ee8d59c0732d2dfa3f453b1cbe30cec08013bfd2383c8a8ece8ff',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
        'Trader hash was not removed'
      );

      const { 0: commodity, 1: quantity } = _contract.getCommodityAndQuantity(
        hash,
        { from: trader }
      );
      assert.deepStrictEqual(commodity, undefined, 'order was not removed');
    });
  });

  describe('confirmOrderTraderToBuyer', () => {
    it('should not allow confirmation after rejection', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '13a7e84d-df3e-4d39-b562-bcde71a8764f',
      });
      const state = await _contract.getState(hash, { from: trader });
      console.log(state.toNumber());
      await truffleAssert.reverts(
        _contract.confirmOrderTraderToBuyer(hash, { from: trader })
      );
    });
  });

  describe('acceptOrderTrader', () => {
    const hash = web3.utils.soliditySha3({
      type: 'string',
      value: '13a7e3gd-df3e-4d39-b562-a3de71a8764f',
    });
    before(async () => {
      await _contract.createOrder(
        hash,
        5000000000,
        trader,
        10,
        'wood',
        10000,
        0
      );
    });

    it('should not allow trader to accept order', async () => {
      await truffleAssert.reverts(
        _contract.acceptOrderTrader(hash, { from: trader })
      );
    });

    it('should not allow supplier to accept order', async () => {
      await truffleAssert.reverts(
        _contract.acceptOrderTrader(hash, { from: supplier })
      );
    });

    it('should not allow shipping line to accept order', async () => {
      await truffleAssert.reverts(
        _contract.acceptOrderTrader(hash, { from: shippingLine })
      );
    });

    it('should allow buyer to accept order when state is reverted trader to buyer', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: '0b4507ed-5d58-4915-9c40-3be2a0f172d5',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        20000,
        0
      );
      await _contract.revertOrderBuyerOrTrader(hash, 2000000000, 20, {
        from: trader,
      });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      const traderInHash = await _contract.getTrader(hash, { from: buyer });
      assert.deepStrictEqual(
        traderInHash,
        trader,
        'trader was not set to trader in the order struct'
      );
      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(
        state.toNumber(),
        5,
        'state is not AcceptedTrader'
      );
    });

    it('should allow buyer to accept order when state is confirmed trader to buyer', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: '02bf366e-1a2c-11ed-861d-0242ac120002',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        20,
        'wool',
        2000,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      const traderInHash = await _contract.getTrader(hash, { from: buyer });
      assert.deepStrictEqual(
        traderInHash,
        trader,
        'trader was not set to trader in the order struct'
      );
      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(
        state.toNumber(),
        5,
        'state is not AcceptedTrader'
      );
    });
  });

  describe('confirmOrderTraderToBuyer', () => {
    it('should not allow calling this function after acceptance of trader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: '02bf366e-1a2c-11ed-861d-0242ac120002',
      });
      await truffleAssert.reverts(
        _contract.acceptOrderTrader(hash, { from: buyer })
      );
    });
  });

  describe('addSupplierToOrder', () => {
    // not checking for access because onlyTrader was already checked with confirmOrderTraderToBuyer
    it('should allow calling this function when state is AcceptedTrader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'f2c90a02-1a2e-11ed-861d-0242ac120002',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        2000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 1200000000, 5, hash, {
        from: trader,
      });
      const amountToSupplier = await _contract.getAmountToSupplier(hash, {
        from: trader,
      });
      assert.deepStrictEqual(
        amountToSupplier.toNumber(),
        1200000000,
        'amount to supplier does not match'
      );
      const percentAdvanceForSupplier =
        await _contract.getAdvancePercentForSupplier(hash, { from: trader });
      assert.deepStrictEqual(
        percentAdvanceForSupplier.toNumber(),
        5,
        'advance% for supplier doesnt match'
      );
      const supplierHashes = await _contract.getHashesForSupplier({
        from: supplier,
      });
      assert.deepStrictEqual(
        supplierHashes,
        [hash],
        'supplier hashes dont match'
      );
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 6, 'state does not match');
    });

    it('should allow calling this function when state is RejectedSupplier', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: '53ce73ae-1a30-11ed-861d-0242ac120002',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        2000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 130000000, 20, hash, {
        from: trader,
      });
      await _contract.rejectOrderSupplierOrTrader(hash, supplier, {
        from: supplier,
      });
      const stateAfterRejection = await _contract.getState(hash, {
        from: trader,
      });
      console.log(stateAfterRejection.toNumber());
      await _contract.signUpSupplier({ from: accounts[4] });
      const supplierStatus = await _contract.suppliers(supplier);
      await _contract.addSupplierToOrder(accounts[4], 1200000000, 10, hash, {
        from: trader,
      });
      const amountToSupplier = await _contract.getAmountToSupplier(hash, {
        from: trader,
      });
      assert.deepStrictEqual(
        amountToSupplier.toNumber(),
        1200000000,
        'amount to supplier does not match'
      );
      const percentAdvanceForSupplier =
        await _contract.getAdvancePercentForSupplier(hash, { from: trader });
      assert.deepStrictEqual(
        percentAdvanceForSupplier.toNumber(),
        10,
        'advance% for supplier doesnt match'
      );
      const supplierHashes = await _contract.getHashesForSupplier({
        from: accounts[4],
      });
      assert.deepStrictEqual(
        supplierHashes,
        [hash],
        'supplier hashes dont match'
      );
      const state = await _contract.getState(hash, { from: accounts[4] });
      assert.deepStrictEqual(state.toNumber(), 6, 'state does not match');
    });
  });

  describe('acceptOrderSupplier', () => {
    // not testing onlyTrader because this modifier was already tested with previous functions
    it('should allow trader to accept order after order is confirmed by suppier', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a7fec45c-1a34-11ed-861d-0242ac120002',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        20,
        'yarn',
        5000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 150000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(state.toNumber(), 11, 'state does not match');
    });

    it('should allow trader to accept order after order is reverted from supplier to trader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a7fec42c-1b24-11ed-861d-0242ac120002',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        20,
        'yarn',
        5000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 150000000, 20, hash, {
        from: trader,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 170000000, 30, {
        from: supplier,
      });

      await _contract.acceptOrderSupplier(hash, { from: trader });
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(state.toNumber(), 11, 'state does not match');
    });
  });

  describe('rejectOrderSupplierOrTrader', () => {
    let hash;
    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a7fec45c-1a34-11ed-861d-0241ad010001',
      });

      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        5000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 80000000, 20, hash, {
        from: trader,
      });
    });

    it('should not allow shipping line to call this function', async () => {
      await truffleAssert.reverts(
        _contract.rejectOrderSupplierOrTrader(hash, supplier, {
          from: shippingLine,
        })
      );
    });

    it('should not allow buyer to call this function', async () => {
      await truffleAssert.reverts(
        _contract.rejectOrderSupplierOrTrader(hash, supplier, {
          from: buyer,
        })
      );
    });

    it('should allow this function be called after supplier is found', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a7fec45c-1a34-11ed-861d-0241ad010001',
      });

      const prevHash1 = await web3.utils.soliditySha3({
        type: 'string',
        value: '53ce73ae-1a30-11ed-861d-0242ac120002',
      });

      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(accounts[4], 70000000, 5, hash, {
        from: trader,
      });
      await _contract.rejectOrderSupplierOrTrader(hash, accounts[4], {
        from: accounts[4],
      });
      const state = await _contract.getState(hash, { from: accounts[4] });
      assert.deepStrictEqual(state.toNumber(), 10, 'State does not match');
      const supplierHashes = await _contract.getHashesForSupplier({
        from: accounts[4],
      });
      console.log(supplierHashes);
      assert.deepStrictEqual(
        supplierHashes,
        [
          prevHash1,
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ],
        'supplier hashes dont match'
      );
    });

    it('should allow this function to be called after order is reverted from trader to supplier', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a4egc36c-1d34-11ed-861d-0241ad010001',
      });
      const prevHash1 = await web3.utils.soliditySha3({
        type: 'string',
        value: '53ce73ae-1a30-11ed-861d-0242ac120002',
      });

      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(accounts[4], 70000000, 5, hash, {
        from: trader,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 90000000, 10, {
        from: supplier,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 80000000, 10, {
        from: trader,
      });
      await _contract.rejectOrderSupplierOrTrader(hash, accounts[4], {
        from: accounts[4],
      });
      const state = await _contract.getState(hash, { from: accounts[4] });
      assert.deepStrictEqual(state.toNumber(), 10, 'State does not match');
      const supplierHashes = await _contract.getHashesForSupplier({
        from: accounts[4],
      });
      assert.deepStrictEqual(supplierHashes, [
        prevHash1,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]);
    });

    it('should allow this function to be called after order is reverted from supplier to trader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'a4egc36c-1d34-11ed-861d-0241ad010001',
      });
      const prevHash1 = await web3.utils.soliditySha3({
        type: 'string',
        value: '53ce73ae-1a30-11ed-861d-0242ac120002',
      });

      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(accounts[4], 70000000, 5, hash, {
        from: trader,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 90000000, 10, {
        from: supplier,
      });
      await _contract.rejectOrderSupplierOrTrader(hash, accounts[4], {
        from: accounts[4],
      });
      const state = await _contract.getState(hash, { from: accounts[4] });
      assert.deepStrictEqual(state.toNumber(), 10, 'State does not match');
      const supplierHashes = await _contract.getHashesForSupplier({
        from: accounts[4],
      });
      assert.deepStrictEqual(supplierHashes, [
        prevHash1,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]);
    });
  });

  describe('revertOrderSupplierOrTrader', () => {
    let hash;

    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'd0bfb216-7e78-4f3d-b034-26906fb4f967',
      });
    });
    // not testing access because I already tested onlySupplierOrTrader modifier with rejectOrderSupplierOrTrader
    it('should allow this function to run when supplier has been found', async () => {
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 80000000, 20, hash, {
        from: trader,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 90000000, 20, {
        from: supplier,
      });
      const amountToSupplier = await _contract.getAmountToSupplier(hash, {
        from: supplier,
      });
      assert.deepStrictEqual(
        amountToSupplier.toNumber(),
        90000000,
        'amount to supplier does not match'
      );
      const percentAdvanceForSupplier =
        await _contract.getAdvancePercentForSupplier(hash, { from: supplier });
      assert.deepStrictEqual(
        percentAdvanceForSupplier.toNumber(),
        20,
        'advance% for supplier doesnt match'
      );
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 7, 'state does not match');
    });

    it('should allow this function to run when state is reverted supplier to trader', async () => {
      await _contract.revertOrderSupplierOrTrader(hash, 100000000, 25, {
        from: trader,
      });
      const amountToSupplier = await _contract.getAmountToSupplier(hash, {
        from: supplier,
      });
      assert.deepStrictEqual(
        amountToSupplier.toNumber(),
        100000000,
        'amount to supplier does not match'
      );
      const percentAdvanceForSupplier =
        await _contract.getAdvancePercentForSupplier(hash, {
          from: supplier,
        });
      assert.deepStrictEqual(
        percentAdvanceForSupplier.toNumber(),
        25,
        'advance% for supplier doesnt match'
      );
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 8, 'state does not match');
    });

    it('should allow this function to run when state is reverted trader to supplier', async () => {
      await _contract.revertOrderSupplierOrTrader(hash, 90000000, 20, {
        from: supplier,
      });
      const amountToSupplier = await _contract.getAmountToSupplier(hash, {
        from: supplier,
      });
      assert.deepStrictEqual(
        amountToSupplier.toNumber(),
        90000000,
        'amount to supplier does not match'
      );
      const percentAdvanceForSupplier =
        await _contract.getAdvancePercentForSupplier(hash, {
          from: supplier,
        });
      assert.deepStrictEqual(
        percentAdvanceForSupplier.toNumber(),
        20,
        'advance% for supplier doesnt match'
      );
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 7, 'state does not match');
    });
  });

  describe('confirmOrderSupplierToTrader', () => {
    let hash;
    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'e971f4e9-466b-41df-b5c4-e7fbe2235b3d',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        20,
        'yarn',
        25000,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 80000000, 20, hash, {
        from: trader,
      });
    });

    it('should not allow trader to call this function', async () => {
      await truffleAssert.reverts(
        _contract.confirmOrderSupplierToTrader(hash, { from: trader })
      );
    });

    it('should not allow buyer to call this function', async () => {
      await truffleAssert.reverts(
        _contract.confirmOrderSupplierToTrader(hash, { from: buyer })
      );
    });

    it('should not allow shipping line to call this function', async () => {
      await truffleAssert.reverts(
        _contract.confirmOrderSupplierToTrader(hash, { from: shippingLine })
      );
    });

    it('should allow supplier to call this function when supplier has just been found', async () => {
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 9, 'state does not match');
    });

    it('should allow supplier to call this function when order has been reverted to supplier', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: '0cbdf8bc-2edb-416e-b9a4-583d413ced7e',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        20,
        'yarn',
        25000,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 80000000, 20, hash, {
        from: trader,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 90000000, 15, {
        from: supplier,
      });
      await _contract.revertOrderSupplierOrTrader(hash, 100000000, 20, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, {
        from: supplier,
      });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 9, 'state does not match');
    });
  });

  describe('getSupplier', () => {
    let hash;
    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'f345e6cf-db39-4649-9b0b-57498698b29e',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        20,
        'yarn',
        25000,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 80000000, 20, hash, {
        from: trader,
      });
    });

    it('should not allow buyer to get supplier', async () => {
      await truffleAssert.reverts(_contract.getSupplier(hash, { from: buyer }));
    });

    it('should not allow non-user to get supplier', async () => {
      await truffleAssert.reverts(
        _contract.getSupplier(hash, { from: accounts[6] })
      );
    });
  });

  describe('getBuyer', () => {
    let hash;
    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'bd3b10f6-9578-4a57-b5f2-cb5736150a37',
      });
      await _contract.createOrder(hash, 100000000, trader, 20, 'yarn', 2500, 0);
    });

    it('should not allow supplier to get buyer', async () => {
      await truffleAssert.reverts(_contract.getBuyer(hash, { from: supplier }));
    });

    it('should not allow non-user to get buyer', async () => {
      await truffleAssert.reverts(
        _contract.getBuyer(hash, { from: accounts[6] })
      );
    });
  });

  describe('getTrader', () => {
    it('should not allow non-user to get trader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'bd3b10f6-9578-4a57-b5f2-cb5736150a37',
      });
      await truffleAssert.reverts(
        _contract.getTrader(hash, { from: accounts[6] })
      );
    });
  });

  describe('getAmountToTrader', () => {
    it('should not allow non-user to get amount to trader', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'bd3b10f6-9578-4a57-b5f2-cb5736150a37',
      });
      await truffleAssert.reverts(
        _contract.getAmountToTrader(hash, { from: accounts[6] })
      );
    });
  });

  describe('getAmountToSupplier', () => {
    it('should not allow non-user to get amount to supplier', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'bd3b10f6-9578-4a57-b5f2-cb5736150a37',
      });
      await truffleAssert.reverts(
        _contract.getAmountToSupplier(hash, { from: accounts[6] })
      );
    });
  });

  describe('getShippingLine', () => {
    it('should not allow non-user to get shipping line of an order', async () => {
      const hash = await web3.utils.soliditySha3({
        type: 'string',
        value: 'bd3b10f6-9578-4a57-b5f2-cb5736150a37',
      });
      await truffleAssert.reverts(
        _contract.getShippingLine(hash, { from: accounts[6] })
      );
    });
  });

  // not testing getAdvancePercentForTrader because its access modifier is the same as getAmountToTrader

  // not testing getAdvancePercentForSupplier because its accesss modifier is the same as getAmountToSupplier

  // not testing getAmountToShippingLine because its access modifier is the same as getShippingLine

  describe('updateStateBySupplier', () => {
    // not testing for access because the access modifier(onlySupplier) has already been tested

    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '3aaef101-4d24-4525-835f-1a12fe14cf8d',
      });
      console.log(hash);
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        20,
        'yarn',
        5000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 150000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
    });

    it('should not allow update state when supplier has not been accepted', async () => {
      const update = web3.utils.soliditySha3({
        type: 'string',
        value: 'MaterialSourced',
      });
      const state = await _contract.getState(hash, { from: supplier });
      await truffleAssert.reverts(
        _contract.updateStateBySupplier(hash, update, { from: supplier })
      );
      await _contract.acceptOrderSupplier(hash, { from: trader });
    });

    it('should allow setting state to material sourced after accepted trader', async () => {
      const update = web3.utils.soliditySha3({
        type: 'string',
        value: 'MaterialSourced',
      });
      await _contract.updateStateBySupplier(hash, update, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(
        state.toNumber(),
        12,
        'state is not material sourced'
      );
    });

    it('should allow setting state to material sourced after in factory', async () => {
      const update1 = web3.utils.soliditySha3({
        type: 'string',
        value: 'InFactory',
      });
      await _contract.updateStateBySupplier(hash, update1, { from: supplier });
      const update2 = web3.utils.soliditySha3({
        type: 'string',
        value: 'MaterialSourced',
      });
      await _contract.updateStateBySupplier(hash, update2, {
        from: supplier,
      });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(
        state.toNumber(),
        12,
        'state is not material sourced'
      );
    });

    it('should allow setting state to material sourced after quality control', async () => {
      const update0 = web3.utils.soliditySha3({
        type: 'string',
        value: 'InFactory',
      });
      await _contract.updateStateBySupplier(hash, update0, { from: supplier });
      const update1 = web3.utils.soliditySha3({
        type: 'string',
        value: 'QualityControl',
      });
      await _contract.updateStateBySupplier(hash, update1, { from: supplier });
      const update2 = web3.utils.soliditySha3({
        type: 'string',
        value: 'MaterialSourced',
      });
      await _contract.updateStateBySupplier(hash, update2, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(
        state.toNumber(),
        12,
        'state is not material sourced'
      );
    });

    it('should allow setting state to in factory after material sourced', async () => {
      const update = web3.utils.soliditySha3({
        type: 'string',
        value: 'InFactory',
      });
      await _contract.updateStateBySupplier(hash, update, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 13, 'state is not in factory');
    });

    it('should allow setting state to in factory after quality control', async () => {
      const update1 = web3.utils.soliditySha3({
        type: 'string',
        value: 'QualityControl',
      });
      await _contract.updateStateBySupplier(hash, update1, { from: supplier });
      const update2 = web3.utils.soliditySha3({
        type: 'string',
        value: 'InFactory',
      });
      await _contract.updateStateBySupplier(hash, update2, {
        from: supplier,
      });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 13, 'state is not in factory');
    });

    it('should not allow setting state to quality control after material sourced', async () => {
      const update1 = web3.utils.soliditySha3({
        type: 'string',
        value: 'MaterialSourced',
      });
      await _contract.updateStateBySupplier(hash, update1, {
        from: supplier,
      });
      const update2 = web3.utils.soliditySha3({
        type: 'string',
        value: 'QualityControl',
      });
      await truffleAssert.reverts(
        _contract.updateStateBySupplier(hash, update2, { from: supplier })
      );
    });

    it('should allow setting state to quality control after in factory', async () => {
      const update1 = web3.utils.soliditySha3({
        type: 'string',
        value: 'InFactory',
      });
      await _contract.updateStateBySupplier(hash, update1, {
        from: supplier,
      });
      const update2 = web3.utils.soliditySha3({
        type: 'string',
        value: 'QualityControl',
      });
      await _contract.updateStateBySupplier(hash, update2, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(
        state.toNumber(),
        14,
        'state is not quality control'
      );
    });
  });

  describe('updateStateByBuyer', () => {
    // not testing for access specifiers because onlyBuyer was already tested with createOrder
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '2da8445a-b431-49db-9ce3-89c52899d60c',
      });
    });

    it('should not allow set state to closed if state is not documents verified by buyer', async () => {
      await truffleAssert.reverts(
        _contract.updateStateByBuyer(
          hash,
          web3.utils.soliditySha3({ type: 'string', value: 'Closed' }),
          { from: buyer }
        )
      );
    });

    it('should not allow set state to documents verified by trader if state is not documents updated by trader', async () => {
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );

      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      await _contract.uploadBL(hash, 'testBL', { from: shippingLine });
      await _contract.ship(hash, { from: shippingLine });
      await _contract.updateStateByTrader(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'DocumentsVerifiedByTrader',
        }),
        { from: trader }
      );
      await truffleAssert.reverts(
        _contract.updateStateByBuyer(
          hash,
          web3.utils.soliditySha3({
            type: 'string',
            value: 'DocumentsVerifiedByBuyer',
          }),
          { from: buyer }
        )
      );
    });

    it('should allow set state to documents verified by buyer if state is documents updated by trader', async () => {
      await _contract.updateDocumentsFromSupplier(
        'test2Invoice',
        'test2PL',
        'test2BL',
        hash,
        { from: trader }
      );
      console.log(await _contract.getState(hash, { from: buyer }));
      await _contract.getDocumentsFromTrader(hash, { from: buyer });
      await _contract.updateStateByBuyer(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'DocumentsVerifiedByBuyer',
        }),
        { from: buyer }
      );

      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(
        state.toNumber(),
        27,
        'state is not DocumentsVerifiedbyBuyer'
      );
    });

    it('should allow set state to closed if state is documents verified by buyer', async () => {
      await _contract.updateStateByBuyer(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'Closed' })
      );
      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(state.toNumber(), 28, 'state is not Closed');
    });
  });

  describe('updateStateByTrader', () => {
    // not testing for onlyTrader because this modifier was already tested by previous functions
    let hash;

    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: 'a55675f1-adda-4310-8b59-5eed1908d91f',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
    });

    it('should not allow this function to run when state is not bluploaded', async () => {
      await truffleAssert.reverts(
        _contract.updateStateByTrader(
          hash,
          web3.utils.soliditySha3({
            type: 'string',
            value: 'DocumentsVerifiedByTrader',
          }),
          { from: trader }
        )
      );
    });

    it('should change state to documents verified', async () => {
      await _contract.uploadBL(hash, 'testBL', { from: shippingLine });
      await _contract.ship(hash, { from: shippingLine });
      await _contract.updateStateByTrader(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'DocumentsVerifiedByTrader',
        }),
        { from: trader }
      );
      const state = await _contract.getState(hash, { from: trader });
      assert.deepStrictEqual(
        state.toNumber(),
        25,
        'state is not DocumentsVerifiedByTrader'
      );
    });
  });

  describe('uploadBL', () => {
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '39f83ab0-3419-484c-a36a-8000cb1367a0',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
    });

    it('should not allow to uploadBL if state isnt AcceptedShippingLine', async () => {
      await truffleAssert.reverts(
        _contract.uploadBL(hash, 'testBL', { from: shippingLine })
      );
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      const state = await _contract.getState(hash, { from: supplier });
      console.log('State after accepting shipping line: ', state.toNumber());
    });

    it('should not allow trader to upload BL', async () => {
      await truffleAssert.reverts(
        _contract.uploadBL(hash, 'testBL', { from: trader })
      );
    });

    it('should not allow supplier to upload BL', async () => {
      await truffleAssert.reverts(
        _contract.uploadBL(hash, 'testBL', { from: supplier })
      );
    });

    it('should not allow buyer to upload BL', async () => {
      await truffleAssert.reverts(
        _contract.uploadBL(hash, 'testBL', { from: buyer })
      );
    });

    it('should set state to BLUploaded', async () => {
      await _contract.uploadBL(hash, 'testBL3', { from: shippingLine });
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(state.toNumber(), 23, 'state isnt bl uploaded');
    });

    it('should set BL to provided BL', async () => {
      await _contract.ship(hash, { from: shippingLine });
      const { 1: BL } = await _contract.getDocumentsFromShippingLine(hash, {
        from: trader,
      });
      console.log(BL);
      assert.deepStrictEqual(BL, 'testBL3', 'BL doesnt match');
    });
  });

  describe('onProductionComplete', () => {
    // not testing access modifier onlySupplier because it was already tested previously
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '39f83ab0-3419-484c-a36a-8000cb1367a0',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
    });

    it('should not allow production to be complete until quality control is complete', async () => {
      await truffleAssert.reverts(
        _contract.onProductionComplete('testPL', 'testInvoice', 9000, hash, {
          from: supplier,
        })
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
    });

    it('should set state to production complete', async () => {
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(
        state.toNumber(),
        15,
        'state isnt production complete'
      );
    });

    it('should set PL to specified PL', async () => {
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      const { 0: PL } = await _contract.getDocumentsFromSupplier(hash, {
        from: shippingLine,
      });
      assert.deepStrictEqual(PL, 'testPL', 'PL doesnt match');
    });

    it('should set final quantity to specified quantity', async () => {
      const { 2: finalQuantity } = await _contract.getCommodityAndQuantity(
        hash,
        {
          from: shippingLine,
        }
      );
      assert.deepStrictEqual(
        finalQuantity.toNumber(),
        9000,
        "final quantity doesn't match"
      );
    });

    it('should set invoice to specified invoice', async () => {
      const { 2: invoice } = await _contract.getDocumentsFromSupplier(hash, {
        from: shippingLine,
      });
      assert.deepStrictEqual(invoice, 'testInvoice', 'invoice doesnt match');
    });
  });

  describe('getDocumentsFromSupplier', () => {
    // onlyTrader modifier already tested with updateStateByTrader
    let hash;
    it('should not trader to get documents when Bl isnt uploaded', async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '1925c113-7ab3-4528-9bae-2dfaf2ec9c1e',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        10000,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      await truffleAssert.reverts(
        _contract.getDocumentsFromSupplier(hash, { from: trader })
      );
    });
  });

  describe('updateDocumentsFromSupplier', () => {
    // onlyTrader modified already tested with previous functions
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: 'da3387d3-6406-4d10-ae64-6367b33ea1f4',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        2500,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      await _contract.uploadBL(hash, 'testBL', { from: shippingLine });
    });

    it('should not allow trader to update documents from supplier until the documents are verified by the trader', async () => {
      await truffleAssert.reverts(
        _contract.updateDocumentsFromSupplier(
          'testInvoice',
          'testPL',
          'testBL',
          hash,
          { from: trader }
        )
      );
      await _contract.ship(hash, { from: shippingLine });
      await _contract.updateStateByTrader(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'DocumentsVerifiedByTrader',
        }),
        { from: trader }
      ); // sets state to documentsverified
      await _contract.updateDocumentsFromSupplier(
        'testInvoice',
        'testPL',
        'testBL',
        hash,
        { from: trader }
      );
    });
    it('should set state to DocumentsUpdatedByTrader', async () => {
      const state = await _contract.getState(hash, { from: buyer });
      assert.deepStrictEqual(state.toNumber(), 26, 'state doesnt match');
    });

    it('should set documents to specified documents', async () => {
      const {
        0: PL,
        1: BL,
        2: invoice,
      } = await _contract.getDocumentsFromTrader(hash, { from: buyer });
      assert.deepStrictEqual(PL, 'testPL', 'pl doesnt match');
      assert.deepStrictEqual(BL, 'testBL', 'bl doesnt match');
      assert.deepStrictEqual(invoice, 'testInvoice', 'invoice doesnt match');
    });
  });

  describe('updateStateByBuyer', () => {
    it('should set state to DocumentsReceivedByBuyer after goods get shipped', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: 'da3387d3-6406-4d10-ae64-6367b33ea1f4',
      });
    });
  });

  describe('getDocumentsFromTrader', () => {
    it('should not allow buyer to get documents when goods have not been shipped', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: 'da3387d3-6406-4e50-ae64-6367b33ea1f4',
      });
      await _contract.createOrder(
        hash,
        1000000000,
        trader,
        10,
        'yarn',
        2500,
        0
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 200000000, 20, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      await _contract.uploadBL(hash, 'testBL', { from: shippingLine });
      await truffleAssert.reverts(
        _contract.getDocumentsFromTrader(hash, { from: buyer })
      );
    });
  });

  describe('getHashesForBuyer', () => {
    it('should get all the hashes for buyer account', async () => {
      await _contract.signUpBuyer({ from: accounts[6] });
      await _contract.signUpTrader({ from: accounts[7] });
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '139712ee-b284-4872-a2d0-205a5367adaf',
      });
      await _contract.createOrder(
        hash,
        100000000,
        accounts[7],
        10,
        'yarn',
        2500,
        0,
        {
          from: accounts[6],
        }
      );
      const hashes = await _contract.getHashesForBuyer({ from: accounts[6] });
      assert.deepStrictEqual(hashes, [hash], 'hashes dont match');
    });
  });

  describe('getHashesForTrader', () => {
    it('should get all the hashes for trader account', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '139712ee-b284-4872-a2d0-205a5367adaf',
      });
      const hashes = await _contract.getHashesForTrader({ from: accounts[7] });
      assert.deepStrictEqual(hashes, [hash], 'hashes dont match');
    });
  });

  describe('getHashesForSupplier', () => {
    it('should get all hashes for supplier account', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '139712ee-b284-4872-a2d0-205a5367adaf',
      });
      await _contract.signUpSupplier({ from: accounts[8] });
      await _contract.confirmOrderTraderToBuyer(hash, { from: accounts[7] });
      await _contract.acceptOrderTrader(hash, { from: accounts[6] });
      await _contract.addSupplierToOrder(accounts[8], 50000000, 20, hash, {
        from: accounts[7],
      });
      const hashes = await _contract.getHashesForSupplier({
        from: accounts[8],
      });
      assert.deepStrictEqual([hash], hashes, 'hashes dont match');
    });
  });

  describe('getHashesForShippingLine', () => {
    it('should get all the hashes for a shipping line account', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '139712ee-b284-4872-a2d0-205a5367adaf',
      });
      await _contract.signUpShippingLine({ from: accounts[9] });
      await _contract.confirmOrderSupplierToTrader(hash, { from: accounts[8] });
      await _contract.acceptOrderSupplier(hash, { from: accounts[7] });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: accounts[8] }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: accounts[8] }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'QualityControl' }),
        { from: accounts[8] }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: accounts[8],
        }
      );
      await _contract.addShippingLineToOrder(accounts[9], hash, {
        from: accounts[8],
      });
      const hashes = await _contract.getHashesForShippingLine({
        from: accounts[9],
      });
      assert.deepStrictEqual([hash], hashes, 'hashes dont match');
    });
  });

  describe('addAmountShippingLine', () => {
    it('should not allow adding amount when state is not foundshippingline', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4171-b5eb-3ad3df59a03c',
      });
      await truffleAssert.reverts(
        _contract.addAmountShippingLine(hash, 1000000000, {
          from: shippingLine,
        })
      );
    });
  });

  describe('addShippingLineToOrder', () => {
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4171-b5eb-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'QualityControl' }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
    });

    it('should allow supplier to add shipping line when state is production complete', async () => {
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
    });

    it('should set shipping line in order to shipping line', async () => {
      const shippingLineInOrder = await _contract.getShippingLine(hash, {
        from: supplier,
      });
      assert.deepStrictEqual(
        shippingLineInOrder,
        shippingLine,
        'shipping lines dont match'
      );
    });

    it('should add hash to shipping line hashes', async () => {
      const shippingLineHashes = await _contract.getHashesForShippingLine({
        from: shippingLine,
      });
      assert.deepStrictEqual(
        shippingLineHashes,
        [
          '0x4d0191bb1e1e6d5b89a21c7b439d02c8482923b257e4487e350cdd68129bf7f6',
          '0x3554eda86e9ca689c87d086b0dcce6945958c4866c3833f42c72bfb2abf970fc',
          '0xcb729f0f494603239b4c71e63bc669a40d24b48ab43e4eeb5b2f2345fbe0e952',
          '0xcb729f0f494603239b4c71e63bc669a40d24b48ab43e4eeb5b2f2345fbe0e952',
          '0x9082d902e7a6d64ebed3a0cd3e0cc2bfdba7620144156e0db724055fd1a09cc7',
          '0xc5453e6585c0762ba62a5bfe5b78d8cb97d1feb4e959545dce86030948c90de6',
          '0x1905419096a209da1c9ae4332e8c84cc9abde532333f4040cee7b3cfc9641652',
          hash,
        ],
        'hashes dont match'
      );
    });

    it('should set state to found shipping line', async () => {
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(
        state.toNumber(),
        16,
        'state isnt foundshippingline'
      );
    });
  });

  describe('addAmountShippingLine', async () => {
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4171-b5eb-3ad3df59a03c',
      });
    });

    // not testing access modifier because it is already tested in other functions

    it('should allow adding amount to shipping line after shipping line has been found', async () => {
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
    });

    it('should set state to AddedAmountShippingLine', async () => {
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(
        state.toNumber(),
        17,
        'state is not AddedAmountToShippingLine'
      );
    });

    it('should set amountToShippingLine to specified amount', async () => {
      const amountToShippingLine = await _contract.getAmountToShippingLine(
        hash,
        { from: shippingLine }
      );
      assert.deepStrictEqual(
        amountToShippingLine.toNumber(),
        1000000000,
        "amount to shipping line doesn't match"
      );
    });
  });

  describe('revertOrderShippingLine', () => {
    let hash;
    before(async () => {
      hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4171-b5eb-3ad3df59a03c',
      });
    });
    it('should let shipping line revert order to supplier after shipping line has specified amount', async () => {
      await _contract.revertOrderShippingLine(hash, 50000, { from: supplier });
      await _contract.revertOrderShippingLine(hash, 50000000, {
        from: shippingLine,
      });
    });

    it('should set state to RevertedShippingLineToSupplier', async () => {
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(state.toNumber(), 19, 'state doesnt match');
    });

    it('should let supplier revert order to shipping line after shipping line reverts order to supplier', async () => {
      await _contract.revertOrderShippingLine(hash, 50000000, {
        from: supplier,
      });
    });

    it('should set state to RevertedSupplierToShippingLine', async () => {
      const state = await _contract.getState(hash, {
        from: shippingLine,
      });
      assert.deepStrictEqual(state.toNumber(), 18, 'state doesnt match');
    });

    it('should let shipping line revert order to supplier after supplier reverts order to shipping line', async () => {
      await _contract.revertOrderShippingLine(hash, 60000000, {
        from: shippingLine,
      });
    });

    it('should set state to RevertedShippingLineToSupplier', async () => {
      const state = await _contract.getState(hash, {
        from: shippingLine,
      });
      assert.deepStrictEqual(state.toNumber(), 19, 'state doesnt match');
    });

    it('should set amountToShippingLine to specified amount', async () => {
      const amountToShippingLine = await _contract.getAmountToShippingLine(
        hash,
        { from: shippingLine }
      );
      assert.deepStrictEqual(
        amountToShippingLine.toNumber(),
        60000000,
        'amount doesnt match'
      );
    });
  });

  describe('rejectOrderShippingLine', () => {
    it('should allow rejection of order after amount to shipping line is added to order', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4060-b5eb-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'QualityControl' }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.rejectOrderShippingLine(hash, shippingLine, {
        from: supplier,
      });
    });

    it('should allow rejection of order by shipping line after order is reverted from supplier to shipping line', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '387ccbde-d23d-4060-b5eb-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, {
        from: supplier,
      });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'MaterialSourced',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 5000000, {
        from: supplier,
      });
      await _contract.rejectOrderShippingLine(hash, shippingLine, {
        from: shippingLine,
      });
    });

    it('should allow rejection of order by supplier after order is reverted from shipping line to supplier', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '387ccbde-d23d-4060-b4dc-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, {
        from: supplier,
      });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'MaterialSourced',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.rejectOrderShippingLine(hash, shippingLine, {
        from: supplier,
      });
    });

    it('should set state to RejectedShippingLine', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '387ccbde-d23d-4060-b4dc-3ad3df59a03c',
      });
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(
        state.toNumber(),
        21,
        'state isnt rejectedshippingline'
      );
    });

    it('should set hash at shipping line to default bytes32', async () => {
      const hash1 = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d44d-4171-b5eb-3ad3df59a03c',
      });
      const shippingLineHashes = await _contract.getHashesForShippingLine({
        from: shippingLine,
      });
      assert.deepStrictEqual(shippingLineHashes, [
        '0x4d0191bb1e1e6d5b89a21c7b439d02c8482923b257e4487e350cdd68129bf7f6',
        '0x3554eda86e9ca689c87d086b0dcce6945958c4866c3833f42c72bfb2abf970fc',
        '0xcb729f0f494603239b4c71e63bc669a40d24b48ab43e4eeb5b2f2345fbe0e952',
        '0xcb729f0f494603239b4c71e63bc669a40d24b48ab43e4eeb5b2f2345fbe0e952',
        '0x9082d902e7a6d64ebed3a0cd3e0cc2bfdba7620144156e0db724055fd1a09cc7',
        '0xc5453e6585c0762ba62a5bfe5b78d8cb97d1feb4e959545dce86030948c90de6',
        '0x1905419096a209da1c9ae4332e8c84cc9abde532333f4040cee7b3cfc9641652',
        hash1,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]);
    });
  });

  describe('addShippingLineToOrder', () => {
    it('should allow supplier to add shipping line when previous shipping line was rejected', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '387ccbde-d23d-4060-b4dc-3ad3df59a03c',
      });
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
    });
  });

  describe('acceptOrderShippingLine', () => {
    it('should allow supplier to accept order after its been reverted to supplier by shipping line', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '387ccbde-d23d-4060-b4dc-3ad3df59a03c',
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 500000000, {
        from: supplier,
      });
      await _contract.revertOrderShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
    });

    it('should allow supplier to accept order after shipping line has confirmed it', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d43e-3062-b5eb-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, {
        from: supplier,
      });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'MaterialSourced',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 500000000, {
        from: supplier,
      });
      await _contract.confirmOrderShippingLineToSupplier(hash, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
    });

    it('should set state to AcceptedShippingLine', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-d43e-3062-b5eb-3ad3df59a03c',
      });
      const state = await _contract.getState(hash, { from: supplier });
      assert.deepStrictEqual(state.toNumber(), 22, 'state doesnt match');
    });
  });

  describe('confirmOrderShippingLineToSupplier', () => {
    it('should allow shipping line to confirm order after finding shipping line', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-e34d-4171-b5eb-3ad3df59a03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'QualityControl' }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 500000000, {
        from: supplier,
      });
      await _contract.confirmOrderShippingLineToSupplier(hash, {
        from: shippingLine,
      });
    });

    it('should allow shipping line to confirm order after its reverted to shipping line by supplier', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-e34d-4171-b5eb-3ad3df58b03c',
      });
      await _contract.createOrder(
        hash,
        100000000,
        trader,
        10,
        'yarn',
        2500,
        0,
        {
          from: buyer,
        }
      );
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 90000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'InFactory' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'QualityControl' }),
        { from: supplier }
      );
      await _contract.onProductionComplete(
        'testPL',
        'testInvoice',
        9000,
        hash,
        {
          from: supplier,
        }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 500000000, {
        from: supplier,
      });
      await _contract.confirmOrderShippingLineToSupplier(hash, {
        from: shippingLine,
      });
    });

    it('should set state to ConfirmedShippingLineToSupplier', async () => {
      const hash = web3.utils.soliditySha3({
        type: 'string',
        value: '388cccdf-e34d-4171-b5eb-3ad3df58b03c',
      });
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(state.toNumber(), 20, 'state doesnt match');
    });
  });

  describe('ship', () => {
    let hash;

    before(async () => {
      hash = await web3.utils.soliditySha3({
        type: 'string',
        value:
          '31c2ce93-6e73-4b51-827d-990efc6c12fc31c2ce93-6e73-4b51-827d-990efc6c12fc',
      });
      await _contract.createOrder(hash, 50000000, trader, 0, 'yarn', 5000, 0, {
        from: buyer,
      });
      await _contract.confirmOrderTraderToBuyer(hash, { from: trader });
      await _contract.acceptOrderTrader(hash, { from: buyer });
      await _contract.addSupplierToOrder(supplier, 10000000, 10, hash, {
        from: trader,
      });
      await _contract.confirmOrderSupplierToTrader(hash, { from: supplier });
      await _contract.acceptOrderSupplier(hash, { from: trader });
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({ type: 'string', value: 'MaterialSourced' }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'InFactory',
        }),
        { from: supplier }
      );
      await _contract.updateStateBySupplier(
        hash,
        web3.utils.soliditySha3({
          type: 'string',
          value: 'QualityControl',
        }),
        { from: supplier }
      );
    });

    it('should not allow setting state to shipped when order state is not bl uploaded', async () => {
      await truffleAssert.reverts(_contract.ship(hash, { from: shippingLine }));
    });

    it('should allow setting state to shipped when order state is bl uploaded', async () => {
      await _contract.onProductionComplete(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=yPYZpwSpKmA',
        9000,
        hash,
        { from: supplier }
      );
      await _contract.addShippingLineToOrder(shippingLine, hash, {
        from: supplier,
      });
      await _contract.addAmountShippingLine(hash, 1000000000, {
        from: shippingLine,
      });
      await _contract.revertOrderShippingLine(hash, 500000000, {
        from: supplier,
      });
      await _contract.confirmOrderShippingLineToSupplier(hash, {
        from: shippingLine,
      });
      await _contract.acceptOrderShippingLine(hash, { from: supplier });
      await _contract.uploadBL(hash, 'https://google.com', {
        from: shippingLine,
      });
      await _contract.ship(hash, { from: shippingLine });
      const state = await _contract.getState(hash, { from: shippingLine });
      assert.deepStrictEqual(state.toNumber(), 24, 'state is not shipped');
    });
  });
});
